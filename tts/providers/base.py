"""Shared TTS provider helpers.

Each provider module exposes `async def generate(text, language) -> AsyncIterator[bytes]`
yielding mp3 bytes. Upstream errors are detected before any audio is yielded and
raised as ProviderError with the upstream message.
"""

import os
from typing import AsyncIterator

import httpx

_client = httpx.AsyncClient(timeout=httpx.Timeout(60.0))


class ProviderError(Exception):
    def __init__(self, message, code=None, details=None):
        self.message = message
        self.code = code
        self.details = details
        super().__init__(message)


def _require_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise ProviderError(f"Missing {name}")
    return value


async def _stream_post(
    url: str,
    *,
    error_prefix: str,
    headers: dict | None = None,
    json: dict | None = None,
    content: bytes | None = None,
) -> AsyncIterator[bytes]:
    """POST and stream the response body, failing before the first yielded
    chunk if the upstream returns a non-200."""
    request = _client.build_request(
        "POST", url, headers=headers, json=json, content=content
    )
    response = await _client.send(request, stream=True)
    if response.status_code != 200:
        message = (await response.aread()).decode("utf-8", errors="replace")
        await response.aclose()
        raise ProviderError(f"{error_prefix}: {message or response.reason_phrase}")

    async def stream() -> AsyncIterator[bytes]:
        try:
            async for chunk in response.aiter_bytes():
                yield chunk
        finally:
            await response.aclose()

    return stream()
