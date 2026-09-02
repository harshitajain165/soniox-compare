import asyncio
import json
from typing import Any


async def await_callback(api_func, timeout=5):
    loop = asyncio.get_running_loop()
    fut = loop.create_future()

    def cb(evt):
        if not fut.done():
            fut.set_result(evt)

    api_func(cb)
    return await asyncio.wait_for(fut, timeout)


def error_message(provider: str, message: str, code: str | None = None) -> dict:
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
        "message": message,
        "level": level,
    }


def raw_message(provider: str, payload: Any, verbatim: bool | None = None) -> dict:
    """Wrap an upstream provider message for the frontend's raw view.

    A text or bytes payload is the frame exactly as it came off the wire. An SDK
    event object was already parsed by the SDK, so the best available rendering
    is to serialize it back, and the message is flagged so the UI can say so.
    Pass `verbatim=False` for a payload that arrives as text but was still
    reconstructed rather than received.
    """
    text, passthrough = _as_text(payload)
    message = {
        "type": "raw",
        "provider": provider,
        "raw": text,
    }
    # Sent only when it is not, since it rides along with every upstream event
    # and the frontend treats a missing flag as verbatim.
    if verbatim is False or not passthrough:
        message["verbatim"] = False
    return message


def _as_text(payload: Any) -> tuple[str, bool]:
    """The payload as text, plus whether that text is the untouched original."""
    if isinstance(payload, str):
        return payload, True
    if isinstance(payload, (bytes, bytearray)):
        return payload.decode("utf-8", "replace"), True
    # SDK event objects. Most SDKs here hand back pydantic models, which can be
    # dumped straight back to JSON. Field aliases and unset fields are the
    # model's own doing rather than the provider's, so they are dropped to stay
    # as close to the message that came off the wire as possible.
    dump = getattr(payload, "model_dump_json", None)
    if callable(dump):
        try:
            return dump(by_alias=True, exclude_none=True), False
        except Exception:
            try:
                return dump(), False
            except Exception:
                pass
    if isinstance(payload, BaseException):
        return str(payload), False
    try:
        return json.dumps(payload, default=repr), False
    except Exception:
        return repr(payload), False


def make_part(
    text: str,
    is_final: bool = True,
    speaker: int | None = None,
    language: str | None = None,
    start_ms: int | None = None,
    end_ms: int | None = None,
    confidence: float = 1.0,
) -> dict:
    return {
        "text": text,
        "is_final": is_final,
        "speaker": speaker,
        "language": language,
        "confidence": confidence,
        "start_ms": start_ms,
        "end_ms": end_ms,
    }
