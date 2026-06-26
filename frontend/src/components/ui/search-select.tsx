"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { useIsMobile } from "@/hooks/use-is-mobile";

export interface SearchSelectOption {
  value: string;
  label: string;
}

interface SearchSelectProps {
  options: SearchSelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  notFoundMessage?: string;
  disabled?: boolean;
  className?: string;
  highlightedValues?: string[];
  pinnedValues?: string[];
}

export const SearchSelect: React.FC<SearchSelectProps> = ({
  options,
  value,
  onValueChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  notFoundMessage = "No results found.",
  disabled = false,
  className,
  highlightedValues = [],
  pinnedValues = [],
}) => {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const selectedOption = options.find((option) => option.value === value);

  // Custom filter function for Command
  const filterFunction = (itemValue: string, search: string): number => {
    const option = options.find((opt) => opt.value === itemValue);
    if (option && option.label.toLowerCase().includes(search.toLowerCase())) {
      return 1; // Match
    }
    return 0; // No match
  };

  // Pinned options are always shown first (after the selected one), in the
  // order given by `pinnedValues`, and excluded from the sorted groups below.
  const pinnedOptions = pinnedValues
    .map((pinnedValue) => options.find((option) => option.value === pinnedValue))
    .filter(
      (option): option is SearchSelectOption =>
        !!option && option.value !== value
    );

  const highlightedOptions = options
    .filter(
      (option) =>
        highlightedValues.includes(option.value) &&
        !pinnedValues.includes(option.value) &&
        option.value !== value
    )
    .sort((a, b) => a.label.localeCompare(b.label));

  const otherOptions = options
    .filter(
      (option) =>
        !highlightedValues.includes(option.value) &&
        !pinnedValues.includes(option.value) &&
        option.value !== value
    )
    .sort((a, b) => a.label.localeCompare(b.label));

  const renderOption = (option: SearchSelectOption) => (
    <CommandItem
      key={option.value}
      value={option.value}
      onSelect={(currentValue) => {
        onValueChange(currentValue === value ? "" : currentValue);
        setOpen(false);
      }}
      className={cn(
        value === option.value && "font-semibold",
        highlightedValues.includes(option.value) &&
          "font-medium text-soniox data-[selected=true]:text-soniox/80"
      )}
    >
      {stripOutLeadingUnderscore(option.label)}
      <Check
        className={cn(
          "ml-2 h-4 w-4 stroke-3 text-black",
          value === option.value ? "opacity-100" : "opacity-0",
          highlightedValues.includes(option.value) && "text-soniox"
        )}
      />
    </CommandItem>
  );

  const commandContent = (
    <>
      {(selectedOption || pinnedOptions.length > 0) && (
        <CommandGroup>
          {selectedOption && renderOption(selectedOption)}
          {pinnedOptions.map(renderOption)}
        </CommandGroup>
      )}
      {highlightedOptions.length > 0 && (
        <CommandGroup heading="Suggested">
          {highlightedOptions.map(renderOption)}
        </CommandGroup>
      )}
      {otherOptions.length > 0 && (
        <CommandGroup
          heading={highlightedOptions.length > 0 ? "Others" : undefined}
        >
          {otherOptions.map(renderOption)}
        </CommandGroup>
      )}
    </>
  );

  const triggerButton = (
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      className={cn("w-full justify-between", className)}
      disabled={disabled}
    >
      <span className="min-w-0 flex-1 truncate text-left">
        {selectedOption
          ? stripOutLeadingUnderscore(selectedOption.label)
          : placeholder}
      </span>
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  );

  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent className="p-0 h-dvh w-dvh max-w-full flex flex-col sm:h-auto sm:w-auto sm:max-w-[calc(100%-2rem)]">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>{placeholder}</DialogTitle>
          </DialogHeader>
          <Command filter={filterFunction} className="p-2">
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{notFoundMessage}</CommandEmpty>
              {commandContent}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
        side="bottom"
        avoidCollisions={true}
      >
        <Command filter={filterFunction}>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList className="max-h-[200px] sm:max-h-auto">
            <CommandEmpty>{notFoundMessage}</CommandEmpty>
            {commandContent}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const stripOutLeadingUnderscore = (str: string) => {
  return str.replace(/^_/, "");
};
