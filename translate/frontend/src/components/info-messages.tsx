import { AlertTriangle, Info, XCircle } from "lucide-react";
import type { InfoMessage } from "@/contexts/comparison-context";
import MarkdownRenderer from "./markdown-renderer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

type Props = {
  infoMessages?: InfoMessage[];
};

export const InfoMessages = ({ infoMessages }: Props) => {
  if (!infoMessages || infoMessages.length === 0) {
    return null;
  }

  return (
    <div className="border-t shrink-0 z-10 border-gray-100 dark:border-gray-700">
      <Accordion type="multiple" className="w-full">
        {infoMessages.map((info, index) => (
          <AccordionItem
            value={`item-${index}`}
            key={index}
            className="border-b-0 hover:bg-black/5 transition-colors"
          >
            <AccordionTrigger className="px-2 py-1.5 text-xs truncate hover:no-underline cursor-pointer">
              <div className="flex items-center gap-2 truncate">
                {info.level === "warning" && (
                  <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0" />
                )}
                {info.level === "error" && (
                  <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                )}
                {info.level === "info" && (
                  <Info className="h-4 w-4 text-blue-500 shrink-0" />
                )}
                <span className="truncate text-[10px]">{info.message}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-2 mb-1 mx-2 text-[10px] bg-black/5 dark:bg-white/5 rounded-md">
              <MarkdownRenderer>{info.message}</MarkdownRenderer>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
