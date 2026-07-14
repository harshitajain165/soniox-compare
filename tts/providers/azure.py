import os
from typing import AsyncIterator

from languages import get_provider_language
from providers.base import ProviderError, _require_env, _stream_post


async def generate(text: str, language: str) -> AsyncIterator[bytes]:
    api_key = _require_env("AZURE_API_KEY")
    region = os.getenv("AZURE_REGION", "eastus")

    azure_language = get_provider_language(language, "azure")
    if not azure_language:
        raise ProviderError(f"Language {language} is not supported by Azure TTS")

    voice = "en-US-Ava:DragonHDOmniLatestNeural"
    ssml = (
        "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'>"
        f"<voice name='{voice}'><lang xml:lang='{azure_language}'>{text}</lang></voice>"
        "</speak>"
    )

    return await _stream_post(
        f"https://{region}.tts.speech.microsoft.com/cognitiveservices/v1",
        error_prefix="Azure TTS error",
        headers={
            "Ocp-Apim-Subscription-Key": api_key,
            "Content-Type": "application/ssml+xml",
            "X-Microsoft-OutputFormat": "audio-24khz-160kbitrate-mono-mp3",
            "User-Agent": "SonioxCompareTTS",
        },
        content=ssml.encode("utf-8"),
    )
