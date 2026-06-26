import React from "react";
import { Check, ChevronsUpDown, Languages } from "lucide-react";
import { useUrlSettings } from "@/hooks/use-url-settings";
import { useComparison } from "@/contexts/comparison-context";
import { useModelData } from "@/contexts/model-data-context";
import { useFeatures } from "@/contexts/feature-context";
import { useLanguageSupport } from "@/hooks/use-language-support";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ALL_PROVIDERS_LIST,
  getProviderIcon,
  type ProviderName,
} from "@/lib/provider-features";
import { cn } from "@/lib/utils";

const AUTO_VALUE = "AUTO";

interface LanguageSelectProps {
  className?: string;
}

export const LanguageSelect: React.FC<LanguageSelectProps> = ({ className }) => {
  const { recordingState } = useComparison();
  const { modelInfo } = useModelData();
  const { providerFeatures } = useFeatures();
  const { settings, setLanguageHints } = useUrlSettings();
  const { getProvidersForLanguage } = useLanguageSupport();

  const [open, setOpen] = React.useState(false);
  // Snapshot of the selected codes captured when the dialog opens. Used only to
  // order the list (selected on top) and kept stable while the dialog is open so
  // toggling a language doesn't make rows jump around mid-interaction.
  const [pinnedOrder, setPinnedOrder] = React.useState<string[]>([]);

  const languageHints = settings.languageHints ?? [];
  const isAutoDetect = languageHints.length === 0;
  const isRecording = recordingState === "recording";

  const languages = React.useMemo(() => {
    const sorted = [...(modelInfo?.languages ?? [])].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    if (pinnedOrder.length === 0) return sorted;
    // Pin the selected languages to the top of the list (in selection order) so
    // they are always visible instead of buried in their alphabetical positions.
    const pinnedSet = new Set(pinnedOrder);
    const pinned = pinnedOrder
      .map((code) => sorted.find((lang) => lang.code === code))
      .filter((lang): lang is (typeof sorted)[number] => Boolean(lang));
    const rest = sorted.filter((lang) => !pinnedSet.has(lang.code));
    return [...pinned, ...rest];
  }, [modelInfo?.languages, pinnedOrder]);

  const firstSelectedLanguage = languages.find(
    (lang) => lang.code === languageHints[0]
  );
  const extraSelectedCount = Math.max(languageHints.length - 1, 0);

  // Providers whose `language_identification` feature is available, so the
  // Auto-detect row can show who actually supports it (not all providers do).
  const autoDetectProviders = React.useMemo(() => {
    if (!providerFeatures) return [];
    return ALL_PROVIDERS_LIST.filter((provider) => {
      const feature = providerFeatures[provider]?.language_identification;
      if (feature === undefined) return false;
      const state =
        typeof feature === "object"
          ? feature.state
          : feature
            ? "SUPPORTED"
            : "UNSUPPORTED";
      return state === "SUPPORTED" || state === "PARTIAL";
    });
  }, [providerFeatures]);

  const handleSelect = (code: string) => {
    if (code === AUTO_VALUE || code === "") {
      setLanguageHints([]);
      setOpen(false);
      return;
    }
    // Toggle the language in/out of the selected set, preserving selection order.
    // The dialog stays open so multiple languages can be picked in one session.
    if (languageHints.includes(code)) {
      setLanguageHints(languageHints.filter((c) => c !== code));
    } else {
      setLanguageHints([...languageHints, code]);
    }
  };

  const providerName = (provider: ProviderName) =>
    providerFeatures?.[provider]?.name ?? provider;

  const triggerButton = (
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      disabled={isRecording}
      className={cn(
        "justify-between gap-2 bg-white dark:bg-zinc-800 sm:min-w-[180px]",
        className
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        {isAutoDetect || !firstSelectedLanguage ? (
          <>
            <Languages className="hidden h-4 w-4 shrink-0 text-zinc-500 sm:block" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-300 sm:hidden">
              {AUTO_VALUE}
            </span>
          </>
        ) : (
          <CodeBadge code={firstSelectedLanguage.code} />
        )}
        <span className="hidden truncate text-left sm:inline">
          {isAutoDetect || !firstSelectedLanguage
            ? "Auto-detect"
            : firstSelectedLanguage.name}
        </span>
        {!isAutoDetect && extraSelectedCount > 0 && (
          <span className="shrink-0 rounded-full bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold leading-none text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
            +{extraSelectedCount}
          </span>
        )}
      </span>
      <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
    </Button>
  );

  const renderRow = (code: string, name: string, keywords: string[]) => {
    const isAuto = code === AUTO_VALUE;
    const isSelected = isAuto ? isAutoDetect : languageHints.includes(code);
    const providers = isAuto ? autoDetectProviders : getProvidersForLanguage(code);

    return (
      <CommandItem
        key={code}
        value={code}
        keywords={keywords}
        onSelect={() => handleSelect(code)}
        className={cn(
          "group flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2",
          isSelected &&
            "bg-soniox/10 data-[selected=true]:bg-soniox/15"
        )}
      >
        {isAuto ? (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-700">
            <Languages className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-300" />
          </span>
        ) : (
          <CodeBadge code={code} selected={isSelected} />
        )}

        <span
          className={cn(
            "min-w-0 flex-1 truncate text-sm leading-tight text-zinc-800 dark:text-zinc-100",
            isSelected && "font-semibold text-soniox"
          )}
        >
          {name}
        </span>

        {providers.length > 0 && (
          <ProviderLogos
            providers={providers}
            getName={providerName}
            className="shrink-0"
          />
        )}

        <Check
          className={cn(
            "h-4 w-4 shrink-0 text-soniox transition-opacity",
            isSelected ? "opacity-100" : "opacity-0"
          )}
        />
      </CommandItem>
    );
  };

  const commandBody = (
    <Command
      filter={(value, search, keywords) => {
        const haystack = [value, ...(keywords ?? [])]
          .join(" ")
          .toLowerCase();
        return haystack.includes(search.toLowerCase().trim()) ? 1 : 0;
      }}
      className="bg-transparent"
    >
      <CommandInput placeholder="Search languages..." />
      <CommandList className="max-h-none min-h-0 flex-1">
        <CommandEmpty>No language found.</CommandEmpty>
        <CommandGroup>
          {renderRow(AUTO_VALUE, "Auto-detect language", [
            "auto",
            "automatic",
            "detect",
          ])}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup className="[&_[cmdk-group-items]]:flex [&_[cmdk-group-items]]:flex-col [&_[cmdk-group-items]]:gap-1">
          {languages.map((lang) =>
            renderRow(lang.code, lang.name, [lang.name, lang.code])
          )}
        </CommandGroup>
      </CommandList>
    </Command>
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) setPinnedOrder(languageHints);
        setOpen(nextOpen);
      }}
    >
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent
        showCloseButton
        overlayClassName="bg-black/10 backdrop-blur-[2px]"
        className="flex max-h-[min(82vh,680px)] w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
      >
        <DialogHeader className="border-b px-4 py-3 text-left">
          <DialogTitle className="text-sm font-semibold">
            Input language
          </DialogTitle>
        </DialogHeader>
        <div className="flex min-h-0 flex-1 flex-col">{commandBody}</div>
      </DialogContent>
    </Dialog>
  );
};

const CodeBadge: React.FC<{ code: string; selected?: boolean }> = ({
  code,
  selected,
}) => (
  <span
    className={cn(
      "grid h-6 w-6 shrink-0 place-items-center rounded-full",
      selected
        ? "bg-soniox/15 text-soniox"
        : "bg-zinc-100 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-300"
    )}
  >
    <span className="block font-mono text-[9px] font-semibold uppercase leading-none tracking-normal">
      {code}
    </span>
  </span>
);

const MAX_VISIBLE_LOGOS = 6;

const ProviderLogos: React.FC<{
  providers: ProviderName[];
  getName: (provider: ProviderName) => string;
  className?: string;
}> = ({ providers, getName, className }) => {
  const visible = providers.slice(0, MAX_VISIBLE_LOGOS);
  const overflow = providers.length - visible.length;

  return (
    <span
      className={cn(
        "flex items-center gap-1 opacity-35 transition-opacity group-hover:opacity-100 group-data-[selected=true]:opacity-100",
        className
      )}
    >
      {visible.map((provider) => (
        <span
          key={provider}
          title={getName(provider)}
          className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-white p-[3px]"
        >
          <img
            src={getProviderIcon(provider)}
            alt={getName(provider)}
            loading="lazy"
            className="h-full w-full object-contain"
          />
        </span>
      ))}
      {overflow > 0 && (
        <span className="text-[9px] font-semibold text-zinc-400">
          +{overflow}
        </span>
      )}
    </span>
  );
};
