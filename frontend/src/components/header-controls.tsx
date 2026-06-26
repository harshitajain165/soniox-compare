import React from "react";
import { LanguageSelect } from "./controls/language-select";
import { SettingsButton } from "./controls/settings-button";
import { AddProviderButton } from "./controls/add-provider-button";
import { useIsMobile } from "@/hooks/use-is-mobile";

export const HeaderControls: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center gap-2">
      <LanguageSelect className="w-auto max-w-[60vw] sm:max-w-[16rem]" />
      <SettingsButton />
      {!isMobile && <AddProviderButton />}
    </div>
  );
};
