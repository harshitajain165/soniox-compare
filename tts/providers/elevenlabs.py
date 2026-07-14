from typing import AsyncIterator

from languages import get_provider_language
from providers.base import ProviderError, _require_env, _stream_post


async def generate(text: str, language: str) -> AsyncIterator[bytes]:
    api_key = _require_env("ELEVENLABS_API_KEY")
    voice_id = "21m00Tcm4TlvDq8ikWAM"  # Rachel

    elevenlabs_language = get_provider_language(language, "elevenlabs")
    if not elevenlabs_language:
        raise ProviderError(f"Language {language} is not supported by ElevenLabs TTS")

    return await _stream_post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream",
        error_prefix="ElevenLabs TTS error",
        headers={"xi-api-key": api_key},
        json={
            "text": text,
            "model_id": "eleven_v3",
            "output_format": "mp3_44100_128",
            "language_code": elevenlabs_language,
        },
    )
