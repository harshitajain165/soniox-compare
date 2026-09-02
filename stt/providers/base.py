import asyncio
from abc import ABC, abstractmethod
from typing import List, Dict, Any, ClassVar
from providers.config import ProviderConfig, SupportedFeatures, FeatureState
from utils import info_message, raw_message

# How long receive() blocks for a first event before returning empty, so the
# per-provider forward loop in main.py stays responsive to cancellation.
RECEIVE_TIMEOUT_SEC = 0.1


class BaseProvider(ABC):
    """
    Abstract base class for all STT providers.
    """

    name: ClassVar[str]  # subclasses override: name = "soniox" etc.

    def __init__(self, config: ProviderConfig):
        self._is_connected = False
        self.error: Exception | None = None
        self.config: ProviderConfig = config
        self.host_queue: asyncio.Queue[Dict[str, Any]] = asyncio.Queue()

    def is_connected(self) -> bool:
        return self._is_connected

    def emit_raw(self, payload: Any, verbatim: bool | None = None) -> None:
        """Queue an upstream provider message alongside the normalized events,
        so the frontend can show what the provider actually sent.

        Non-blocking (`host_queue` is unbounded) so it is safe to call from the
        synchronous SDK callbacks some providers use. Callbacks that run off the
        event loop must still hop back onto it first. See `raw_message` for
        `verbatim`.
        """
        self.host_queue.put_nowait(raw_message(self.name, payload, verbatim))

    def validate_provider_capabilities(self, name: str) -> List[Dict[str, Any]]:
        """
        Validates provider capabilities against the requested configuration.
        Modifies the config to disable unsupported features and returns a list of warnings.
        Raises ProviderError for fatal incompatibilities.
        """
        return validate_capabilities(self.get_available_features(), self.config, name)

    @abstractmethod
    async def connect(self) -> None:
        """
        Establish a connection to the provider.
        """
        pass

    @abstractmethod
    async def disconnect(self) -> None:
        """
        Close connection and clean up resources.
        """
        pass

    @abstractmethod
    async def send(self, data: bytes | str) -> None:
        """
        Send an audio chunk or string to the provider.
        """
        pass

    @abstractmethod
    async def send_end(self) -> None:
        """
        Send an end-of-stream signal to the provider.
        This is optional and may not be implemented by all providers.
        """
        pass

    async def receive(self) -> List[Dict[str, Any]]:
        """Drain everything currently queued, blocking briefly for the first
        item so the caller stays responsive to cancellation. A provider pushes
        normalized events (see utils.py) onto `host_queue`."""
        try:
            first = await asyncio.wait_for(self.host_queue.get(), RECEIVE_TIMEOUT_SEC)
        except asyncio.TimeoutError:
            return []
        items = [first]
        while not self.host_queue.empty():
            items.append(self.host_queue.get_nowait())
        return items

    @staticmethod
    @abstractmethod
    def get_available_features() -> SupportedFeatures:
        """
        Get supported features for each model.
        """
        pass


class ProviderError(Exception):
    """Base error for all provider-related exceptions."""

    def __init__(self, message, code=None, details=None):
        self.message = message
        self.code = code
        self.details = details
        super().__init__(message)


def validate_capabilities(
    features: SupportedFeatures, config: ProviderConfig, provider: str
) -> List[Dict[str, Any]]:
    """
    Validates provider capabilities against the requested configuration.
    Modifies the config to disable unsupported features and returns a list of warnings.
    Raises ProviderError for fatal incompatibilities.
    """
    warnings: List[Dict[str, Any]] = []

    # Cap language hints to what the provider's streaming API accepts. When the
    # request exceeds the max, prefer automatic language detection (if the model
    # supports it) over silently picking a subset; otherwise keep the first N.
    max_hints = features.max_language_hints
    hints = config.params.language_hints
    if max_hints is not None and len(hints) > max_hints:
        supports_auto = (
            features.single_multilingual_model.state == FeatureState.SUPPORTED
        )
        if supports_auto:
            warnings.append(
                info_message(
                    provider,
                    f"This provider accepts at most {max_hints} language hint(s); "
                    "falling back to automatic language detection.",
                    level="warning",
                )
            )
            config.params.language_hints = []
        else:
            warnings.append(
                info_message(
                    provider,
                    f"This provider accepts at most {max_hints} language hint(s); "
                    f"using the first {max_hints} and ignoring the rest.",
                    level="warning",
                )
            )
            config.params.language_hints = hints[:max_hints]

    if config.params.enable_speaker_diarization:
        state = features.speaker_diarization
        if state.state == FeatureState.UNSUPPORTED:
            warnings.append(
                info_message(
                    provider,
                    "Speaker diarization is not supported by this provider and has been disabled.",
                    level="warning",
                )
            )
            config.params.enable_speaker_diarization = False
        elif state.state == FeatureState.PARTIAL:
            warnings.append(
                info_message(
                    provider,
                    state.comment or "Speaker diarization is partially supported.",
                    level="info",
                )
            )

    if config.params.enable_language_identification:
        state = features.language_identification
        if state.state == FeatureState.UNSUPPORTED:
            warnings.append(
                info_message(
                    provider,
                    "Language identification is not supported and has been disabled.",
                    level="warning",
                )
            )
            config.params.enable_language_identification = False
        elif state.state == FeatureState.PARTIAL:
            warnings.append(
                info_message(
                    provider,
                    state.comment or "Language identification is partially supported.",
                    level="info",
                )
            )

    if config.params.enable_endpoint_detection:
        state = features.endpoint_detection
        if state.state == FeatureState.UNSUPPORTED:
            warnings.append(
                info_message(
                    provider,
                    "Endpoint detection is not supported and has been disabled.",
                    level="warning",
                )
            )
            config.params.enable_endpoint_detection = False
        elif state.state == FeatureState.PARTIAL:
            warnings.append(
                info_message(
                    provider,
                    state.comment or "Endpoint detection is partially supported.",
                    level="info",
                )
            )

    return warnings
