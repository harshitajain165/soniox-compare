from typing import Any, Optional

from pydantic import BaseModel, Field
from enum import Enum


class FeatureState(Enum):
    SUPPORTED = "SUPPORTED"
    UNSUPPORTED = "UNSUPPORTED"
    PARTIAL = "PARTIAL"


class FeatureStatus(BaseModel):
    state: FeatureState
    comment: str = ""

    @staticmethod
    def supported(comment=""):
        return FeatureStatus(state=FeatureState.SUPPORTED, comment=comment)

    @staticmethod
    def unsupported(comment=""):
        return FeatureStatus(state=FeatureState.UNSUPPORTED, comment=comment)

    @staticmethod
    def partial(comment=""):
        return FeatureStatus(state=FeatureState.PARTIAL, comment=comment)


class SupportedFeatures(BaseModel):
    name: str
    model: str
    single_multilingual_model: FeatureStatus
    language_hints: FeatureStatus
    # Max number of explicit language hints the provider's streaming API accepts.
    # None = unlimited. When the request exceeds this, validate_capabilities falls
    # back to auto-detection (if single_multilingual_model is supported) or keeps
    # the first N hints otherwise.
    max_language_hints: int | None = 1
    language_identification: FeatureStatus
    speaker_diarization: FeatureStatus
    customization: FeatureStatus
    timestamps: FeatureStatus
    confidence_scores: FeatureStatus
    real_time_latency_config: FeatureStatus
    endpoint_detection: FeatureStatus
    manual_finalization: FeatureStatus


class ProviderData(BaseModel):
    name: str
    supported_features: SupportedFeatures


class CommonConfig(BaseModel):
    audio_format: str = "pcm_s16le"
    sample_rate: int = 16000
    num_channels: int = 1


COMMON_CFG = CommonConfig()


class ServiceConfig(BaseModel):
    # Not all parameters are used by all services. This can be specialized later.
    api_key: str = ""
    websocket_url: str = ""
    model: str = ""
    credentials_fn: str = ""
    region: str = ""
    project_id: str = ""
    prompt: str = ""
    recognizer_id: str = ""
    # Parsed service-account key (Google). Passed directly to the SDK so no
    # credentials file needs to exist on disk in deployment.
    credentials_info: Optional[dict[str, Any]] = None


class ProviderParams(BaseModel):
    language_hints: list[str] = []
    context: str = ""
    enable_speaker_diarization: bool = True
    enable_language_identification: bool = True
    enable_endpoint_detection: bool = True


class ProviderConfig(BaseModel):
    params: ProviderParams
    service: ServiceConfig
    common: CommonConfig = Field(default=COMMON_CFG, init=False)
