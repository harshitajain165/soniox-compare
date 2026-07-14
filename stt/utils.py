import asyncio


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
