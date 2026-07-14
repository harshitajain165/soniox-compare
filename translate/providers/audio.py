"""Shared audio helpers for providers.

The browser captures a single PCM stream and the backend fans it out to every
selected provider, so the capture rate can't be tailored per provider. Most
providers let us declare the input sample rate and take the 16 kHz stream as-is.
A few (e.g. OpenAI's realtime "audio/pcm" format, pinned to 24 kHz) require a
fixed rate instead, so they opt into this streaming resampler.
"""

import numpy as np
import soxr


class StreamResampler:
    """Streaming, high-quality resampler for mono 16-bit PCM.

    Backed by `soxr.ResampleStream`, which keeps filter state between chunks, so
    arbitrary/variable chunk sizes produce the same continuous output as a
    one-shot resample (no per-chunk boundary artifacts or drift). Create one
    instance per stream and call `reset()` when starting a new stream. Not safe
    for concurrent use.
    """

    def __init__(self, in_rate: int, out_rate: int, quality: str = "HQ") -> None:
        self.in_rate = in_rate
        self.out_rate = out_rate
        self._quality = quality
        self._stream: soxr.ResampleStream | None = None
        self.reset()

    def reset(self) -> None:
        if self.in_rate == self.out_rate:
            self._stream = None
            return
        self._stream = soxr.ResampleStream(
            self.in_rate,
            self.out_rate,
            num_channels=1,
            dtype="int16",
            quality=self._quality,
        )

    def process(self, pcm_bytes: bytes) -> bytes:
        if self._stream is None or not pcm_bytes:
            return pcm_bytes

        samples = np.frombuffer(pcm_bytes, dtype=np.int16)
        if samples.size == 0:
            return pcm_bytes

        out = self._stream.resample_chunk(samples)
        return out.tobytes()
