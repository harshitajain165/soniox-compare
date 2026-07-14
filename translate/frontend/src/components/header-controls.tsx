import { LanguageSelect } from "./controls/language-select";
import { TargetLanguageSelect } from "./controls/target-language-select";
import { VoiceSelect } from "./controls/voice-select";
import { SettingsButton } from "./controls/settings-button";
import { AddProviderButton } from "./controls/add-provider-button";
import { ProviderSelect } from "./controls/provider-select";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useUrlSettings } from "@/hooks/use-url-settings";
import { ArrowRight } from "lucide-react";

export const HeaderControls = () => {
  const isMobile = useIsMobile();
  const { settings } = useUrlSettings();

  return (
    <div className="flex items-center gap-2">
      <LanguageSelect className="w-auto max-w-[40vw] sm:max-w-[12rem]" />
      <ArrowRight className="hidden h-4 w-4 shrink-0 text-zinc-400 sm:block" />
      <TargetLanguageSelect className="w-auto max-w-[40vw] sm:max-w-[12rem]" />
      <VoiceSelect className="hidden w-[11rem] sm:block" />
      <SettingsButton />
      {/* Text mode adds comparison providers; speech-to-speech runs a single
          provider, picked from the equivalent header dropdown. */}
      {!isMobile && settings.mode === "text" && <AddProviderButton />}
      {settings.mode === "s2s" && <ProviderSelect />}
    </div>
  );
};
