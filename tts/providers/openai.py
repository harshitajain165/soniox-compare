from typing import AsyncIterator

from providers.base import _require_env, _stream_post


async def generate(text: str, language: str) -> AsyncIterator[bytes]:
    api_key = _require_env("OPENAI_API_KEY")

    return await _stream_post(
        "https://api.openai.com/v1/audio/speech",
        error_prefix="OpenAI TTS error",
        headers={"Authorization": f"Bearer {api_key}"},
        json={
            "model": "gpt-4o-mini-tts",
            "voice": "marin",
            "input": text,
            "response_format": "mp3",
        },
    )
