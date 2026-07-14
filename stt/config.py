import logging
import os

from dotenv import load_dotenv

from providers.config import ProviderParams, ProviderConfig, ServiceConfig
from languages import LANGUAGE_MAP
import json
from copy import deepcopy


load_dotenv()

log = logging.getLogger("stt.config")


def get_soniox_service_config():
    return ServiceConfig(
        api_key=os.environ["SONIOX_API_KEY"],
        websocket_url="wss://stt-rt.soniox.com/transcribe-websocket",
        model="stt-rt-v5",
    )


def get_speechmatics_service_config():
    return ServiceConfig(
        api_key=os.environ["SPEECHMATICS_API_KEY"],
        websocket_url="wss://eu2.rt.speechmatics.com/v2",
        model="",
    )


def get_openai_service_config():
    return ServiceConfig(
        api_key=os.environ["OPENAI_API_KEY"],
        websocket_url="wss://api.openai.com/v1/realtime",
        model="gpt-4o-transcribe",
    )


def get_cartesia_service_config():
    return ServiceConfig(
        api_key=os.environ["CARTESIA_API_KEY"],
        # Auto endpoint with native turn detection (recommended for streaming
        # without external VAD). Emits cumulative per-turn transcripts.
        websocket_url="wss://api.cartesia.ai/stt/turns/websocket",
        model="ink-2",
    )


def get_deepgram_service_config():
    return ServiceConfig(
        api_key=os.environ["DEEPGRAM_API_KEY"],
        # consider turning on smart_format=true
        websocket_url="wss://api.deepgram.com/v1/listen",
        model="nova-3",
    )


def get_assembly_service_config():
    return ServiceConfig(
        api_key=os.environ["ASSEMBLY_API_KEY"],
        websocket_url="wss://streaming.assemblyai.com/v3/ws",
        model="universal-3-5-pro",
    )


def get_elevenlabs_service_config():
    return ServiceConfig(
        api_key=os.environ["ELEVENLABS_API_KEY"],
        websocket_url="wss://api.elevenlabs.io/v1/speech-to-text/realtime",
        model="scribe_v2_realtime",
    )


def get_azure_service_config():
    return ServiceConfig(
        api_key=os.environ["AZURE_API_KEY"],
        region=os.environ["AZURE_REGION"],
    )


def get_google_service_config():
    # Chirp 3 is the latest Google Speech-to-Text V2 transcription model. It is only
    # available in the `us` and `eu` multi-regions.
    cfg = ServiceConfig(
        model="chirp_3",
        region="us",
        recognizer_id="_",
    )

    # Credentials are passed directly to the SDK (see GoogleProvider), so no
    # file needs to exist on disk in deployment. Prefer the GOOGLE_CREDENTIALS_JSON
    # env var (paste the whole service-account JSON as the value)
    # and fall back to the local ./credentials-google.json file for development.
    credentials_json = os.getenv("GOOGLE_CREDENTIALS_JSON")
    if credentials_json:
        credentials_data = json.loads(credentials_json)
    else:
        credentials_fn = "./credentials-google.json"
        if not os.path.exists(credentials_fn):
            raise ValueError(
                "Google credentials not found: set GOOGLE_CREDENTIALS_JSON or "
                f"provide {credentials_fn}."
            )
        with open(credentials_fn, "r") as f:
            credentials_data = json.load(f)

    cfg.credentials_info = credentials_data
    cfg.project_id = credentials_data.get("project_id", cfg.project_id)
    if not cfg.project_id:
        raise ValueError(
            "project_id not found in credentials and not set in GoogleConfig."
        )

    if cfg.recognizer_id == "_Default":
        log.warning(
            "GoogleConfig.recognizer_id was 'Default', correcting to '_'. "
            "Using default ad-hoc recognizer."
        )
        cfg.recognizer_id = "_"
    elif cfg.recognizer_id == "_":
        log.info(
            "GoogleConfig.recognizer_id is '_'. Using default ad-hoc recognizer "
            "in region '%s'.",
            cfg.region,
        )
    else:
        log.info(
            "GoogleConfig.recognizer_id is '%s'. Using specific recognizer in "
            "region '%s'.",
            cfg.recognizer_id,
            cfg.region,
        )
    return cfg


_SERVICE_CONFIG_FACTORIES = {
    "soniox": get_soniox_service_config,
    "google": get_google_service_config,
    "speechmatics": get_speechmatics_service_config,
    "deepgram": get_deepgram_service_config,
    "cartesia": get_cartesia_service_config,
    "azure": get_azure_service_config,
    "assembly": get_assembly_service_config,
    "openai": get_openai_service_config,
    "elevenlabs": get_elevenlabs_service_config,
}


def get_provider_config(name: str, params: ProviderParams) -> ProviderConfig:
    factory = _SERVICE_CONFIG_FACTORIES.get(name)
    if factory is None:
        raise ValueError(f"Unsupported provider: {name}")
    return ProviderConfig(params=deepcopy(params), service=factory())


# Which providers appear in LANGUAGE_MAP (Soniox is omitted there — its language
# list is its own live model list, so it supports every entry).
_PROVIDERS_WITH_LANGUAGE_MAP = sorted(
    {provider for codes in LANGUAGE_MAP.values() for provider in codes}
)


def get_language_support() -> dict[str, list[str]]:
    """Supported input-language codes per provider, for the comparison UI.

    Soniox is omitted on purpose (it supports the entire rendered list).
    """
    return {
        provider: sorted(
            canon for canon, codes in LANGUAGE_MAP.items() if provider in codes
        )
        for provider in _PROVIDERS_WITH_LANGUAGE_MAP
    }


def get_language_mapping(provider_name: str) -> dict[str, str]:
    """{canonical code -> the code `provider_name` expects}, from LANGUAGE_MAP."""
    mapping = {
        canon: codes[provider_name]
        for canon, codes in LANGUAGE_MAP.items()
        if provider_name in codes
    }
    if not mapping:
        raise ValueError(f"There is no language mapping for provider: {provider_name}")
    return mapping
