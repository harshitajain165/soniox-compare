"""Per-provider language support, shared across all STT providers.

Keyed by canonical Soniox code (ISO-639-1) — the languages the comparison covers.
Each provider entry maps that code to the value the provider's streaming API
expects for it; a missing entry means the provider does not accept that language.
Soniox is omitted: the rendered list IS its own live model list, so it supports
every entry.
"""

LANGUAGE_MAP: dict[str, dict[str, str]] = {
    "af": {"azure": "af-ZA", "elevenlabs": "af", "openai": "af"},
    "ar": {"assembly": "ar", "azure": "ar-AE", "deepgram": "ar", "elevenlabs": "ar", "openai": "ar", "speechmatics": "ar"},
    "az": {"azure": "az-AZ", "elevenlabs": "az", "openai": "az"},
    "be": {"deepgram": "be", "elevenlabs": "be", "openai": "be", "speechmatics": "be"},
    "bg": {"azure": "bg-BG", "deepgram": "bg", "elevenlabs": "bg", "openai": "bg", "speechmatics": "bg"},
    "bn": {"azure": "bn-IN", "deepgram": "bn", "elevenlabs": "bn", "speechmatics": "bn"},
    "bs": {"azure": "bs-BA", "deepgram": "bs", "elevenlabs": "bs", "openai": "bs"},
    "ca": {"azure": "ca-ES", "deepgram": "ca", "elevenlabs": "ca", "openai": "ca", "speechmatics": "ca"},
    "cs": {"azure": "cs-CZ", "deepgram": "cs", "elevenlabs": "cs", "openai": "cs", "speechmatics": "cs"},
    "cy": {"azure": "cy-GB", "elevenlabs": "cy", "openai": "cy", "speechmatics": "cy"},
    "da": {"assembly": "da", "azure": "da-DK", "deepgram": "da", "elevenlabs": "da", "openai": "da", "speechmatics": "da"},
    "de": {"assembly": "de", "azure": "de-DE", "deepgram": "de", "elevenlabs": "de", "google": "de-DE", "openai": "de", "speechmatics": "de"},
    "el": {"azure": "el-GR", "deepgram": "el", "elevenlabs": "el", "openai": "el", "speechmatics": "el"},
    "en": {"assembly": "en", "azure": "en-US", "cartesia": "en", "deepgram": "en", "elevenlabs": "en", "google": "en-US", "openai": "en", "speechmatics": "en"},
    "es": {"assembly": "es", "azure": "es-ES", "deepgram": "es", "elevenlabs": "es", "google": "es-ES", "openai": "es", "speechmatics": "es"},
    "et": {"azure": "et-EE", "deepgram": "et", "elevenlabs": "et", "openai": "et", "speechmatics": "et"},
    "eu": {"azure": "eu-ES", "speechmatics": "eu"},
    "fa": {"azure": "fa-IR", "deepgram": "fa", "elevenlabs": "fa", "openai": "fa", "speechmatics": "fa"},
    "fi": {"assembly": "fi", "azure": "fi-FI", "deepgram": "fi", "elevenlabs": "fi", "openai": "fi", "speechmatics": "fi"},
    "fr": {"assembly": "fr", "azure": "fr-FR", "deepgram": "fr", "elevenlabs": "fr", "google": "fr-FR", "openai": "fr", "speechmatics": "fr"},
    "gl": {"azure": "gl-ES", "elevenlabs": "gl", "openai": "gl", "speechmatics": "gl"},
    "gu": {"azure": "gu-IN", "deepgram": "gu", "elevenlabs": "gu"},
    "he": {"assembly": "he", "azure": "he-IL", "deepgram": "he", "elevenlabs": "he", "openai": "he", "speechmatics": "he"},
    "hi": {"assembly": "hi", "azure": "hi-IN", "deepgram": "hi", "elevenlabs": "hi", "openai": "hi", "speechmatics": "hi"},
    "hr": {"azure": "hr-HR", "deepgram": "hr", "elevenlabs": "hr", "openai": "hr", "speechmatics": "hr"},
    "hu": {"azure": "hu-HU", "deepgram": "hu", "elevenlabs": "hu", "openai": "hu", "speechmatics": "hu"},
    "id": {"azure": "id-ID", "deepgram": "id", "elevenlabs": "id", "openai": "id", "speechmatics": "id"},
    "it": {"assembly": "it", "azure": "it-IT", "deepgram": "it", "elevenlabs": "it", "google": "it-IT", "openai": "it", "speechmatics": "it"},
    "ja": {"assembly": "ja", "azure": "ja-JP", "deepgram": "ja", "elevenlabs": "ja", "google": "ja-JP", "openai": "ja", "speechmatics": "ja"},
    "kk": {"azure": "kk-KZ", "elevenlabs": "kk", "openai": "kk"},
    "kn": {"azure": "kn-IN", "deepgram": "kn", "elevenlabs": "kn", "openai": "kn"},
    "ko": {"azure": "ko-KR", "deepgram": "ko", "elevenlabs": "ko", "google": "ko-KR", "openai": "ko", "speechmatics": "ko"},
    "lt": {"azure": "lt-LT", "deepgram": "lt", "elevenlabs": "lt", "openai": "lt", "speechmatics": "lt"},
    "lv": {"azure": "lv-LV", "deepgram": "lv", "elevenlabs": "lv", "openai": "lv", "speechmatics": "lv"},
    "mk": {"azure": "mk-MK", "deepgram": "mk", "elevenlabs": "mk", "openai": "mk"},
    "ml": {"azure": "ml-IN", "elevenlabs": "ml"},
    "mr": {"azure": "mr-IN", "deepgram": "mr", "elevenlabs": "mr", "openai": "mr", "speechmatics": "mr"},
    "ms": {"azure": "ms-MY", "deepgram": "ms", "elevenlabs": "ms", "openai": "ms", "speechmatics": "ms"},
    "nl": {"assembly": "nl", "azure": "nl-NL", "deepgram": "nl", "elevenlabs": "nl", "openai": "nl", "speechmatics": "nl"},
    "no": {"assembly": "no", "azure": "nb-NO", "deepgram": "no", "elevenlabs": "no", "openai": "no", "speechmatics": "no"},
    "pa": {"azure": "pa-IN", "elevenlabs": "pa"},
    "pl": {"azure": "pl-PL", "deepgram": "pl", "elevenlabs": "pl", "openai": "pl", "speechmatics": "pl"},
    "pt": {"assembly": "pt", "azure": "pt-PT", "deepgram": "pt", "elevenlabs": "pt", "google": "pt-BR", "openai": "pt", "speechmatics": "pt"},
    "ro": {"azure": "ro-RO", "deepgram": "ro", "elevenlabs": "ro", "openai": "ro", "speechmatics": "ro"},
    "ru": {"azure": "ru-RU", "deepgram": "ru", "elevenlabs": "ru", "openai": "ru", "speechmatics": "ru"},
    "sk": {"azure": "sk-SK", "deepgram": "sk", "elevenlabs": "sk", "openai": "sk", "speechmatics": "sk"},
    "sl": {"azure": "sl-SI", "deepgram": "sl", "elevenlabs": "sl", "openai": "sl", "speechmatics": "sl"},
    "sq": {"azure": "sq-AL"},
    "sr": {"azure": "sr-RS", "deepgram": "sr", "elevenlabs": "sr", "openai": "sr"},
    "sv": {"assembly": "sv", "azure": "sv-SE", "deepgram": "sv", "elevenlabs": "sv", "openai": "sv", "speechmatics": "sv"},
    "sw": {"azure": "sw-KE", "elevenlabs": "sw", "openai": "sw", "speechmatics": "sw"},
    "ta": {"azure": "ta-IN", "deepgram": "ta", "elevenlabs": "ta", "openai": "ta", "speechmatics": "ta"},
    "te": {"azure": "te-IN", "deepgram": "te", "elevenlabs": "te"},
    "th": {"azure": "th-TH", "deepgram": "th", "elevenlabs": "th", "openai": "th", "speechmatics": "th"},
    "tl": {"azure": "fil-PH", "deepgram": "tl", "elevenlabs": "tl", "openai": "tl"},
    "tr": {"assembly": "tr", "azure": "tr-TR", "deepgram": "tr", "elevenlabs": "tr", "openai": "tr", "speechmatics": "tr"},
    "uk": {"azure": "uk-UA", "deepgram": "uk", "elevenlabs": "uk", "openai": "uk", "speechmatics": "uk"},
    "ur": {"assembly": "ur", "azure": "ur-IN", "deepgram": "ur", "elevenlabs": "ur", "openai": "ur", "speechmatics": "ur"},
    "vi": {"assembly": "vi", "azure": "vi-VN", "deepgram": "vi", "elevenlabs": "vi", "openai": "vi", "speechmatics": "vi"},
    "zh": {"assembly": "zh", "azure": "zh-CN", "deepgram": "zh", "elevenlabs": "zh", "google": "cmn-Hans-CN", "openai": "zh", "speechmatics": "cmn"},
}

SUPPORTED_LANGUAGES = list(LANGUAGE_MAP.keys())


def get_provider_language(language: str, provider: str) -> str | None:
    """The code `provider` wants for `language`, or None if unsupported."""
    return LANGUAGE_MAP.get(language, {}).get(provider)


def is_language_supported(language: str, provider: str) -> bool:
    return provider in LANGUAGE_MAP.get(language, {})
