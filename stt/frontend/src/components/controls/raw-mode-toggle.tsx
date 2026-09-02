import { Braces } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ResponsiveTooltip } from "@/components/ui/responsive-tooltip";
import { useUrlSettings } from "@/hooks/use-url-settings";

export const RawModeToggle = () => {
  const { settings, setRawMode } = useUrlSettings();
  const rawMode = settings.rawMode;

  return (
    <ResponsiveTooltip
      content={
        <>
          <p>
            {rawMode
              ? "Showing the messages each provider sends, unaggregated. Click to go back to transcripts."
              : "Show the messages each provider sends, unaggregated, instead of the rendered transcript."}
          </p>
          <p className="mt-1 opacity-70">
            Providers reached through an SDK rather than a plain websocket are
            rebuilt from the parsed event, and say so when expanded.
          </p>
        </>
      }
    >
      <Button
        variant={rawMode ? "default" : "outline"}
        size="icon"
        aria-pressed={rawMode}
        aria-label="Raw provider messages"
        onClick={() => setRawMode(!rawMode)}
        className="shrink-0"
      >
        <Braces className="h-4 w-4" />
      </Button>
    </ResponsiveTooltip>
  );
};
