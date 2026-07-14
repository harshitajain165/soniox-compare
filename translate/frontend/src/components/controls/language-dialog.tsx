import React from "react";
import { Check } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
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

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
  title: string;
  /** CommandGroup / CommandSeparator children rendered inside the list. */
  children: React.ReactNode;
};

export const LanguageDialog = ({
  open,
  onOpenChange,
  trigger,
  title,
  children,
}: DialogProps) => (
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
          <CommandInput placeholder="Search languages..." />
          <CommandList className="max-h-none min-h-0 flex-1">
            <CommandEmpty>No language found.</CommandEmpty>
            {children}
          </CommandList>
        </Command>
      </div>
    </DialogContent>
  </Dialog>
);

type RowProps = {
  code: string;
  name: string;
  keywords: string[];
  selected: boolean;
  providers: ProviderName[];
  getProviderName: (provider: ProviderName) => string;
  onSelect: (code: string) => void;
  /** Replaces the default CodeBadge, e.g. for the auto-detect row. */
  icon?: React.ReactNode;
};

export const LanguageRow = ({
  code,
  name,
  keywords,
  selected,
  providers,
  getProviderName,
  onSelect,
  icon,
}: RowProps) => (
  <CommandItem
    value={code}
    keywords={keywords}
    onSelect={() => onSelect(code)}
    className={cn(
      "group flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2",
      selected && "bg-soniox/10 data-[selected=true]:bg-soniox/15",
    )}
  >
    {icon ?? <CodeBadge code={code} selected={selected} />}

    <span
      className={cn(
        "min-w-0 flex-1 truncate text-sm leading-tight text-zinc-800 dark:text-zinc-100",
        selected && "font-semibold text-soniox",
      )}
    >
      {name}
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
