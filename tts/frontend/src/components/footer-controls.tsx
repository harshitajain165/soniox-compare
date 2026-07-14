import { FaGithub } from "react-icons/fa";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TextInput } from "./text-input";
import { Button } from "./ui/button";
import { ResponsiveTooltip } from "./ui/responsive-tooltip";

export const FooterControls = () => {
  return (
    <div className="flex w-full items-start gap-3">
      {/* Hidden on mobile so it doesn't crowd the text input. */}
      <TooltipProvider>
        <ResponsiveTooltip content={<p>View on GitHub</p>}>
          <a
            href="https://github.com/soniox/soniox-compare"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden shrink-0 text-gray-400 sm:inline-flex"
          >
            <Button variant="ghost" size="icon">
              <FaGithub className="size-5" />
            </Button>
          </a>
        </ResponsiveTooltip>
      </TooltipProvider>
      <div className="min-w-0 flex-1">
        <TextInput />
      </div>
    </div>
  );
};
