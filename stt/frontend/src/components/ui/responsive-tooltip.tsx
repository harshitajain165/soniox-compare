import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { cn } from "@/lib/utils";
import type React from "react";

interface ResponsiveTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  contentClassName?: string;
  arrowClassName?: string;
}

export const ResponsiveTooltip = ({
  children,
  content,
  contentClassName,
  arrowClassName,
}: ResponsiveTooltipProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Popover>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent
          className={cn("text-xs w-auto max-w-[80dvw] p-2", contentClassName)}
        >
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        className={cn(contentClassName, "max-w-[300px]")}
        arrowClassName={arrowClassName}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
};
