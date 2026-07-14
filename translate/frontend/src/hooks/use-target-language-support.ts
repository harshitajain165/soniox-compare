import { useEffect, useMemo, useState } from "react";
import { ALL_PROVIDERS_LIST, type ProviderName } from "@/lib/provider-features";

/** Per-provider supported *target*-language codes, keyed by provider name. */
type TargetLanguageSupport = Partial<Record<ProviderName, string[]>>;

export interface Language {
  code: string;
  name: string;
}

interface UseTargetLanguageSupportResult {
  /** Every target language any provider can translate into, name-sorted. */
  languages: Language[];
  /** Providers that can translate into a given target language. */
  getProvidersForLanguage: (languageCode: string) => ProviderName[];
  isLoading: boolean;
}

const languageName = (code: string): string => {
  try {
    return new Intl.DisplayNames(["en"], { type: "language" }).of(code) || code;
  } catch {
    return code;
  }
};

export const useTargetLanguageSupport = (): UseTargetLanguageSupportResult => {
  const [support, setSupport] = useState<TargetLanguageSupport>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/compare/api/target-language-support")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: TargetLanguageSupport) => {
        if (!cancelled) setSupport(data);
      })
      .catch((err) => {
        console.warn(
          "[useTargetLanguageSupport] failed to load support data:",
          err
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const supportSets = useMemo(() => {
    const sets = {} as Partial<Record<ProviderName, Set<string>>>;
    for (const [provider, codes] of Object.entries(support)) {
      sets[provider as ProviderName] = new Set(codes);
    }
    return sets;
  }, [support]);

  // The rendered list is the union across providers; per-provider gaps show up
  // as a shorter "supported by" logo row on the language row itself.
  const languages = useMemo(() => {
    const codes = new Set<string>();
    for (const list of Object.values(support)) {
      list?.forEach((code) => codes.add(code));
    }
    return [...codes]
      .map((code) => ({ code, name: languageName(code) }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [support]);

  const getProvidersForLanguage = useMemo(
    () => (languageCode: string) =>
      ALL_PROVIDERS_LIST.filter(
        (provider) => supportSets[provider]?.has(languageCode) ?? false
      ),
    [supportSets]
  );

  return { languages, getProvidersForLanguage, isLoading };
};
