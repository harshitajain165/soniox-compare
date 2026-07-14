import { AudioLines, Type } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ResponsiveTooltip } from "@/components/ui/responsive-tooltip";
import { useComparison } from "@/contexts/comparison-context";
import { useUrlSettings, type Mode } from "@/hooks/use-url-settings";
import { cn } from "@/lib/utils";

const modeItems = [
  {
    value: "text" as Mode,
    label: "Speech-to-Text",
    ariaLabel: "Translate to text",
    tooltip: "Translate to text, comparing providers side by side",
    Icon: Type,
  },
  {
    value: "s2s" as Mode,
    label: "Speech-to-Speech",
    ariaLabel: "Speech to speech",
    tooltip: "Speak the translation aloud (one provider at a time)",
    Icon: AudioLines,
  },
];

export const ModeToggle = () => {
  const { settings, setMode } = useUrlSettings();
  const { recordingState } = useComparison();
  const disabled = recordingState !== "idle";

  return (
    <ToggleGroup
      type="single"
      value={settings.mode}
      onValueChange={(value) => {
        if (value) setMode(value as Mode);
      }}
      disabled={disabled}
      className="border-input h-9 shrink-0 items-stretch rounded-md border bg-transparent p-[3px] shadow-xs has-[:disabled]:opacity-50 dark:bg-input/30"
    >
      {modeItems.map(({ value, label, ariaLabel, tooltip, Icon }) => {
        const selected = settings.mode === value;
        return (
          <ResponsiveTooltip key={value} content={tooltip}>
            <ToggleGroupItem
              value={value}
              aria-label={ariaLabel}
              className={cn(
                "h-full flex-1 gap-1.5 rounded-sm px-2.5 text-sm font-medium",
                "first:rounded-l-sm last:rounded-r-sm",
                "transition-all duration-150 active:scale-[0.97]",
                selected
                  ? "bg-soniox/10 text-soniox hover:bg-soniox/15 hover:text-soniox"
                  : "text-muted-foreground hover:bg-transparent hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </ToggleGroupItem>
          </ResponsiveTooltip>
        );
      })}
    </ToggleGroup>
  );
};
