import type { OutputData, TranscriptPart } from "@/contexts/comparison-context";
import { cn } from "@/lib/utils";
import React, { memo } from "react";
import { AutoScrollContainer } from "./ui/autoscroll";
import { TooltipProvider } from "@/components/ui/tooltip";
import MarkdownRenderer from "./markdown-renderer";
import { ResponsiveTooltip } from "./ui/responsive-tooltip";
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

interface TranscriptRendererProps {
  outputData: OutputData;
  appError?: string | null;
}

export const TranscriptRenderer: React.FC<TranscriptRendererProps> = ({
  outputData,
  appError,
}) => {
  const { statusMessage, finalParts, nonFinalParts, error } = outputData;

  const renderParts = (
    parts: TranscriptPart[],
    isFinalStyling: boolean,
    previousPartSpeaker?: number | string | null,
    previousPartLanguage?: string | null,
    keyPrefix?: string
  ) => {
    const elementsArray: React.ReactNode[] = [];

    parts.forEach((part, index) => {
      const partSpeaker = part.speaker || null;
      const partLanguage = part.language || null;

      let displaySpeakerName = false;
      let displayLanguageTag = false;

      if (partSpeaker && partSpeaker !== previousPartSpeaker) {
        displaySpeakerName = true;
      }

      // This logic remains to track *when* a language tag should be shown
      if (partLanguage) {
        if (displaySpeakerName) {
          displayLanguageTag = true;
        } else if (partLanguage !== previousPartLanguage) {
          displayLanguageTag = true;
        }
      }

      let headerWasDrawnThisIteration = false;
      if (displaySpeakerName) {
        const headerDivColor =
          SPEAKER_COLORS[(Number(partSpeaker) - 1) % SPEAKER_COLORS.length];

        elementsArray.push(
          <div
            key={`${keyPrefix}-header-${index}`}
            className="mt-3 text-base"
            style={{ color: headerDivColor }}
          >
            <span key="spk-name" className="font-semibold uppercase text-sm">
              SPEAKER {partSpeaker}
            </span>
          </div>
        );
        headerWasDrawnThisIteration = true;
      }

      const textToRender = headerWasDrawnThisIteration
        ? part.text.trimStart()
        : part.text;

      elementsArray.push(
        <WordToken
          key={`${keyPrefix}-part-${index}`}
          part={part}
          isFinalStyling={isFinalStyling}
          textToRender={textToRender}
          displayedLanguage={
            partLanguage !== previousPartLanguage && displayLanguageTag
              ? partLanguage
              : null
          }
          onNewLine={
            partLanguage !== previousPartLanguage &&
            !displaySpeakerName &&
            Boolean(previousPartLanguage)
          }
        />
      );

      previousPartSpeaker = partSpeaker;
      previousPartLanguage = partLanguage;
    });

    return {
      elements: elementsArray,
      newLastSpeaker: previousPartSpeaker,
      newLastLanguage: previousPartLanguage,
    };
  };

  let content = null;

  if (appError) {
    content = <ErrorMessage error={appError} />;
    // } else if (error) {
    //   content = <ErrorMessage error={error} />;
  } else if (statusMessage) {
    content = <p className="text-gray-500 italic">{statusMessage}</p>;
  } else if (finalParts.length === 0 && nonFinalParts.length === 0 && !error) {
    content = <p className="text-gray-400 italic">No output yet...</p>;
  } else {
    const finalRender = renderParts(
      finalParts,
      true,
      undefined,
      undefined,
      "final"
    );
    let combinedElements: React.ReactNode[] = [...finalRender.elements];

    if (nonFinalParts.length > 0) {
      const nonFinalRender = renderParts(
        nonFinalParts,
        false,
        finalRender.newLastSpeaker,
        finalRender.newLastLanguage,
        "nonfinal"
      );
      combinedElements = [...combinedElements, ...nonFinalRender.elements];
    }
    content = <>{combinedElements}</>;
  }

  return (
    <TooltipProvider delayDuration={300}>
      <AutoScrollContainer className="absolute inset-0 pb-5">
        {content}
      </AutoScrollContainer>
    </TooltipProvider>
  );
};

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

const formatTime = (milliseconds: number): string => {
  if (typeof milliseconds !== "number" || isNaN(milliseconds)) return "";
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  const remainingMs = Math.floor(milliseconds % 1000);
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}.${remainingMs.toString().padStart(3, "0")}`;
};

interface WordTokenProps {
  part: TranscriptPart;
  isFinalStyling: boolean;
  textToRender: string;
  displayedLanguage: string | null;
  onNewLine: boolean;
}

const WordToken = memo(
  ({
    part,
    isFinalStyling,
    textToRender,
    displayedLanguage,
    onNewLine,
  }: WordTokenProps) => {
    // --- 1. Special rendering for <end> tag ---
    if (part.text.trim() === "<end>") {
      return (
        <span
          className={cn(
            "px-2 py-1 text-gray-700 rounded-lg text-[10px] font-semibold tracking-wider",
            isFinalStyling ? "opacity-50" : "opacity-60"
          )}
        >
          {`<end>`}
        </span>
      );
    }

    // --- 2. Regular rendering for words ---
    const titleParts: string[] = [];
    if (part.start_ms !== undefined && part.start_ms !== null)
      titleParts.push(`Start: ${formatTime(part.start_ms)}`);
    if (part.end_ms !== undefined && part.end_ms !== null)
      titleParts.push(`End: ${formatTime(part.end_ms)}`);
    if (part.confidence !== undefined && part.confidence !== null)
      titleParts.push(`Confidence: ${part.confidence.toFixed(2)}`);

    const textClassName = isFinalStyling
      ? "text-gray-800 dark:text-gray-200"
      : "text-gray-500 dark:text-gray-400 italic";

    const languageTag = displayedLanguage ? (
      <>
        {onNewLine && <br />}
        <span className="px-2 mr-0.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 rounded-full text-xs font-medium">
          {new Intl.DisplayNames(["en"], { type: "language" }).of(
            displayedLanguage
          ) || displayedLanguage}
        </span>
      </>
    ) : null;

    return (
      <>
        {languageTag}
        <ResponsiveTooltip
          content={
            titleParts.length > 0 && (
              <div>
                {titleParts.map((info, idx) => (
                  <p key={idx}>{info}</p>
                ))}
              </div>
            )
          }
        >
          <span
            className={cn(textClassName, "hover:text-soniox rounded-lg")}
          >
            {textToRender}
          </span>
        </ResponsiveTooltip>
      </>
    );
  }
);

WordToken.displayName = "WordToken";
