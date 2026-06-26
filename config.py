import os

from dotenv import load_dotenv

from providers.config import ProviderParams, ProviderConfig, ServiceConfig
import json
from copy import deepcopy
from pathlib import Path


load_dotenv()


def get_soniox_service_config():
    return ServiceConfig(
        provider_name="soniox",
        api_key=os.environ["SONIOX_API_KEY"],
        websocket_url="wss://stt-rt.soniox.com/transcribe-websocket",
        model="stt-rt-v5",
    )


def get_speechmatics_service_config():
    return ServiceConfig(
        provider_name="speechmatics",
        api_key=os.environ["SPEECHMATICS_API_KEY"],
        websocket_url="wss://eu2.rt.speechmatics.com/v2",
        model="",
    )


def get_openai_service_config():
    return ServiceConfig(
        provider_name="openai",
        api_key=os.environ["OPENAI_API_KEY"],
        websocket_url="wss://api.openai.com/v1/realtime",
        model="gpt-4o-transcribe",
    )


def get_cartesia_service_config():
    return ServiceConfig(
        provider_name="cartesia",
        api_key=os.environ["CARTESIA_API_KEY"],
        # Auto endpoint with native turn detection (recommended for streaming
        # without external VAD). Emits cumulative per-turn transcripts.
        websocket_url="wss://api.cartesia.ai/stt/turns/websocket",
        model="ink-2",
    )


def get_deepgram_service_config():
    return ServiceConfig(
        provider_name="deepgram",
        api_key=os.environ["DEEPGRAM_API_KEY"],
        # consider turning on smart_format=true
        websocket_url="wss://api.deepgram.com/v1/listen",
        model="nova-3",
    )


def get_assemblyai_service_config():
    return ServiceConfig(
        provider_name="assembly",
        api_key=os.environ["ASSEMBLY_API_KEY"],
        websocket_url="wss://streaming.assemblyai.com/v3/ws",
        model="universal-3-5-pro",
    )


def get_elevenlabs_service_config():
    return ServiceConfig(
        provider_name="elevenlabs",
        api_key=os.environ["ELEVENLABS_API_KEY"],
        websocket_url="wss://api.elevenlabs.io/v1/speech-to-text/realtime",
        model="scribe_v2_realtime",
    )


def get_azure_service_config():
    return ServiceConfig(
        provider_name="azure",
        api_key=os.environ["AZURE_API_KEY"],
        region=os.environ["AZURE_REGION"],
    )


def get_google_service_config():
    # Chirp 3 is the latest Google Speech-to-Text V2 transcription model. It is only
    # available in the `us` and `eu` multi-regions.
    cfg = ServiceConfig(
        provider_name="google",
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
        print(
            "WARN: GoogleConfig.recognizer_id was 'Default', correcting to '_'."
            " Using default ad-hoc recognizer."
        )
        cfg.recognizer_id = "_"
    elif cfg.recognizer_id == "_":
        print(
            "INFO: GoogleConfig.recognizer_id is '_'. Using default ad-hoc recognizer "
            f"in region '{cfg.region}'. Ensure config details (model, language, "
            "audio format) are appropriate."
        )
    else:
        print(
            f"INFO: GoogleConfig.recognizer_id is '{cfg.recognizer_id}'. "
            f"Using specific recognizer in region '{cfg.region}'."
        )
    return cfg


def get_provider_config(name: str, params: ProviderParams) -> ProviderConfig:
    if name == "soniox":
        service_cfg = get_soniox_service_config()

    elif name == "google":
        service_cfg = get_google_service_config()

    elif name == "speechmatics":
        service_cfg = get_speechmatics_service_config()

    elif name == "deepgram":
        service_cfg = get_deepgram_service_config()

    elif name == "cartesia":
        service_cfg = get_cartesia_service_config()

    elif name == "azure":
        service_cfg = get_azure_service_config()

    elif name == "assembly":
        service_cfg = get_assemblyai_service_config()

    elif name == "openai":
        service_cfg = get_openai_service_config()

    elif name == "elevenlabs":
        service_cfg = get_elevenlabs_service_config()
    else:
        raise ValueError(f"Unsupported provider: {name}")

    return ProviderConfig(params=deepcopy(params), service=service_cfg)


def _load_language_mapping(mapping_file: str):
    with open(mapping_file, "r") as file:
        return json.load(file)


file_dir = str(Path(__file__).resolve().parent)

__GOOGLE_LANG_MAPPING = _load_language_mapping(
    f"{file_dir}/transcription_languages/google.json"
)
__AZURE_LANG_MAPPING = _load_language_mapping(
    f"{file_dir}/transcription_languages/azure.json"
)
__SPEECHMATICS_LANG_MAPPING = _load_language_mapping(
    f"{file_dir}/transcription_languages/speechmatics.json"
)
__DEEPGRAM_LANG_MAPPING = _load_language_mapping(
    f"{file_dir}/transcription_languages/deepgram.json"
)
__ASSEMBLY_LANG_MAPPING = _load_language_mapping(
    f"{file_dir}/transcription_languages/assemblyai.json"
)
__OPENAI_LANG_MAPPING = _load_language_mapping(
    f"{file_dir}/transcription_languages/openai.json"
)
__ELEVENLABS_LANG_MAPPING = _load_language_mapping(
    f"{file_dir}/transcription_languages/elevenlabs.json"
)
__CARTESIA_LANG_MAPPING = _load_language_mapping(
    f"{file_dir}/transcription_languages/cartesia.json"
)

# Per-provider sets of supported input-language codes (ISO-639-1), keyed by the
# canonical Soniox language code. Soniox is intentionally omitted: the language
# list the UI renders is Soniox's own model list, so it supports every entry.
__PROVIDER_LANGUAGE_MAPPINGS: dict[str, dict[str, str]] = {
    "google": __GOOGLE_LANG_MAPPING,
    "azure": __AZURE_LANG_MAPPING,
    "speechmatics": __SPEECHMATICS_LANG_MAPPING,
    "deepgram": __DEEPGRAM_LANG_MAPPING,
    "assembly": __ASSEMBLY_LANG_MAPPING,
    "openai": __OPENAI_LANG_MAPPING,
    "elevenlabs": __ELEVENLABS_LANG_MAPPING,
    "cartesia": __CARTESIA_LANG_MAPPING,
}


def get_language_support() -> dict[str, list[str]]:
    """Supported input-language codes per provider, for the comparison UI.

    Soniox is omitted on purpose (it supports the entire rendered list).
    """
    return {
        provider: sorted(mapping.keys())
        for provider, mapping in __PROVIDER_LANGUAGE_MAPPINGS.items()
    }


def get_language_mapping(provider_name: str) -> dict[str, str]:
    if provider_name == "google":
        return __GOOGLE_LANG_MAPPING

    elif provider_name == "azure":
        return __AZURE_LANG_MAPPING

    elif provider_name == "speechmatics":
        return __SPEECHMATICS_LANG_MAPPING

    elif provider_name == "deepgram":
        return __DEEPGRAM_LANG_MAPPING

    elif provider_name == "assembly":
        return __ASSEMBLY_LANG_MAPPING

    else:
        raise ValueError(f"There is no language mapping for provider: {provider_name}")
