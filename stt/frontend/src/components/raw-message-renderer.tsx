import { memo, useCallback, useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";

import type { RawProviderMessage } from "@/contexts/comparison-context";
import { cn } from "@/lib/utils";
import { AutoScrollContainer } from "./ui/autoscroll";
import { ErrorMessage } from "./transcript-renderer";

hljs.registerLanguage("json", json);

// A collapsed row shows the head of the message, so there is no point scanning
// (or collapsing the whitespace of) a payload far longer than fits on one line.
const PREVIEW_LENGTH = 300;

type Props = {
  messages: RawProviderMessage[];
  statusMessage?: string;
  appError?: string | null;
};

/**
 * The raw counterpart to `TranscriptRenderer`: every message the provider sent,
 * in arrival order, with none of the merging the transcript view does. Rows
 * collapse the payload's whitespace to fit one line and expand to it formatted;
 * the message itself is never parsed for meaning, only for display.
 */
export const RawMessageRenderer = ({
  messages,
  statusMessage,
  appError,
}: Props) => {
  // Keyed by `seq` rather than position: the buffer drops its oldest messages
  // once it is full, which would otherwise move expansion onto another row.
  const [expanded, setExpanded] = useState<ReadonlySet<number>>(new Set());

  const toggle = useCallback((seq: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (!next.delete(seq)) {
        next.add(seq);
      }
      return next;
    });
  }, []);

  let content = null;

  if (appError) {
    content = <ErrorMessage error={appError} />;
  } else if (messages.length === 0) {
    content = (
      <p className="text-gray-400 italic">
        {statusMessage || "No messages yet..."}
      </p>
    );
  } else {
    const firstAt = messages[0].at;
    content = (
      <div className="flex flex-col">
        {messages.map((message, index) => (
          <RawMessageRow
            key={message.seq}
            message={message}
            index={index}
            offsetMs={message.at - firstAt}
            expanded={expanded.has(message.seq)}
            onToggle={toggle}
          />
        ))}
      </div>
    );
  }

  return (
    // Followed per message rather than by height: expanding a row grows the
    // content too, and that must leave the viewport where the user put it.
    <AutoScrollContainer
      className="absolute inset-0 pb-5"
      followKey={messages.length}
    >
      {content}
    </AutoScrollContainer>
  );
};

const formatOffset = (milliseconds: number): string =>
  `+${(milliseconds / 1000).toFixed(2)}s`;

const formatClock = (epochMs: number): string => {
  const at = new Date(epochMs);
  const time = at.toTimeString().slice(0, 8);
  return `${time}.${at.getMilliseconds().toString().padStart(3, "0")}`;
};

type RawMessageRowProps = {
  message: RawProviderMessage;
  index: number;
  offsetMs: number;
  expanded: boolean;
  onToggle: (seq: number) => void;
};

const RawMessageRow = memo(
  ({ message, index, offsetMs, expanded, onToggle }: RawMessageRowProps) => {
    const preview = message.data
      .slice(0, PREVIEW_LENGTH)
      .replace(/\s+/g, " ")
      .trim();

    return (
      <div className="border-b border-gray-100 last:border-b-0 dark:border-gray-800">
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => onToggle(message.seq)}
          className={cn(
            "flex h-6 w-full cursor-pointer items-center gap-1.5 px-0.5 text-[10px] transition-colors",
            "text-gray-400 hover:bg-black/5 dark:text-gray-500 dark:hover:bg-white/5",
            expanded && "bg-black/5 dark:bg-white/5"
          )}
        >
          <span className="min-w-[1.5ch] shrink-0 text-right tabular-nums">
            {index + 1}
          </span>
          <span className="shrink-0 tabular-nums">
            {formatOffset(offsetMs)}
          </span>
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-left font-mono text-[11px]",
              expanded
                ? "text-gray-400 dark:text-gray-600"
                : "text-gray-600 dark:text-gray-400"
            )}
          >
            {preview}
          </span>
          <span className="shrink-0 tabular-nums">
            {formatClock(message.at)}
          </span>
          <ChevronRight
            className={cn(
              "size-3 shrink-0 transition-transform",
              expanded && "rotate-90"
            )}
          />
        </button>
        {expanded && (
          <RawMessageBody data={message.data} verbatim={message.verbatim} />
        )}
      </div>
    );
  }
);

RawMessageRow.displayName = "RawMessageRow";

const RawMessageBody = ({
  data,
  verbatim,
}: {
  data: string;
  verbatim: boolean;
}) => {
  // Only JSON payloads can be formatted; anything else (an SDK repr, a plain
  // error string) is shown exactly as it arrived.
  const highlighted = useMemo(() => {
    try {
      const formatted = JSON.stringify(JSON.parse(data), null, 2);
      return hljs.highlight(formatted, { language: "json" }).value;
    } catch {
      return null;
    }
  }, [data]);

  return (
    <div className="my-1">
      <pre
        className={cn(
          "rounded-md bg-black/5 p-2 font-mono text-[11px] leading-snug dark:bg-white/5",
          "whitespace-pre-wrap wrap-anywhere text-gray-700 dark:text-gray-300",
          "[&_.hljs-attr]:text-sky-700 dark:[&_.hljs-attr]:text-sky-400",
          "[&_.hljs-string]:text-emerald-700 dark:[&_.hljs-string]:text-emerald-400",
          "[&_.hljs-number]:text-amber-700 dark:[&_.hljs-number]:text-amber-400",
          "[&_.hljs-literal]:text-purple-700 dark:[&_.hljs-literal]:text-purple-400",
          "[&_.hljs-punctuation]:text-gray-400 dark:[&_.hljs-punctuation]:text-gray-600"
        )}
      >
        {highlighted === null ? (
          data
        ) : (
          <code dangerouslySetInnerHTML={{ __html: highlighted }} />
        )}
      </pre>
      {!verbatim && (
        <p className="px-2 pt-1 text-[10px] text-gray-400 dark:text-gray-600">
          This provider only exposes messages through its SDK, which parses them
          before we see them. Rebuilt from the parsed event, so field order and
          absent fields may differ from the message on the wire.
        </p>
      )}
    </div>
  );
};
