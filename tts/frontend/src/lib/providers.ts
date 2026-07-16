export const PROVIDERS = [
  "soniox",
  "openai",
  "elevenlabs",
  "google",
  "cartesia",
  "azure",
] as const;

export type ProviderName = (typeof PROVIDERS)[number];

export const PROVIDER_DISPLAY_NAMES: Record<ProviderName, string> = {
  soniox: "Soniox",
  openai: "OpenAI",
  elevenlabs: "ElevenLabs",
  google: "Google",
  cartesia: "Cartesia",
  azure: "Azure",
};

export const PROVIDER_MODELS: Record<ProviderName, string> = {
  soniox: "tts-rt-v1",
  openai: "gpt-4o-mini-tts",
  elevenlabs: "eleven_v3",
  google: "gemini-2.5-flash-tts",
  cartesia: "sonic-3.5",
  azure: "dragon-hd-omni",
};

const PROVIDER_ICON_FILES: Record<ProviderName, string> = {
  soniox: "soniox-icon.svg",
  openai: "openai-icon.svg",
  elevenlabs: "elevenlabs-icon.svg",
  google: "google-icon.svg",
  cartesia: "cartesia-icon.svg",
  azure: "azure-icon.svg",
};

export const getProviderIcon = (provider: ProviderName): string =>
  `/provider-icons/${PROVIDER_ICON_FILES[provider]}`;
