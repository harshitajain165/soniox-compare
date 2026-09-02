import { useQueryStates, type inferParserType } from "nuqs";
import {
  createParser,
  parseAsString,
  parseAsStringLiteral,
  parseAsArrayOf,
  parseAsBoolean,
} from "nuqs/server";

import {
  ALL_PROVIDERS_LIST,
  type ProviderName,
} from "@/lib/provider-features";
import { sanitizeLanguageHintsBasic } from "@/lib/language-hints";

export interface UrlSettings {
  languageHints: string[];
  context: string;
  selectedProviders: ProviderName[];
  enableSpeakerDiarization: boolean;
  enableLanguageIdentification: boolean;
  enableEndpointDetection: boolean;
  selectedFileName: string | null;
  rawMode: boolean;
}

const defaultLanguageHints: string[] = ["en"];
const defaultContext: string = "";

const defaultSelectedProviders: ProviderName[] = [
  ...ALL_PROVIDERS_LIST.slice(0, 3),
];
const defaultEnableSpeakerDiarization = true;
const defaultEnableLanguageIdentification = true;
const defaultEnableEndpointDetection = false;

const providerLiterals = ALL_PROVIDERS_LIST as ReadonlyArray<ProviderName>;

const baseProvidersParser = parseAsArrayOf(
  parseAsStringLiteral(providerLiterals)
);

const sanitizeProviders = (providers: ProviderName[]): ProviderName[] => {
  const unique = [...new Set(providers)];
  return unique.length > 0 ? unique : defaultSelectedProviders;
};

const selectedProvidersParser = createParser({
  parse: (query) => sanitizeProviders(baseProvidersParser.parse(query) ?? []),
  serialize: baseProvidersParser.serialize.bind(baseProvidersParser),
  eq: baseProvidersParser.eq?.bind(baseProvidersParser),
}).withDefault(defaultSelectedProviders);

const baseLanguageHintsParser = parseAsArrayOf(parseAsString);
const languageHintsParser = createParser({
  parse: (query) =>
    sanitizeLanguageHintsBasic(baseLanguageHintsParser.parse(query) ?? []),
  serialize: baseLanguageHintsParser.serialize.bind(baseLanguageHintsParser),
  eq: baseLanguageHintsParser.eq?.bind(baseLanguageHintsParser),
}).withDefault(defaultLanguageHints);

const settingParsers = {
  languageHints: languageHintsParser,
  context: parseAsString.withDefault(defaultContext),
  selectedProviders: selectedProvidersParser,
  enableSpeakerDiarization: parseAsBoolean.withDefault(
    defaultEnableSpeakerDiarization
  ),
  enableLanguageIdentification: parseAsBoolean.withDefault(
    defaultEnableLanguageIdentification
  ),
  enableEndpointDetection: parseAsBoolean.withDefault(
    defaultEnableEndpointDetection
  ),
  selectedFileName: parseAsString,
  // View-only: swaps the rendered transcript for the provider's raw messages.
  // Not forwarded to the backend, which always streams them.
  rawMode: parseAsBoolean.withDefault(false),
};

export type ParsedUrlSettings = inferParserType<typeof settingParsers>;

export function activeProviders(settings: ParsedUrlSettings): ProviderName[] {
  return sanitizeProviders(settings.selectedProviders ?? []);
}

export function useUrlSettings() {
  const [settings, setSettings] = useQueryStates(settingParsers, {
    history: "replace",
    shallow: false,
  });

  const getSettingsAsUrlParams = () => {
    const params = new URLSearchParams();
    if (!settings) return params.toString();

    sanitizeLanguageHintsBasic(settings.languageHints || []).forEach((hint) =>
      params.append("language_hints", hint)
    );

    params.set("context", settings.context || "");
    params.set(
      "enable_speaker_diarization",
      String(settings.enableSpeakerDiarization)
    );
    params.set(
      "enable_language_identification",
      String(settings.enableLanguageIdentification)
    );
    params.set(
      "enable_endpoint_detection",
      String(settings.enableEndpointDetection)
    );

    activeProviders(settings).forEach((p) => params.append("providers", p));

    return params.toString();
  };

  return {
    settings,
    setSettings,
    setLanguageHints: (hints: string[]) =>
      setSettings({ languageHints: sanitizeLanguageHintsBasic(hints) }),
    setContext: (text: string) => setSettings({ context: text }),
    setSelectedProviders: (providers: ProviderName[]) =>
      setSettings({ selectedProviders: providers }),
    setEnableSpeakerDiarization: (enabled: boolean) =>
      setSettings({ enableSpeakerDiarization: enabled }),
    setEnableLanguageIdentification: (enabled: boolean) =>
      setSettings({ enableLanguageIdentification: enabled }),
    setEnableEndpointDetection: (enabled: boolean) =>
      setSettings({ enableEndpointDetection: enabled }),
    setSelectedFileName: (fileName: string | null) =>
      setSettings({ selectedFileName: fileName }),
    setRawMode: (enabled: boolean) => setSettings({ rawMode: enabled }),
    getSettingsAsUrlParams,
  };
}
