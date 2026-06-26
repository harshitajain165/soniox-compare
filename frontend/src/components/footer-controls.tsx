import React from "react";
import { FaGithub } from "react-icons/fa";
import { ActionPanel } from "./sidebar/action-panel";
import { Button } from "./ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ResponsiveTooltip } from "./ui/responsive-tooltip";

export const FooterControls: React.FC = () => {
  return (
    <div className="flex w-full items-center gap-3">
      {/* Hidden on mobile so it doesn't crowd the action controls. */}
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
        <ActionPanel />
      </div>
    </div>
  );
};
