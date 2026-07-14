import asyncio
import base64
import json
import os
from typing import AsyncIterator

from google.auth.transport.requests import Request as GoogleAuthRequest
from google.oauth2 import service_account

from languages import get_provider_language
from providers.base import ProviderError, _client


async def generate(text: str, language: str) -> AsyncIterator[bytes]:
    google_language = get_provider_language(language, "google")
    if not google_language:
        raise ProviderError(f"Language {language} is not supported by Google TTS")

    credentials_base64 = os.getenv("GOOGLE_CREDENTIALS_JSON_BASE64")
    if credentials_base64:
        credentials_info = json.loads(base64.b64decode(credentials_base64))
    elif os.path.exists("credentials-google.json"):
        with open("credentials-google.json") as f:
            credentials_info = json.load(f)
    else:
        raise ProviderError(
            "Google credentials not found: set GOOGLE_CREDENTIALS_JSON_BASE64 or "
            "provide credentials-google.json"
        )

    credentials = service_account.Credentials.from_service_account_info(
        credentials_info, scopes=["https://www.googleapis.com/auth/cloud-platform"]
    )
    # google-auth's token refresh is synchronous; keep it off the event loop.
    await asyncio.to_thread(credentials.refresh, GoogleAuthRequest())

    # Google's REST API returns base64 JSON, not an audio stream, so the full
    # clip is buffered before the first byte reaches the client.
    response = await _client.post(
        "https://texttospeech.googleapis.com/v1/text:synthesize",
        headers={"Authorization": f"Bearer {credentials.token}"},
        json={
            "input": {"text": text},
            "voice": {
                "languageCode": google_language,
                "name": "Kore",
                "modelName": "gemini-2.5-flash-tts",
            },
            "audioConfig": {"audioEncoding": "MP3"},
        },
    )
    if response.status_code != 200:
        raise ProviderError(f"Google TTS error: {response.text}")

    audio_content = response.json().get("audioContent")
    if not audio_content:
        raise ProviderError("Google TTS response missing audio content")
    audio = base64.b64decode(audio_content)

    async def stream() -> AsyncIterator[bytes]:
        yield audio

    return stream()
