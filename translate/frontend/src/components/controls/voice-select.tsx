import { useEffect, useState } from "react";

import { SearchSelect } from "@/components/ui/search-select";
import { useComparison } from "@/contexts/comparison-context";
import { useFeatures } from "@/contexts/feature-context";
import { activeProviders, useUrlSettings } from "@/hooks/use-url-settings";
import type { ProviderName } from "@/lib/provider-features";

interface Voice {
  id: string;
  name?: string;
}

const voiceLabel = (voice: Voice): string => voice.name || voice.id;

export const VoiceSelect = ({ className }: { className?: string }) => {
  const { settings, setVoice } = useUrlSettings();
  const { recordingState } = useComparison();
  const { getProviderFeatures } = useFeatures();
  const [voices, setVoices] = useState<Voice[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const provider: ProviderName = activeProviders(settings)[0];
  const voiceSelection = getProviderFeatures(provider)?.voice_selection;
  const selectable =
    typeof voiceSelection === "object" && voiceSelection.state === "SUPPORTED";
  const active = settings.mode === "s2s" && selectable;

  useEffect(() => {
    if (!active) {
      setVoices([]);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    fetch(`/compare/api/providers/${provider}/voices`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: { voices: Voice[] }) => {
        if (cancelled) return;
        setVoices(data.voices ?? []);
      })
      .catch((err) => console.warn("[VoiceSelect] failed to load voices:", err))
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [active, provider]);

  useEffect(() => {
    if (!active || voices.length === 0) return;
    if (!voices.some((v) => v.id === settings.voice)) setVoice(voices[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, voices, settings.voice]);

  if (!active) return null;

  return (
    <div className={className}>
      <SearchSelect
        options={voices.map((voice) => ({
          value: voice.id,
          label: voiceLabel(voice),
        }))}
        value={settings.voice}
        onValueChange={(id) => id && setVoice(id)}
        placeholder={isLoading ? "Loading voices..." : "Voice"}
        searchPlaceholder="Search voices..."
        notFoundMessage="No voices found."
        disabled={recordingState !== "idle" || isLoading}
        className="w-full"
      />
    </div>
  );
};
