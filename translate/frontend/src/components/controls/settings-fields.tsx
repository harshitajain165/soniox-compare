import React from "react";
import { useUrlSettings } from "@/hooks/use-url-settings";
import { useComparison } from "@/contexts/comparison-context";
import { useFeatures } from "@/contexts/feature-context";
import { ALL_PROVIDERS_LIST, type ProviderName } from "@/lib/provider-features";
import { FeatureSection } from "./feature-section";

export const SettingsFields = () => {
  const { recordingState } = useComparison();
  const { providerFeatures, supportsFeature } = useFeatures();
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

  const getProvidersForFeature = (featureKey: string): ProviderName[] =>
    ALL_PROVIDERS_LIST.filter((provider) => supportsFeature(provider, featureKey));

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
        description="Detects speaker changes, so multi-person conversations are easy to follow. Each speaker's utterances and their translations are grouped together."
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
        description="Automatically identifies the spoken language and labels each utterance with the language pair it was translated across."
        checked={enableLanguageIdentification}
        onCheckedChange={(v) => setEnableLanguageIdentification(v)}
        disabled={isBusy}
        providers={getProvidersForFeature("language_identification")}
        getName={providerName}
      />

      <FeatureSection
        title="Endpoint detection"
        description="Detects when a speaker has finished an utterance, so the translation is finalized (and spoken) without waiting for the next one."
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
