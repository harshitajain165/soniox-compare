import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUrlSettings } from "@/hooks/use-url-settings";
import { SettingsFields } from "./settings-fields";

export const SettingsButton = () => {
  const { settings } = useUrlSettings();
  const enabledCount = [
    settings.enableSpeakerDiarization,
    settings.enableLanguageIdentification,
    settings.enableEndpointDetection,
  ].filter(Boolean).length;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label={`Settings${
            enabledCount > 0 ? ` (${enabledCount} enabled)` : ""
          }`}
          className="relative shrink-0"
        >
          <Settings2 className="h-4 w-4" />
          {enabledCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-soniox px-1 text-[10px] font-semibold leading-none text-white ring-2 ring-white dark:ring-zinc-900">
              {enabledCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton
        overlayClassName="bg-black/10 backdrop-blur-[2px]"
        className="flex max-h-[min(85vh,760px)] w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg"
      >
        <DialogHeader className="border-b px-5 py-4 text-left">
          <DialogTitle className="text-lg font-semibold">Settings</DialogTitle>
          <DialogDescription>
            Configure how transcription behaves across all providers.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <SettingsFields />
        </div>
      </DialogContent>
    </Dialog>
  );
};
