import { useEffect, useMemo, useState } from "react";
import { ALL_PROVIDERS_LIST, type ProviderName } from "@/lib/provider-features";

// Per-provider supported *source*-language codes (ISO-639-1), keyed by provider.
// A provider with no entry places no restriction on the source language — it
// either auto-detects or treats the hint as best-effort. Today that's every
// provider, so the endpoint returns `{}`.
type LanguageSupport = Partial<Record<ProviderName, string[]>>;

interface UseLanguageSupportResult {
  /** Returns the providers that support a given source-language code. */
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
        const codes = supportSets[provider];
        // No entry means the provider doesn't constrain the source language.
        if (codes === undefined) return true;
        return codes.has(languageCode);
      }),
    [supportSets]
  );

  return { getProvidersForLanguage, isLoading };
};
