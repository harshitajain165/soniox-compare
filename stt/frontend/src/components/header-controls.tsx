import { LanguageSelect } from "./controls/language-select";
import { RawModeToggle } from "./controls/raw-mode-toggle";
import { SettingsButton } from "./controls/settings-button";
import { AddProviderButton } from "./controls/add-provider-button";
import { useIsMobile } from "@/hooks/use-is-mobile";

export const HeaderControls = () => {
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center gap-2">
      <LanguageSelect className="w-auto max-w-[60vw] sm:max-w-[16rem]" />
      <RawModeToggle />
      <SettingsButton />
      {!isMobile && <AddProviderButton />}
    </div>
  );
};
