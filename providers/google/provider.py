import asyncio
from typing import Any, AsyncGenerator, Dict, List, Optional, Union, MutableSequence

from google.api_core.client_options import ClientOptions
from google.oauth2 import service_account
from google.cloud.speech_v2.services.speech import SpeechAsyncClient
from google.cloud.speech_v2.types import (
    cloud_speech,
    StreamingRecognizeRequest,
    StreamingRecognitionConfig,
    RecognitionConfig,
    SpeechRecognitionAlternative,
    WordInfo,
    ExplicitDecodingConfig,
    StreamingRecognitionResult,
)

from config import get_language_mapping
from providers.base_provider import (
    ProviderError,
    BaseProvider,
)
from providers.config import ProviderConfig, SupportedFeatures, FeatureStatus
from utils import error_message, make_part

AudioEncoding = ExplicitDecodingConfig.AudioEncoding


class GoogleProvider(BaseProvider):
    """
    Integrates with Google Cloud Speech-to-Text V2 using the SpeechAsyncClient for
    streaming transcription. It bridges Google's async gRPC client with the
    application's asyncio event loop via internal queues:
    `_audio_chunk_queue` for outgoing audio and `_results_queue` for incoming
    transcriptions.
    See Google SpeechAsyncClient:
    https://cloud.google.com/python/docs/reference/speech/2.16.1/google.cloud.speech_v2.services.speech.SpeechAsyncClient
    """

    def __init__(self, config: ProviderConfig):
        super().__init__(config)
        self.speech_client: Optional[SpeechAsyncClient] = None

        self._audio_chunk_queue: Optional[asyncio.Queue[Optional[bytes]]] = None
        self._stop_sending_audio_event: Optional[asyncio.Event] = None
        self._recognizer_path: Optional[str] = None
        self._streaming_config: Optional[StreamingRecognitionConfig] = None
        self._manage_stream_task: Optional[asyncio.Task] = None

        self._results_queue: asyncio.Queue[Optional[Dict[str, Any]]] = asyncio.Queue()
        self.log_connected()

    def _update_transcription_languages(self) -> None:
        lang_mapping = get_language_mapping("google")

        # Chirp 3 StreamingRecognize accepts a single language code (or "auto");
        # multiple explicit locales trigger a 400 "invalid argument". The hint
        # list is already capped to one entry by validate_provider_capabilities,
        # which falls back to auto-detection when more languages are requested.
        hints = self.config.params.language_hints
        if len(hints) == 0:
            # Chirp 3 supports language-agnostic transcription: it detects and
            # transcribes the dominant spoken language when language_codes=["auto"].
            self.config.params.language_hints = ["auto"]
            return

        lang_hint = hints[0]
        if lang_hint not in lang_mapping:
            raise ProviderError(f"Google does not support language {lang_hint}.")

        self.config.params.language_hints = [lang_mapping[lang_hint]]

    def get_effective_region(self):
        configured_region = self.config.service.region
        if configured_region and configured_region.lower() != "global":
            return configured_region
        # Chirp 3 is only served from the `us`/`eu` multi-regions.
        return "us"

    def _get_audio_encoding(self) -> AudioEncoding:
        # Validates and sets up explicit audio decoding configuration.

        audio_encoding_str = "LINEAR16"

        if audio_encoding_str == "LINEAR16":
            encoding_enum = AudioEncoding.LINEAR16
        elif audio_encoding_str == "MULAW":
            encoding_enum = AudioEncoding.MULAW
        elif audio_encoding_str == "ALAW":
            encoding_enum = AudioEncoding.ALAW
        else:
            raise ValueError(f"Unsupported audio_encoding {audio_encoding_str}")
        return encoding_enum

    def _create_recognition_config_kwargs(self):
        # Prepare a mutable dict for recognition config details.
        sample_rate = self.config.common.sample_rate
        channels = self.config.common.num_channels

        encoding_enum = self._get_audio_encoding()

        # Chirp 3 streaming only emits utterance-level timestamps; word-level
        # timestamps and word confidence are not supported in StreamingRecognize.
        # Punctuation and capitalization are produced by the model automatically.
        features = cloud_speech.RecognitionFeatures(
            enable_automatic_punctuation=True,
        )

        recognition_config_kwargs = {
            "explicit_decoding_config": cloud_speech.ExplicitDecodingConfig(
                encoding=encoding_enum,
                sample_rate_hertz=sample_rate,
                audio_channel_count=channels,
            ),
            "features": features,
            "model": self.config.service.model,
        }

        recognition_config_kwargs["language_codes"] = self.config.params.language_hints

        return recognition_config_kwargs

    async def _initialize_client_and_configs(self):
        """
        Initializes the SpeechAsyncClient and prepares recognition/streaming
        configurations.
        """
        warnings = self.validate_provider_capabilities("Google")
        for warning in warnings:
            await self._results_queue.put(warning)

        self._update_transcription_languages()

        # Chirp 3 (STT) uses the `us` multi-region endpoint, which requires an
        # explicit, location-matched endpoint.
        effective_region = self.get_effective_region()

        api_endpoint = f"{effective_region}-speech.googleapis.com"
        client_options = ClientOptions(api_endpoint=api_endpoint)

        # Credentials are provided in-process (from env var or local file) rather
        # than via a GOOGLE_APPLICATION_CREDENTIALS file path. The GAPIC transport
        # applies the default cloud-platform scope when credentials lack one.
        if not self.config.service.credentials_info:
            raise ValueError("Google credentials_info is not set.")
        credentials = service_account.Credentials.from_service_account_info(
            self.config.service.credentials_info
        )
        self.speech_client = SpeechAsyncClient(
            credentials=credentials, client_options=client_options
        )
        print(
            f"GoogleProvider: Client initialized for REGIONAL endpoint: {api_endpoint}"
        )

        if not self.config.service.project_id:
            raise ValueError("GoogleConfig.project_id is not set.")

        # The location in the recognizer path MUST match the endpoint's location.
        # Uses `_` for ad-hoc recognizer by default, as per Google V2 docs.
        # See: https://cloud.google.com/speech-to-text/v2/docs/recognizers#send_requests_without_recognizers # noqa
        recognizer_id_to_use = getattr(self.config.service, "recognizer_id", "_")
        self._recognizer_path = self.speech_client.recognizer_path(
            self.config.service.project_id, effective_region, recognizer_id_to_use
        )

        if not self._streaming_config:
            recognition_config_kwargs = self._create_recognition_config_kwargs()
            recognition_config_details = RecognitionConfig(**recognition_config_kwargs)

            # StreamingRecognitionConfig wraps the main RecognitionConfig for
            # streaming requests.
            streaming_features_kwargs: Dict[str, Any] = {"interim_results": True}

            # Chirp 3 exposes transcript-tied endpointing: it finalizes results
            # promptly after end of speech, and that finalization drives our
            # `<end>` marker. SHORT lowers finalization latency (default is
            # ~2.4s). Only available on Chirp 3.
            if self.config.params.enable_endpoint_detection:
                EndpointingSensitivity = (
                    cloud_speech.StreamingRecognitionFeatures.EndpointingSensitivity
                )
                streaming_features_kwargs["endpointing_sensitivity"] = (
                    EndpointingSensitivity.ENDPOINTING_SENSITIVITY_SHORT
                )

            self._streaming_config = StreamingRecognitionConfig(
                config=recognition_config_details,
                streaming_features=cloud_speech.StreamingRecognitionFeatures(
                    **streaming_features_kwargs
                ),
            )

    async def connect(self) -> None:
        """
        Establishes connection by initializing configs and starting the
        stream management task.
        """
        if self._is_connected:
            return
        try:
            self.error = None
            # Clear any stale results before connecting.
            while not self._results_queue.empty():
                self._results_queue.get_nowait()
                self._results_queue.task_done()

            await self._initialize_client_and_configs()

            self._audio_chunk_queue = asyncio.Queue()
            self._stop_sending_audio_event = asyncio.Event()

            # _manage_stream_task is the core asyncio task handling the Google
            # bidirectional stream.
            self._manage_stream_task = asyncio.create_task(self._manage_stream())

            self._is_connected = True

        except Exception as e:
            self._is_connected = False
            self.error = ProviderError(f"Google connection error: {e}")
            raise e

    async def _audio_request_generator(
        self,
    ) -> AsyncGenerator[StreamingRecognizeRequest, None]:
        """
        Async generator yielding audio chunks to Google's streaming_recognize method.
        """
        if not self._streaming_config or not self._recognizer_path:
            raise RuntimeError(
                "GoogleProvider internal error: Streaming config or recognizer "
                "path not initialized."
            )

        # First request must contain the streaming configuration.
        yield StreamingRecognizeRequest(
            recognizer=self._recognizer_path, streaming_config=self._streaming_config
        )

        # Subsequent requests contain audio data from _audio_chunk_queue.
        # On a graceful end (send_end) we drain whatever is still queued and stop
        # only when we hit the `None` sentinel, so trailing audio is flushed to
        # Google before the stream is half-closed. The stop event is reserved for
        # error/forced stops, which are handled in the timeout branch below.
        assert self._stop_sending_audio_event is not None
        while True:
            try:
                assert self._audio_chunk_queue is not None, (
                    "self._audio_chunk_queue is None."
                )
                chunk = await asyncio.wait_for(
                    self._audio_chunk_queue.get(), timeout=0.1
                )
                if chunk is None:
                    # None signals end of audio stream from send_end().
                    self._stop_sending_audio_event.set()
                    break
                if isinstance(chunk, bytes) and len(chunk) > 0:
                    yield StreamingRecognizeRequest(audio=chunk)
                elif isinstance(chunk, bytes) and len(chunk) == 0:
                    pass  # Ignore empty audio byte strings.

                # Note: do not throttle here. The client already paces audio in
                # real time (mic capture / file playback); an extra sleep makes
                # the sender fall behind real time and build an ever-growing
                # backlog that gets dropped at end-of-stream.
            except asyncio.TimeoutError:
                # Queue is momentarily empty; only stop if a forced/error stop was
                # requested. A graceful end is handled via the `None` sentinel.
                if self._stop_sending_audio_event.is_set():
                    break
                continue
            except Exception as e:
                # Catch any other exception to ensure the generator stops gracefully.
                self._stop_sending_audio_event.set()
                err_msg = (
                    f"Internal error: _audio_request_generator failed with {str(e)}"
                )
                self.error = ProviderError(err_msg)
                await self._results_queue.put(error_message("google", err_msg))
                break

    async def _handle_error(self, response_error: Any):
        err_msg = (
            "Google API Error in response message: "
            f"{response_error.message} (code: {response_error.code})"
        )
        self.error = ProviderError(err_msg)
        await self._results_queue.put(error_message("google", err_msg))

    def _process_words(
        self,
        all_parts_for_message: list[dict],
        words: MutableSequence[WordInfo],
        is_utterance_start: bool,
        is_final_segment: bool,
        language_code: str,
    ) -> tuple[list[dict], bool]:
        for word_info in words:
            # Ensure no leading space from Google
            current_text_segment = word_info.word.lstrip(" ")
            text_to_emit = current_text_segment

            if not all_parts_for_message:
                # First word in this particular response batch.
                if not is_utterance_start:
                    # Not the first word of the entire utterance.
                    text_to_emit = " " + current_text_segment
            else:
                # Subsequent words in this batch always get a
                # leading space.
                text_to_emit = " " + current_text_segment

            if word_info.start_offset:
                start_ms = word_info.start_offset.total_seconds() * 1000
            else:
                start_ms = None

            if word_info.end_offset:
                end_ms = word_info.end_offset.total_seconds() * 1000
            else:
                end_ms = None

            if self.config.params.enable_language_identification:
                language = language_code
            else:
                language = None

            part = make_part(
                text=text_to_emit,
                start_ms=start_ms,
                end_ms=end_ms,
                language=language,
                confidence=word_info.confidence,
                is_final=is_final_segment,
            )
            all_parts_for_message.append(part)

            if current_text_segment.strip():
                # If actual text content, next part is not
                # utterance start.
                is_utterance_start = False

        return all_parts_for_message, is_utterance_start

    def _process_transcript(
        self,
        all_parts_for_message: list[dict],
        transcript: str,
        is_utterance_start: bool,
        is_final_segment: bool,
        language_code: str,
        confidence: float,
        result_end_offset,
    ) -> tuple[list[dict], bool]:
        # Fallback if no word-level detail, use full transcript.
        # Ensure no leading space from Google
        current_text_segment = transcript.lstrip(" ")
        text_to_emit = current_text_segment

        if not all_parts_for_message:
            if not is_utterance_start:
                text_to_emit = " " + current_text_segment
        else:
            text_to_emit = " " + current_text_segment

        # Calculate end_ms for transcript-level part
        if result_end_offset:
            end_ms_val = result_end_offset.total_seconds() * 1000
        else:
            end_ms_val = None

        if self.config.params.enable_language_identification:
            language = language_code
        else:
            language = None

        part = make_part(
            text=text_to_emit,
            confidence=confidence,
            is_final=is_final_segment,
            language=language,
            end_ms=end_ms_val,
        )
        all_parts_for_message.append(part)
        if current_text_segment.strip():
            is_utterance_start = False

        return all_parts_for_message, is_utterance_start

    def _make_endpoint_part(self, result_end_offset) -> dict:
        # Marker for a finalized segment boundary. Final (matching every other
        # provider): a non-final marker would land in the frontend's
        # `nonFinalParts`, which is only replaced by the next data message, so if
        # it were the last message before the stream closed it would stay
        # rendered as "temporary" forever.
        end_ms = result_end_offset.total_seconds() * 1000 if result_end_offset else None
        return make_part(
            text=" <end>",
            is_final=True,
            speaker=None,
            language=None,
            start_ms=end_ms,
            end_ms=end_ms,
        )

    async def _manage_stream(self):
        """
        Manages the bidirectional gRPC stream with Google Speech API for transcription.
        """
        if not self.speech_client:
            err_msg = "Google client not initialized"
            self.error = ProviderError(err_msg)
            await self._results_queue.put(error_message("google", err_msg))
            return

        # Used for prepending spaces correctly between transcript parts.
        is_utterance_start = True
        responses_iterator = None
        try:
            # speech_client.streaming_recognize establishes the bidi stream.
            # It takes an async iterable for requests and returns an async iterable for
            # responses.
            responses_iterator = await self.speech_client.streaming_recognize(
                requests=self._audio_request_generator()
            )

            # Each `response` is a `StreamingRecognizeResponse` object.
            # See: https://cloud.google.com/python/docs/reference/speech/2.16.1/google.cloud.speech_v2.types.StreamingRecognizeResponse # noqa
            async for response in responses_iterator:
                response_error = getattr(response, "error", None)
                if response_error:
                    await self._handle_error(response_error)
                    break

                # Process transcript results and manage spacing.
                all_parts_for_message = []

                results: MutableSequence[StreamingRecognitionResult] = response.results

                for result in results:
                    if not result.alternatives:
                        continue

                    alternative: SpeechRecognitionAlternative = result.alternatives[0]
                    is_final_segment = result.is_final
                    language_code = result.language_code

                    if alternative.words:
                        all_parts_for_message, is_utterance_start = self._process_words(
                            all_parts_for_message=all_parts_for_message,
                            words=alternative.words,
                            is_utterance_start=is_utterance_start,
                            is_final_segment=is_final_segment,
                            language_code=language_code,
                        )

                    elif alternative.transcript:
                        all_parts_for_message, is_utterance_start = (
                            self._process_transcript(
                                all_parts_for_message=all_parts_for_message,
                                transcript=alternative.transcript,
                                is_utterance_start=is_utterance_start,
                                is_final_segment=is_final_segment,
                                language_code=language_code,
                                confidence=alternative.confidence,
                                result_end_offset=result.result_end_offset,
                            )
                        )

                    # Transcript-tied endpoint: append the `<end>` marker right
                    # after a finalized segment. With Chirp 3's endpointing this
                    # finalization happens promptly at end of speech, so the
                    # marker is aligned with the transcript (unlike the acoustic
                    # SPEECH_ACTIVITY_END VAD event we previously relied on).
                    if (
                        is_final_segment
                        and self.config.params.enable_endpoint_detection
                    ):
                        all_parts_for_message.append(
                            self._make_endpoint_part(result.result_end_offset)
                        )

                if all_parts_for_message:
                    formatted_output = self.format_output(all_parts_for_message)
                    await self._results_queue.put(formatted_output)

        except asyncio.CancelledError as e:
            # Expected on disconnect.
            self.error = e
            pass
        except Exception as e:
            if "400 StreamingRecognize" in str(e):
                docs_url = (
                    "https://cloud.google.com/speech-to-text/docs/chirp_3"
                    "#language_availability_for_transcription"
                )
                err_msg = (
                    "This language is not supported by Google."
                    "[Click here to see Googles official supported languages]"
                    f"({docs_url})"
                )
            else:
                err_msg = f"Google streaming error: {str(e)}"
            self.error = ProviderError(err_msg)
            await self._results_queue.put(error_message("google", err_msg))
        finally:
            # Critical cleanup: ensure connection status is updated and queues
            # are handled.
            self._is_connected = False
            if self._stop_sending_audio_event:
                # Ensure audio generator stops.
                self._stop_sending_audio_event.set()
            # Unblock audio generator if it's waiting on an empty queue after
            # stop_event is set.
            if self._audio_chunk_queue and self._audio_chunk_queue.empty():
                await self._audio_chunk_queue.put(None)
            # Signal end of results to any consumer of receive().
            await self._results_queue.put(None)

    async def send(self, data: Union[bytes, str]) -> None:
        """
        Sends audio data (bytes) or an END signal (str) to the Google stream via
        an internal queue.
        """

        if (
            not self._is_connected
            or not self._audio_chunk_queue
            or (
                self._stop_sending_audio_event
                and self._stop_sending_audio_event.is_set()
            )
        ):
            reason = "unknown"
            if self.error is not None:
                reason = str(self.error)
            elif not self._is_connected:
                reason = "not connected"
            elif not self._audio_chunk_queue:
                # Should not happen if connected.
                reason = "audio queue not ready"
            elif (
                self._stop_sending_audio_event
                and self._stop_sending_audio_event.is_set()
            ):
                reason = "stopping/stopped"
            raise ProviderError(f"GoogleProvider send failed: provider is {reason}")

        if isinstance(data, bytes):
            await self._audio_chunk_queue.put(data)
        elif isinstance(data, str):
            if data == "END":  # Handle application-level END signal.
                await self.send_end()
            else:
                raise ValueError(
                    f"GoogleProvider received unexpected string data: '{data}'. "
                    "Expected bytes or 'END'."
                )
        else:
            raise TypeError(
                f"GoogleProvider received unexpected data type: {type(data)}. "
                "Expected bytes or str."
            )

    async def send_end(self) -> None:
        """
        Signals the end of audio transmission and waits for the stream manager to
        process remaining data.
        """
        # Enqueue the end-of-audio sentinel WITHOUT setting the stop event first,
        # so the request generator flushes every buffered audio chunk before it
        # half-closes the stream. Setting the stop event here would make the
        # generator exit immediately and drop any audio still in the queue,
        # truncating the tail of the transcription.
        if self._audio_chunk_queue:
            await self._audio_chunk_queue.put(None)

        # Wait for the _manage_stream_task to finish processing responses from Google.
        if self._manage_stream_task and not self._manage_stream_task.done():
            try:
                await asyncio.wait_for(self._manage_stream_task, timeout=10.0)
            except asyncio.TimeoutError:
                # If timeout, attempt to cancel the task.
                self._manage_stream_task.cancel()
                try:
                    await self._manage_stream_task  # Allow cancellation to propagate.
                except asyncio.CancelledError:
                    pass  # Expected if cancellation was successful.
                except (
                    Exception
                ):  # Catch any error during the task awaiting after cancellation.
                    pass
            except Exception:  # Catch any other error during initial await_for.
                pass

    async def disconnect(self) -> None:
        """
        Orchestrates a graceful shutdown of the provider, including ending the
        stream and cleaning resources.
        """
        await self.send_end()  # Ensure audio stream is properly ended first.

        if self._manage_stream_task and not self._manage_stream_task.done():
            self._manage_stream_task.cancel()
            try:
                # Wait for the task to acknowledge cancellation.
                await self._manage_stream_task
            except asyncio.CancelledError:
                pass  # Expected.
            except Exception:  # Catch any error during task cleanup.
                pass

        if (
            self.speech_client
        ):  # SpeechAsyncClient doesn't have an explicit close method in docs.
            self.speech_client = None  # Allow garbage collection.

        self._is_connected = False
        # Clear and signal end on results queue.
        if self._results_queue:
            while not self._results_queue.empty():
                try:
                    self._results_queue.get_nowait()
                    self._results_queue.task_done()
                except asyncio.QueueEmpty:
                    break
            await self._results_queue.put(None)

    async def receive(self) -> List[Dict[str, Any]]:
        """Retrieves processed transcription results from an internal queue."""
        if not self._results_queue:
            # This should ideally not happen if provider is used correctly
            # (after connect()).
            err_msg = (
                "Google provider results queue not available "
                "(provider not initialized properly)."
            )
            self.error = ProviderError(err_msg)
            return [error_message("google", err_msg)]

        try:
            first = await asyncio.wait_for(self._results_queue.get(), timeout=0.1)
        except asyncio.TimeoutError:
            return []
        if not first:
            return []
        items = [first]
        while not self._results_queue.empty():
            item = self._results_queue.get_nowait()
            if item:
                items.append(item)
        return items

    def format_output(self, parts_list):
        return {
            "type": "data",
            "provider": self.config.service.provider_name,
            "parts": parts_list,
        }

    @staticmethod
    def get_available_features():
        supported = FeatureStatus.supported()
        unsupported = FeatureStatus.unsupported()
        return SupportedFeatures(
            # https://cloud.google.com/speech-to-text/docs/chirp_3
            name="Google",
            model="chirp_3",
            speaker_diarization=FeatureStatus.unsupported(
                comment="Chirp 3 diarization is only available in batch/synchronous "
                "recognition, not in streaming."
            ),
            endpoint_detection=FeatureStatus.partial(
                comment="Uses Chirp 3's endpointing_sensitivity (SHORT) for "
                "transcript-tied endpointing: the model finalizes promptly at end "
                "of speech and that finalization drives the `<end>` marker. It is "
                "silence/VAD-based rather than a semantic turn decision."
            ),
            timestamps=FeatureStatus.partial(
                comment="Chirp 3 streaming provides utterance-level timestamps only; "
                "word-level timestamps require batch/synchronous recognition."
            ),
            confidence_scores=FeatureStatus.partial(
                comment="Chirp 3 returns a value, but it isn't a true word-level "
                "confidence score."
            ),
            real_time_latency_config=unsupported,
            manual_finalization=unsupported,
            customization=unsupported,
            language_identification=supported,
            language_hints=supported,
            single_multilingual_model=supported,
        )
