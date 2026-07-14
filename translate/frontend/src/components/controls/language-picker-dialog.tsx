import React from "react";
import { Check } from "lucide-react";

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
import type { ProviderName } from "@/lib/provider-features";
import { cn } from "@/lib/utils";
import { CodeBadge } from "./code-badge";
import { ProviderLogos } from "./provider-logos";

export type LanguageOption = {
  code: string;
  name: string;
  keywords?: string[];
  icon?: React.ReactNode;
};

export type LanguageGroup = {
  heading?: string;
  options: LanguageOption[];
};

type Props = {
  title: string;
  trigger: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: LanguageGroup[];
  isSelected: (code: string) => boolean;
  onSelect: (code: string) => void;
  getProviders: (code: string) => ProviderName[];
  getProviderName: (provider: ProviderName) => string;
  searchPlaceholder?: string;
  emptyMessage?: string;
};

export const LanguagePickerDialog = ({
  title,
  trigger,
  open,
  onOpenChange,
  groups,
  isSelected,
  onSelect,
  getProviders,
  getProviderName,
  searchPlaceholder = "Search languages...",
  emptyMessage = "No language found.",
}: Props) => {
  const renderRow = (option: LanguageOption) => {
    const selected = isSelected(option.code);
    const providers = getProviders(option.code);

    return (
      <CommandItem
        key={option.code}
        value={option.code}
        keywords={option.keywords ?? [option.name, option.code]}
        onSelect={() => onSelect(option.code)}
        className={cn(
          "group flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2",
          selected && "bg-soniox/10 data-[selected=true]:bg-soniox/15",
        )}
      >
        {option.icon ?? <CodeBadge code={option.code} selected={selected} />}

        <span
          className={cn(
            "min-w-0 flex-1 truncate text-sm leading-tight text-zinc-800 dark:text-zinc-100",
            selected && "font-semibold text-soniox",
          )}
        >
          {option.name}
        </span>

        {providers.length > 0 && (
          <ProviderLogos
            providers={providers}
            getName={getProviderName}
            className="shrink-0"
          />
        )}

        <Check
          className={cn(
            "h-4 w-4 shrink-0 text-soniox transition-opacity",
            selected ? "opacity-100" : "opacity-0",
          )}
        />
      </CommandItem>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        showCloseButton
        overlayClassName="bg-black/10 backdrop-blur-[2px]"
        className="flex max-h-[min(82vh,680px)] w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
      >
        <DialogHeader className="border-b px-4 py-3 text-left">
          <DialogTitle className="text-sm font-semibold">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex min-h-0 flex-1 flex-col">
          <Command
            filter={(value, search, keywords) => {
              const haystack = [value, ...(keywords ?? [])]
                .join(" ")
                .toLowerCase();
              return haystack.includes(search.toLowerCase().trim()) ? 1 : 0;
            }}
            className="bg-transparent"
          >
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList className="max-h-none min-h-0 flex-1">
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              {groups.map((group, index) => (
                <React.Fragment key={group.heading ?? index}>
                  {index > 0 && <CommandSeparator />}
                  <CommandGroup
                    heading={group.heading}
                    className="[&_[cmdk-group-items]]:flex [&_[cmdk-group-items]]:flex-col [&_[cmdk-group-items]]:gap-1"
                  >
                    {group.options.map(renderRow)}
                  </CommandGroup>
                </React.Fragment>
              ))}
            </CommandList>
          </Command>
        </div>
      </DialogContent>
    </Dialog>
  );
};
