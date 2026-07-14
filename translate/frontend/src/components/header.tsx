import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

type Props = {
  controls?: ReactNode;
};

export const Header = ({ controls }: Props) => {
  return (
    <header className="shrink-0 flex items-center justify-between gap-2 h-14 px-4 border-b border-gray-200 bg-zinc-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-2">
        <img
          src="/soniox-compare.svg"
          alt="Soniox Compare Logo"
          className="h-6"
        />
      </div>
      <TooltipProvider>
        <div className="flex items-center gap-3">{controls}</div>
      </TooltipProvider>
    </header>
  );
};
