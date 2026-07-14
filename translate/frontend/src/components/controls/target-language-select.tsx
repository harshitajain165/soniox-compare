import React from "react";
import { ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CommandGroup, CommandSeparator } from "@/components/ui/command";
import { useComparison } from "@/contexts/comparison-context";
import { useFeatures } from "@/contexts/feature-context";
import { activeProviders, useUrlSettings } from "@/hooks/use-url-settings";
import { useTargetLanguageSupport } from "@/hooks/use-target-language-support";
import type { ProviderName } from "@/lib/provider-features";
import { cn } from "@/lib/utils";
import { CodeBadge } from "./code-badge";
import { LanguageDialog, LanguageRow } from "./language-dialog";

export const TargetLanguageSelect = ({ className }: { className?: string }) => {
  const { settings, setTargetLanguage } = useUrlSettings();
  const { recordingState } = useComparison();
  const { providerFeatures } = useFeatures();
  const { languages, getProvidersForLanguage, isLoading } =
    useTargetLanguageSupport();

  const [open, setOpen] = React.useState(false);

  const selected = activeProviders(settings);

  const universal = languages.filter((lang) => {
    const supporting = getProvidersForLanguage(lang.code);
    return selected.every((p) => supporting.includes(p));
  });
  const universalSet = new Set(universal.map((lang) => lang.code));
  const others = languages.filter((lang) => !universalSet.has(lang.code));

  React.useEffect(() => {
    if (isLoading || languages.length === 0) return;
    const known = languages.some((l) => l.code === settings.targetLanguage);
    if (!known) setTargetLanguage(universal[0]?.code ?? languages[0].code);
  }, [isLoading, languages, settings.targetLanguage]);

  const selectedLanguage = languages.find(
    (lang) => lang.code === settings.targetLanguage,
  );
  const displayLabel =
    selectedLanguage?.name ??
    (isLoading ? "Loading languages..." : "Translate into...");

  const handleSelect = (code: string) => {
    if (code) setTargetLanguage(code);
    setOpen(false);
  };

  const providerName = (provider: ProviderName) =>
    providerFeatures?.[provider]?.name ?? provider;

  const renderRow = (lang: { code: string; name: string }) => (
    <LanguageRow
      key={lang.code}
      code={lang.code}
      name={lang.name}
      keywords={[lang.name, lang.code]}
      selected={lang.code === settings.targetLanguage}
      providers={getProvidersForLanguage(lang.code)}
      getProviderName={providerName}
      onSelect={handleSelect}
    />
  );

  const triggerButton = (
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      disabled={recordingState !== "idle" || isLoading}
      className={cn(
        "justify-between gap-2 bg-white dark:bg-zinc-800 sm:min-w-[180px]",
        className,
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        {selectedLanguage && <CodeBadge code={selectedLanguage.code} />}
        <span className="hidden truncate text-left sm:inline">
          {displayLabel}
        </span>
      </span>
      <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
    </Button>
  );

  return (
    <LanguageDialog
      open={open}
      onOpenChange={setOpen}
      trigger={triggerButton}
      title="Target language"
    >
      {universal.length > 0 && others.length > 0 ? (
        <>
          <CommandGroup
            heading="Supported by all compared providers"
            className="[&_[cmdk-group-items]]:flex [&_[cmdk-group-items]]:flex-col [&_[cmdk-group-items]]:gap-1"
          >
            {universal.map(renderRow)}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup
            heading="Others"
            className="[&_[cmdk-group-items]]:flex [&_[cmdk-group-items]]:flex-col [&_[cmdk-group-items]]:gap-1"
          >
            {others.map(renderRow)}
          </CommandGroup>
        </>
      ) : (
        <CommandGroup className="[&_[cmdk-group-items]]:flex [&_[cmdk-group-items]]:flex-col [&_[cmdk-group-items]]:gap-1">
          {languages.map(renderRow)}
        </CommandGroup>
      )}
    </LanguageDialog>
  );
};
