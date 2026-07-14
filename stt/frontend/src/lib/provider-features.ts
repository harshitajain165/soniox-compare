export const ALL_PROVIDERS_LIST = [
  "soniox",
  "openai",
  "google",
  "azure",
  "speechmatics",
  "deepgram",
  "assembly",
  "cartesia",
  "elevenlabs",
] as const;
export type ProviderName = (typeof ALL_PROVIDERS_LIST)[number];

export const SONIOX_PROVIDER = ALL_PROVIDERS_LIST[0];

// Square PNG logos live in /public/provider-icons. Most follow the
// `${provider}-icon.png` convention; `assembly` is the lone exception.
export const PROVIDER_ICON_FILES: Record<ProviderName, string> = {
  soniox: "soniox-icon.png",
  openai: "openai-icon.png",
  google: "google-icon.png",
  azure: "azure-icon.png",
  speechmatics: "speechmatics-icon.png",
  deepgram: "deepgram-icon.png",
  assembly: "assemblyai-icon.png",
  cartesia: "cartesia-icon.png",
  elevenlabs: "elevenlabs-icon.png",
};

export const getProviderIcon = (provider: ProviderName): string =>
  `/provider-icons/${PROVIDER_ICON_FILES[provider]}`;
