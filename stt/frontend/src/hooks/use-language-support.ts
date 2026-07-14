import { useEffect, useMemo, useState } from "react";
import {
  ALL_PROVIDERS_LIST,
  SONIOX_PROVIDER,
  type ProviderName,
} from "@/lib/provider-features";

// Per-provider supported language codes (ISO-639-1), keyed by provider name.
// Soniox is not returned by the API because the language list the UI renders is
// Soniox's own model list, so it supports every entry.
type LanguageSupport = Partial<Record<ProviderName, string[]>>;

interface UseLanguageSupportResult {
  /** Returns the providers that support a given language code, Soniox first. */
  getProvidersForLanguage: (languageCode: string) => ProviderName[];
  isLoading: boolean;
}

export const useLanguageSupport = (): UseLanguageSupportResult => {
  const [support, setSupport] = useState<LanguageSupport>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/compare/api/language-support")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: LanguageSupport) => {
        if (!cancelled) setSupport(data);
      })
      .catch((err) => {
        console.warn("[useLanguageSupport] failed to load support data:", err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Pre-index codes as Sets for O(1) lookups per language row.
  const supportSets = useMemo(() => {
    const sets = {} as Partial<Record<ProviderName, Set<string>>>;
    for (const [provider, codes] of Object.entries(support)) {
      sets[provider as ProviderName] = new Set(codes);
    }
    return sets;
  }, [support]);

  const getProvidersForLanguage = useMemo(
    () => (languageCode: string) =>
      ALL_PROVIDERS_LIST.filter((provider) => {
        // Soniox supports the entire rendered list (it is its own model list).
        if (provider === SONIOX_PROVIDER) return true;
        return supportSets[provider]?.has(languageCode) ?? false;
      }),
    [supportSets]
  );

  return { getProvidersForLanguage, isLoading };
};
