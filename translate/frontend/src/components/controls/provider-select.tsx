import React from "react";
import { ChevronsUpDown } from "lucide-react";
import { useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProviderPickerGrid } from "@/components/provider-picker-grid";
import { ProviderLogo } from "@/components/provider-logo";
import { activeProviders, useUrlSettings } from "@/hooks/use-url-settings";
import { useModeSupport } from "@/hooks/use-mode-support";
import { useFeatures } from "@/contexts/feature-context";
import { useComparison } from "@/contexts/comparison-context";

/**
 * Header control choosing the single speech-to-speech provider. Mirrors the
 * text-mode "Add provider" control: same slot, same modal picker.
 */
export const ProviderSelect = () => {
  const { settings, setS2sProvider } = useUrlSettings();
  const { providerFeatures, availableProviders } = useFeatures();
  const { disabledReasons } = useModeSupport();
  const { recordingState } = useComparison();
  const prefersReducedMotion = useReducedMotion();

  const [open, setOpen] = React.useState(false);

  const disabled = recordingState !== "idle";
  const provider = activeProviders(settings)[0];
  const providers = availableProviders;
  const name = providerFeatures?.[provider]?.name ?? provider;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          aria-label={`Switch provider (currently ${name})`}
          className="shrink-0 gap-1.5"
        >
          <ProviderLogo provider={provider} name={name} className="h-4 w-4" />
          <span className="hidden max-w-[8rem] truncate capitalize sm:inline">
            {name}
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 text-zinc-400" />
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton
        className="flex max-h-[min(85vh,760px)] w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg"
      >
        <DialogHeader className="border-b px-5 py-4 text-left">
          <DialogTitle className="text-lg font-semibold">
            Select provider
          </DialogTitle>
          <DialogDescription>
            Pick the provider that speaks the translation.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <ProviderPickerGrid
            providers={providers}
            providerFeatures={providerFeatures}
            onPick={(picked) => {
              setOpen(false);
              if (picked !== provider) setS2sProvider(picked);
            }}
            prefersReducedMotion={!!prefersReducedMotion}
            columns={2}
            selectedProvider={provider}
            disabledReasons={disabledReasons}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
