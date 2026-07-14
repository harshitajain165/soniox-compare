import asyncio
import base64
import logging
from typing import Any

import azure.cognitiveservices.speech as speechsdk

from providers.base import BaseProvider
from providers.config import (
    FeatureStatus,
    ProviderConfig,
    ProviderError,
    SupportedFeatures,
)
from utils import audio_event, data_event, error_message, make_part, session_done_event
from languages import SUPPORTED_LANGUAGES, get_provider_language, is_language_supported

log = logging.getLogger("translate.azure")

MODEL = "azure-speech-translation"

# Azure's real-time translation wants a full source *locale*, not the bare
# ISO-639-1 code this app passes around. Map the common ones; anything absent
# falls back to auto-detection across this candidate set.
_SOURCE_LOCALE = {
    "en": "en-US",
    "es": "es-ES",
    "fr": "fr-FR",
    "de": "de-DE",
    "it": "it-IT",
    "pt": "pt-PT",
    "nl": "nl-NL",
    "pl": "pl-PL",
    "ru": "ru-RU",
    "uk": "uk-UA",
    "tr": "tr-TR",
    "ar": "ar-EG",
    "hi": "hi-IN",
    "zh": "zh-CN",
    "ja": "ja-JP",
    "ko": "ko-KR",
}
# At most 4 entries: Azure's at-start language identification
# (DetectAudioAtStart, the default mode) rejects larger candidate sets by
# closing the connection with code 1007.
_AUTODETECT_CANDIDATES = ["en-US", "es-ES", "fr-FR", "de-DE"]

# A neural voice per target language, so s2s can synthesize. Translation to text
# works for any target below; only targets with a voice here can also speak.
_TARGET_VOICE = {
    "ar": "ar-EG-SalmaNeural",
    "de": "de-DE-KatjaNeural",
    "en": "en-US-JennyNeural",
    "es": "es-ES-ElviraNeural",
    "fr": "fr-FR-DeniseNeural",
    "hi": "hi-IN-SwaraNeural",
    "it": "it-IT-ElsaNeural",
    "ja": "ja-JP-NanamiNeural",
    "ko": "ko-KR-SunHiNeural",
    "nl": "nl-NL-ColetteNeural",
    "pl": "pl-PL-ZofiaNeural",
    "pt": "pt-PT-RaquelNeural",
    "ru": "ru-RU-SvetlanaNeural",
    "tr": "tr-TR-EmelNeural",
    "uk": "uk-UA-PolinaNeural",
    "zh": "zh-CN-XiaoxiaoNeural",
}


class AzureProvider(BaseProvider):
    """Azure's Speech SDK is synchronous and callback-driven: it pushes results
    from its own native threads. We bridge those callbacks back onto the asyncio
    loop with `call_soon_threadsafe` and feed audio through a PushAudioInputStream.

    Synthesis (s2s) is event-based: with a voice set and an output format
    declared, Azure fires `synthesizing` with raw PCM for the translated text.
    Only targets in `_TARGET_VOICE` can speak; the rest are text-only.
    """

    name = "azure"

    def __init__(self, config: ProviderConfig):
        super().__init__(config)
        self._api_key = config.service.api_key
        self._region = config.service.region
        self._loop: asyncio.AbstractEventLoop | None = None
        self._push_stream: speechsdk.audio.PushAudioInputStream | None = None
        self._recognizer: speechsdk.translation.TranslationRecognizer | None = None
        self._source_language: str | None = None
        # Azure keys translations by the code we register; keep the exact casing.
        self._target_key = (
            get_provider_language(config.params.target_language, "azure")
            or config.params.target_language
        )
        # True rate of the synthesized audio, parsed from the WAV header Azure
        # puts on each utterance's first chunk (see _on_synthesizing). Azure
        # delivers 16 kHz regardless of the requested output format.
        self._synth_sample_rate = 16000

    @classmethod
    def model_info(cls) -> dict[str, str]:
        return {"model": MODEL}

    @classmethod
    async def list_languages(cls, api_key: str | None = None) -> list[dict]:
        return [
            {"code": c}
            for c in SUPPORTED_LANGUAGES
            if is_language_supported(c, "azure")
        ]

    async def connect(self) -> None:
        if self._is_connected:
            return

        if not self._region:
            raise ProviderError(
                "AZURE_REGION is not set; the Azure provider needs both a key "
                "and a region."
            )

        for warning in self.validate_provider_capabilities("Azure"):
            await self.host_queue.put(warning)

        self._loop = asyncio.get_running_loop()
        hints = self.params.language_hints
        self._source_language = hints[0] if hints else None

        speaks = self.emits_audio
        voice = _TARGET_VOICE.get(self.params.target_language)
        if speaks and voice is None:
            # Reachable only via a hand-crafted request: the s2s tile is greyed
            # out for unvoiced targets. Fail loudly rather than silently muting.
            raise ProviderError(
                f"Azure has no configured voice for target "
                f"'{self.params.target_language}', so it cannot speak it."
            )

        try:
            translation_config = speechsdk.translation.SpeechTranslationConfig(
                subscription=self._api_key, region=self._region
            )
            translation_config.add_target_language(self._target_key)
            if speaks:
                # No set_speech_synthesis_output_format: translation synthesis
                # ignores it and always returns RIFF 16 kHz 16-bit mono PCM,
                # which _on_synthesizing unwraps.
                translation_config.voice_name = voice

            audio_format = speechsdk.audio.AudioStreamFormat(
                samples_per_second=self.config.common.sample_rate,
                bits_per_sample=16,
                channels=self.config.common.num_channels,
            )
            self._push_stream = speechsdk.audio.PushAudioInputStream(
                stream_format=audio_format
            )
            audio_config = speechsdk.audio.AudioConfig(stream=self._push_stream)

            # A known source locale skips the detection warm-up; otherwise let
            # Azure auto-detect across a small candidate set.
            auto_detect = None
            source_locale = (
                _SOURCE_LOCALE.get(self._source_language)
                if self._source_language
                else None
            )
            if source_locale:
                translation_config.speech_recognition_language = source_locale
                recognizer = speechsdk.translation.TranslationRecognizer(
                    translation_config=translation_config, audio_config=audio_config
                )
            else:
                auto_detect = speechsdk.languageconfig.AutoDetectSourceLanguageConfig(
                    languages=_AUTODETECT_CANDIDATES
                )
                recognizer = speechsdk.translation.TranslationRecognizer(
                    translation_config=translation_config,
                    audio_config=audio_config,
                    auto_detect_source_language_config=auto_detect,
                )
            self._recognizer = recognizer

            recognizer.recognizing.connect(self._on_recognizing)
            recognizer.recognized.connect(self._on_recognized)
            recognizer.canceled.connect(self._on_canceled)
            recognizer.session_stopped.connect(self._on_session_stopped)
            if speaks:
                recognizer.synthesizing.connect(self._on_synthesizing)

            log.info(
                "connect region=%s source=%s target=%s speaks=%s",
                self._region,
                source_locale or "auto",
                self._target_key,
                speaks,
            )
            # start_continuous_recognition_async returns immediately; .get()
            # blocks until the session is established, so run it off-loop.
            await self._loop.run_in_executor(
                None, lambda: recognizer.start_continuous_recognition_async().get()
            )
            self._is_connected = True
        except ProviderError:
            raise
        except Exception as ex:
            raise ProviderError(f"{ex}")

    # The callbacks below fire on native SDK threads. Each hops back to the
    # loop thread before touching host_queue, which is a plain asyncio.Queue
    # and not safe to mutate from another thread directly.

    def _put_from_thread(self, event: dict[str, Any]) -> None:
        if self._loop is None or self._stopped:
            return
        self._loop.call_soon_threadsafe(self._safe_put, event)

    def _safe_put(self, event: dict[str, Any]) -> None:
        if self._stopped:
            return
        self.host_queue.put_nowait(event)

    def _emit_parts(self, result: Any, is_final: bool) -> None:
        parts: list[dict] = []
        suffix = " " if is_final else ""
        source_text = result.text or ""
        if source_text.strip():
            parts.append(
                make_part(
                    text=source_text + suffix,
                    language=self._source_language,
                    source_language=self._source_language,
                    translation_status="original",
                    is_final=is_final,
                )
            )
        translation = (result.translations or {}).get(self._target_key, "")
        if translation.strip():
            parts.append(
                make_part(
                    text=translation,
                    language=self.params.target_language,
                    source_language=self._source_language,
                    translation_status="translation",
                    is_final=is_final,
                )
            )
        if parts:
            self._put_from_thread(data_event(provider=self.name, parts=parts))

    def _on_recognizing(self, evt: Any) -> None:
        self._emit_parts(evt.result, is_final=False)

    def _on_recognized(self, evt: Any) -> None:
        self._emit_parts(evt.result, is_final=True)

    def _on_synthesizing(self, evt: Any) -> None:
        audio = evt.result.audio
        if not audio:
            return
        # Azure ignores set_speech_synthesis_output_format for translation
        # synthesis and always streams RIFF-headered 16 kHz 16-bit mono PCM
        # (verified empirically: requesting raw/24 kHz formats returns the
        # identical byte stream). The first chunk of an utterance carries the
        # WAV header; forwarding it as samples plays a click, and labeling the
        # stream 24 kHz plays it 1.5x fast. Parse the real rate from the
        # header and strip it.
        if audio.startswith(b"RIFF") and len(audio) >= 44:
            rate = int.from_bytes(audio[24:28], "little")
            if 8000 <= rate <= 48000:
                self._synth_sample_rate = rate
            data_pos = audio.find(b"data", 12)
            audio = audio[data_pos + 8 :] if data_pos != -1 else audio[44:]
            if not audio:
                return
        self._put_from_thread(
            audio_event(
                provider=self.name,
                pcm_b64=base64.b64encode(audio).decode("ascii"),
                sample_rate=self._synth_sample_rate,
            )
        )

    def _on_canceled(self, evt: Any) -> None:
        reason = getattr(evt, "error_details", None) or str(getattr(evt, "reason", ""))
        # EndOfStream is the normal close after our push stream ends, not a fault.
        if getattr(evt, "reason", None) == speechsdk.CancellationReason.EndOfStream:
            self._put_from_thread(session_done_event(provider=self.name))
            return
        log.warning("azure.canceled reason=%s", reason)
        self._put_from_thread(
            error_message(provider=self.name, message=reason or "canceled")
        )

    def _on_session_stopped(self, evt: Any) -> None:
        self._put_from_thread(session_done_event(provider=self.name))

    async def send(self, data: bytes) -> None:
        if self._push_stream is not None:
            self._push_stream.write(data)

    async def send_end(self) -> None:
        # Closing the push stream is Azure's end-of-audio signal; the recognizer
        # finalizes and fires session_stopped / canceled(EndOfStream).
        if self._push_stream is not None:
            self._push_stream.close()

    async def disconnect(self) -> None:
        if self._stopped:
            return
        self._stopped = True
        self._is_connected = False
        for t in self._tasks:
            t.cancel()
        await asyncio.gather(*self._tasks, return_exceptions=True)
        if self._recognizer is not None and self._loop is not None:
            try:
                await self._loop.run_in_executor(
                    None,
                    lambda: self._recognizer.stop_continuous_recognition_async().get(),
                )
            except Exception:
                pass
        await self.host_queue.put(None)

    @staticmethod
    def get_available_features() -> SupportedFeatures:
        supported = FeatureStatus.supported()
        unsupported = FeatureStatus.unsupported()
        return SupportedFeatures(
            name="Azure",
            model=MODEL,
            text_translation=supported,
            speech_to_speech=FeatureStatus.partial(
                comment="Azure can speak the translation, but only for the "
                "subset of target languages with a configured neural voice.",
            ),
            source_transcript=supported,
            voice_selection=unsupported,
            single_multilingual_model=supported,
            language_hints=supported,
            max_language_hints=1,
            language_identification=unsupported,
            speaker_diarization=unsupported,
            timestamps=unsupported,
            endpoint_detection=unsupported,
        )
