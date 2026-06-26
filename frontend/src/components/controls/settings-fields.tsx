import React from "react";
import { Switch } from "@/components/ui/switch";
import { useUrlSettings } from "@/hooks/use-url-settings";
import { useComparison } from "@/contexts/comparison-context";
import { useFeatures } from "@/contexts/feature-context";
import {
  ALL_PROVIDERS_LIST,
  getProviderIcon,
  type ProviderName,
} from "@/lib/provider-features";
import { cn } from "@/lib/utils";

export const SettingsFields: React.FC = () => {
  const { recordingState } = useComparison();
  const { providerFeatures } = useFeatures();
  const {
    settings,
    setEnableSpeakerDiarization,
    setEnableLanguageIdentification,
    setEnableEndpointDetection,
  } = useUrlSettings();
  const {
    enableSpeakerDiarization,
    enableLanguageIdentification,
    enableEndpointDetection,
  } = settings;

  const isRecording = recordingState === "recording";
  const isStarting = recordingState === "starting";
  const isBusy = isRecording || isStarting;

  const providerName = (provider: ProviderName) =>
    providerFeatures?.[provider]?.name ?? provider;

  // Providers whose feature flag is SUPPORTED (or PARTIAL) for a given key.
  const getProvidersForFeature = (featureKey: string): ProviderName[] =>
    ALL_PROVIDERS_LIST.filter((provider) => {
      const value = providerFeatures?.[provider]?.[featureKey];
      if (typeof value === "boolean") return value;
      if (value && typeof value === "object") {
        return value.state === "SUPPORTED" || value.state === "PARTIAL";
      }
      return false;
    });

  // Speaker diarization and endpoint detection are mutually exclusive.
  // Guard against an invalid URL state where both arrive enabled.
  React.useEffect(() => {
    if (enableSpeakerDiarization && enableEndpointDetection) {
      setEnableEndpointDetection(false);
    }
  }, [
    enableSpeakerDiarization,
    enableEndpointDetection,
    setEnableEndpointDetection,
  ]);

  return (
    <div className="flex flex-col gap-4">
      <FeatureSection
        title="Speaker diarization"
        description="Detects speaker changes, so multi-person conversations are easy to follow. Soniox separates and identifies speakers across 60+ languages."
        checked={enableSpeakerDiarization}
        onCheckedChange={(v) => setEnableSpeakerDiarization(v)}
        disabled={isBusy || enableEndpointDetection}
        hint={
          enableEndpointDetection
            ? "Disable endpoint detection to use speaker diarization."
            : undefined
        }
        providers={getProvidersForFeature("speaker_diarization")}
        getName={providerName}
      />

      <FeatureSection
        title="Language identification"
        description="Automatically identifies spoken languages. Soniox tags language at the token level."
        checked={enableLanguageIdentification}
        onCheckedChange={(v) => setEnableLanguageIdentification(v)}
        disabled={isBusy}
        providers={getProvidersForFeature("language_identification")}
        getName={providerName}
      />

      <FeatureSection
        title="Endpoint detection"
        description="Detects when a speaker has finished an utterance to finalize segments in real time. Soniox uses semantic endpointing for this."
        checked={enableEndpointDetection}
        onCheckedChange={(v) => setEnableEndpointDetection(v)}
        disabled={isBusy || enableSpeakerDiarization}
        hint={
          enableSpeakerDiarization
            ? "Disable speaker diarization to use endpoint detection."
            : undefined
        }
        providers={getProvidersForFeature("endpoint_detection")}
        getName={providerName}
      />
    </div>
  );
};

interface FeatureSectionProps {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  hint?: string;
  providers: ProviderName[];
  getName: (provider: ProviderName) => string;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({
  title,
  description,
  checked,
  onCheckedChange,
  disabled,
  hint,
  providers,
  getName,
}) => {
  return (
    <section
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={checked}
      aria-disabled={disabled}
      onClick={() => !disabled && onCheckedChange(!checked)}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCheckedChange(!checked);
        }
      }}
      className={cn(
        "flex gap-3.5 rounded-xl border p-3 outline-none transition-colors",
        checked
          ? "border-soniox/30 bg-soniox/5 dark:bg-soniox/10"
          : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900",
        disabled
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer focus-visible:ring-2 focus-visible:ring-soniox/40",
        !disabled &&
          !checked &&
          "hover:border-zinc-300 hover:bg-zinc-50 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/60"
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </h3>
          <p className="mt-0.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
          {hint && (
            <p className="mt-1.5 text-xs font-medium text-amber-600 dark:text-amber-500">
              {hint}
            </p>
          )}
          {providers.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-zinc-400">
                Supported by
              </span>
              <span className="flex items-center gap-1">
                {providers.map((provider) => (
                  <span
                    key={provider}
                    title={getName(provider)}
                    className="flex h-[18px] w-[18px] items-center justify-center overflow-hidden rounded-full bg-white p-[3px] ring-1 ring-zinc-200 dark:ring-zinc-700"
                  >
                    <img
                      src={getProviderIcon(provider)}
                      alt={getName(provider)}
                      loading="lazy"
                      className="h-full w-full rounded-full object-cover"
                    />
                  </span>
                ))}
              </span>
            </div>
          )}
        </div>
        <span
          className="mt-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          <Switch
            checked={checked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
            aria-label={title}
          />
        </span>
      </div>
    </section>
  );
};
