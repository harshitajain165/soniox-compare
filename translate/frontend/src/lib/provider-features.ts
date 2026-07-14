// Soniox is pinned first everywhere; the rest are ordered by how well they
// support translation, with the ones that can't translate here trailing. Those
// are still rendered in the picker, greyed out — the backend reports
// `text_translation: UNSUPPORTED` for them, with the reason on hover.
//
// Every name here must exist in the backend's /providers-features response,
// otherwise it becomes a phantom provider: filtered out of the picker but still
// advertised on the language rows.
export const ALL_PROVIDERS_LIST = [
  "soniox",
  "openai",
  "gemini",
  "speechmatics",
  "azure",
  "deepgram",
  "assembly",
  "cartesia",
  "elevenlabs",
] as const;
export type ProviderName = (typeof ALL_PROVIDERS_LIST)[number];

export const SONIOX_PROVIDER = ALL_PROVIDERS_LIST[0];

// Square PNG logos live in /public/provider-icons. Most follow the
// `${provider}-icon.png` convention; `assembly` is the lone exception.
// Gemini is Google's model, so it wears the Google mark.
export const PROVIDER_ICON_FILES: Record<ProviderName, string> = {
  soniox: "soniox-icon.png",
  openai: "openai-icon.png",
  gemini: "google-icon.png",
  speechmatics: "speechmatics-icon.png",
  azure: "azure-icon.png",
  deepgram: "deepgram-icon.png",
  assembly: "assemblyai-icon.png",
  cartesia: "cartesia-icon.png",
  elevenlabs: "elevenlabs-icon.png",
};

export const getProviderIcon = (provider: ProviderName): string =>
  `/provider-icons/${PROVIDER_ICON_FILES[provider]}`;
