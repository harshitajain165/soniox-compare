import { useMemo } from "react";

import { useFeatures } from "@/contexts/feature-context";
import { useUrlSettings } from "@/hooks/use-url-settings";
import { ALL_PROVIDERS_LIST, type ProviderName } from "@/lib/provider-features";

const DEFAULT_REASON: Record<string, string> = {
  text: "This provider does not support speech translation.",
  s2s: "This provider does not support speech-to-speech translation.",
};

interface UseModeSupportResult {
  /** Providers that can run in the current mode. */
  supportedProviders: ProviderName[];
  /** Why each unsupported provider is greyed out, keyed by provider. */
  disabledReasons: Partial<Record<ProviderName, string>>;
  isSupported: (provider: ProviderName) => boolean;
}

/**
 * Which providers the current mode allows. Text mode excludes the providers
 * whose upstream API has no translation at all; speech-to-speech additionally
 * excludes those that can translate but not speak.
 */
export const useModeSupport = (): UseModeSupportResult => {
  const { settings } = useUrlSettings();
  const { getModeSupport, providerFeatures } = useFeatures();
  const mode = settings.mode;

  return useMemo(() => {
    const supportedProviders: ProviderName[] = [];
    const disabledReasons: Partial<Record<ProviderName, string>> = {};

    for (const provider of ALL_PROVIDERS_LIST) {
      if (!providerFeatures?.[provider]) continue;
      const { supported, reason } = getModeSupport(provider, mode);
      if (supported) supportedProviders.push(provider);
      else disabledReasons[provider] = reason ?? DEFAULT_REASON[mode];
    }

    return {
      supportedProviders,
      disabledReasons,
      isSupported: (provider: ProviderName) => !(provider in disabledReasons),
    };
  }, [getModeSupport, providerFeatures, mode]);
};
