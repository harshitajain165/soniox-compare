import { LanguageSelect } from "@/components/language-select";
import { SamplesButton } from "@/components/samples-button";

export const HeaderControls = () => {
  return (
    <div className="flex items-center gap-2">
      <LanguageSelect className="w-auto max-w-[60vw] sm:max-w-[16rem]" />
      <SamplesButton />
    </div>
  );
};
