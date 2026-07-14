import type { OutputData } from "@/contexts/comparison-context";
import { buildBlocks, type TranslationBlock } from "@/lib/translation-blocks";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { AutoScrollContainer } from "./ui/autoscroll";
import MarkdownRenderer from "./markdown-renderer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";

export const SPEAKER_COLORS = [
  "#007ecc", // Blue
  "#5aa155", // Green
  "#e0585b", // Red
  "#f18f3b", // Orange
  "#77b7b2", // Teal
  "#edc958", // Yellow
  "#af7aa0", // Purple
  "#fe9ea8", // Pink
  "#9c7561", // Brown
  "#bab0ac", // Gray
  "#8884d8", // Light Purple
  "#82ca9d", // Light Green
  "#ff7f0e", // Vivid Orange
  "#1f77b4", // Ocean Blue
  "#d62728", // Crimson
  "#9467bd", // Lavender
  "#8c564b", // Reddish Brown
  "#e377c2", // Magenta
  "#7f7f7f", // Neutral Gray
  "#bcbd22", // Lime
  "#17becf", // Cyan
  "#aec7e8", // Light Blue
  "#c5b0d5", // Soft Purple
  "#ffbb78", // Soft Orange
  "#98df8a", // Soft Green
];

const languageName = (code: string): string => {
  try {
    return (
      new Intl.DisplayNames(["en"], { type: "language" }).of(code) || code
    );
  } catch {
    return code;
  }
};

type Props = {
  outputData: OutputData;
  appError?: string | null;
  targetLanguage: string;
  // Language pills are only meaningful when the source language is being
  // detected rather than pinned.
  showLanguages: boolean;
};

export const TranslationRenderer = ({
  outputData,
  appError,
  targetLanguage,
  showLanguages,
}: Props) => {
  const { statusMessage, finalParts, nonFinalParts, error } = outputData;

  const blocks = useMemo(
    () => buildBlocks(finalParts, nonFinalParts),
    [finalParts, nonFinalParts]
  );

  let content = null;

  if (appError) {
    content = <ErrorMessage error={appError} />;
  } else if (statusMessage) {
    content = <p className="text-gray-500 italic">{statusMessage}</p>;
  } else if (blocks.length === 0 && !error) {
    content = <p className="text-gray-400 italic">No output yet...</p>;
  } else {
    content = (
      <div className="space-y-4">
        {blocks.map((block, i) => (
          <Utterance
            key={i}
            block={block}
            targetLanguage={targetLanguage}
            showLanguages={showLanguages}
          />
        ))}
      </div>
    );
  }

  return (
    <AutoScrollContainer className="absolute inset-0 pb-5">
      {content}
    </AutoScrollContainer>
  );
};

const Utterance = ({
  block,
  targetLanguage,
  showLanguages,
}: {
  block: TranslationBlock;
  targetLanguage: string;
  showLanguages: boolean;
}) => {
  const { speaker, sourceLanguage } = block;
  const speakerColor =
    speaker != null
      ? SPEAKER_COLORS[(speaker - 1) % SPEAKER_COLORS.length]
      : undefined;

  const hasOriginal = block.originalFinal || block.originalPartial;
  const hasTranslation = block.translationFinal || block.translationPartial;

  return (
    <div>
      {(speaker != null || (showLanguages && sourceLanguage)) && (
        <div className="mb-1 flex items-center gap-2 text-sm">
          {speaker != null && (
            <span className="font-semibold uppercase" style={{ color: speakerColor }}>
              SPEAKER {speaker}
            </span>
          )}
          {showLanguages && sourceLanguage && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              {languageName(sourceLanguage)}
            </span>
          )}
        </div>
      )}

      {/* The source transcript is context; the translation is the answer. */}
      {hasOriginal && (
        <p className="text-sm leading-snug text-gray-500 dark:text-gray-400">
          <span>{block.originalFinal}</span>
          <span className="italic opacity-70">{block.originalPartial}</span>
          {block.endDetected && <EndpointMarker />}
        </p>
      )}

      {hasTranslation && (
        <p
          className={cn(
            "mt-1 leading-normal",
            hasOriginal && "border-l-2 border-gray-200 pl-2 dark:border-gray-700"
          )}
        >
          {showLanguages && sourceLanguage && targetLanguage && (
            <span className="mr-1.5 text-xs font-medium text-gray-400 dark:text-gray-500">
              {sourceLanguage} ▸ {targetLanguage}
            </span>
          )}
          <span className="text-gray-800 dark:text-gray-200">
            {block.translationFinal}
          </span>
          <span className="italic text-gray-500 dark:text-gray-400">
            {block.translationPartial}
          </span>
          {block.endDetected && !hasOriginal && <EndpointMarker />}
        </p>
      )}
    </div>
  );
};

const EndpointMarker = () => (
  <span className="px-2 py-1 text-gray-700 dark:text-gray-300 rounded-lg text-[10px] font-semibold tracking-wider opacity-50">
    {`<end>`}
  </span>
);

const MAX_ERROR_LENGTH = 150;

const ErrorMessage = ({ error }: { error: string }) => {
  if (error.length <= MAX_ERROR_LENGTH) {
    return (
      <div className="text-soniox bg-blue-50 p-2 md:p-4 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 text-center text-sm rounded-2xl max-w-[90%]">
        <div className="brightness-90">
          <MarkdownRenderer>{error}</MarkdownRenderer>
        </div>
      </div>
    );
  }

  const truncatedError = error.substring(0, MAX_ERROR_LENGTH) + "...";

  return (
    <Dialog>
      <div className="text-soniox bg-blue-50 p-4 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 text-center text-sm rounded-2xl max-w-[90%] space-y-2">
        <div className="brightness-90">
          <MarkdownRenderer>{truncatedError}</MarkdownRenderer>
        </div>
        <DialogTrigger asChild>
          <Button size="sm" variant="link" className="text-soniox p-0 h-auto">
            View Full Error
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className="max-w-[90vw] md:max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Error Details</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto">
          <pre className="text-sm text-left bg-gray-100 dark:bg-gray-900 p-4 rounded-md whitespace-pre-wrap break-words">
            <code>{error}</code>
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
};
