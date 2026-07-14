"""Wire-event builders shared by all providers.

Every provider normalizes its upstream API onto these shapes and pushes them
onto its `host_queue`; `main.py` forwards them verbatim to the browser.
"""


def make_part(
    text: str,
    speaker: int | None = None,
    language: str | None = None,
    source_language: str | None = None,
    translation_status: str | None = None,
    is_final: bool = True,
    start_ms: int | None = None,
    end_ms: int | None = None,
    confidence: float | None = None,
) -> dict:
    """One token.

    `translation_status` is "original" (the spoken side) or "translation" (the
    target side). For originals, `language` is the spoken language. For
    translations, `language` is the target and `source_language` is the spoken
    side — the frontend groups a block by the spoken language so an utterance
    and its translation stay paired.
    """
    return {
        "text": text,
        "speaker": speaker,
        "language": language,
        "source_language": source_language,
        "translation_status": translation_status,
        "is_final": is_final,
        "start_ms": start_ms,
        "end_ms": end_ms,
        "confidence": confidence,
    }


def data_event(provider: str, parts: list[dict]) -> dict:
    return {"type": "data", "provider": provider, "parts": parts}


def audio_event(provider: str, pcm_b64: str, sample_rate: int) -> dict:
    return {
        "type": "audio",
        "provider": provider,
        "pcm_b64": pcm_b64,
        "sample_rate": sample_rate,
    }


def error_message(
    provider: str, message: str, code: str | None = None
) -> dict:
    return {
        "type": "error",
        "provider": provider,
        "error_code": code,
        "error_message": message,
    }


def info_message(provider: str, message: str, level: str = "info") -> dict:
    return {
        "type": "info",
        "provider": provider,
        "level": level,
        "message": message,
    }


def session_done_event(provider: str) -> dict:
    return {
        "type": "session_done",
        "provider": provider,
    }
