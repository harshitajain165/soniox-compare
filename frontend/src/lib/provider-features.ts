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

// Prefix with Vite's base URL (the app is served under /compare/ui/), so the
// path resolves to the public assets rather than the server root.
export const getProviderIcon = (provider: ProviderName): string =>
  `${import.meta.env.BASE_URL}provider-icons/${PROVIDER_ICON_FILES[provider]}`;
