"""Per-provider TARGET-language support for translation.

Keyed by canonical Soniox code (ISO-639-1) — the comparison is scoped to Soniox.
Each provider entry maps that code to the target code the provider's translation
API expects (identity for most; e.g. Speechmatics Mandarin = "cmn", Azure
Norwegian = "nb"). A missing entry means the provider cannot translate into that
language. Soniox and OpenAI are omitted: they take their target list live from
the Soniox API.
"""

LANGUAGE_MAP: dict[str, dict[str, str]] = {
    "af": {},
    "ar": {"azure": "ar", "gemini": "ar"},
    "az": {},
    "be": {},
    "bg": {"azure": "bg", "speechmatics": "bg"},
    "bn": {"gemini": "bn"},
    "bs": {},
    "ca": {"azure": "ca", "speechmatics": "ca"},
    "cs": {"azure": "cs", "speechmatics": "cs"},
    "cy": {},
    "da": {"azure": "da", "speechmatics": "da"},
    "de": {"azure": "de", "gemini": "de", "speechmatics": "de"},
    "el": {"azure": "el", "speechmatics": "el"},
    "en": {"azure": "en", "gemini": "en", "speechmatics": "en"},
    "es": {"azure": "es", "gemini": "es", "speechmatics": "es"},
    "et": {"speechmatics": "et"},
    "eu": {},
    "fa": {},
    "fi": {"azure": "fi", "speechmatics": "fi"},
    "fr": {"azure": "fr", "gemini": "fr", "speechmatics": "fr"},
    "gl": {"speechmatics": "gl"},
    "gu": {},
    "he": {"azure": "he"},
    "hi": {"azure": "hi", "gemini": "hi", "speechmatics": "hi"},
    "hr": {"speechmatics": "hr"},
    "hu": {"azure": "hu", "speechmatics": "hu"},
    "id": {"azure": "id", "gemini": "id", "speechmatics": "id"},
    "it": {"azure": "it", "gemini": "it", "speechmatics": "it"},
    "ja": {"azure": "ja", "gemini": "ja", "speechmatics": "ja"},
    "kk": {},
    "kn": {},
    "ko": {"azure": "ko", "gemini": "ko", "speechmatics": "ko"},
    "lt": {"speechmatics": "lt"},
    "lv": {"speechmatics": "lv"},
    "mk": {},
    "ml": {},
    "mr": {},
    "ms": {"speechmatics": "ms"},
    "nl": {"azure": "nl", "gemini": "nl", "speechmatics": "nl"},
    "no": {"azure": "nb", "speechmatics": "no"},
    "pa": {},
    "pl": {"azure": "pl", "gemini": "pl", "speechmatics": "pl"},
    "pt": {"azure": "pt", "gemini": "pt", "speechmatics": "pt"},
    "ro": {"azure": "ro", "speechmatics": "ro"},
    "ru": {"azure": "ru", "gemini": "ru", "speechmatics": "ru"},
    "sk": {"azure": "sk", "speechmatics": "sk"},
    "sl": {"speechmatics": "sl"},
    "sq": {},
    "sr": {},
    "sv": {"azure": "sv", "speechmatics": "sv"},
    "sw": {},
    "ta": {},
    "te": {},
    "th": {"azure": "th", "gemini": "th"},
    "tl": {},
    "tr": {"azure": "tr", "gemini": "tr", "speechmatics": "tr"},
    "uk": {"azure": "uk", "gemini": "uk", "speechmatics": "uk"},
    "ur": {},
    "vi": {"azure": "vi", "gemini": "vi", "speechmatics": "vi"},
    "zh": {"azure": "zh-Hans", "gemini": "zh", "speechmatics": "cmn"},
}

SUPPORTED_LANGUAGES = list(LANGUAGE_MAP.keys())


def get_provider_language(language: str, provider: str) -> str | None:
    """The target code `provider` wants for `language`, or None if unsupported."""
    return LANGUAGE_MAP.get(language, {}).get(provider)


def is_language_supported(language: str, provider: str) -> bool:
    return provider in LANGUAGE_MAP.get(language, {})
