import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface AutoScrollContainerProps
  extends React.ComponentPropsWithoutRef<"div"> {
  className?: string;
}

/**
 * A reusable scroll container that automatically handles scrolling and
 * provides a "Scroll to Bottom" button when the user scrolls up.
 */
export const AutoScrollContainer = ({
  className,
  children,
  ...props
}: AutoScrollContainerProps) => {
  const { containerRef, contentRef, scrollToBottom, isScrolledToBottom } =
    useAutoScroll();

  return (
    <div className="relative h-full w-full">
      <div
        ref={containerRef}
        className={cn("overflow-y-auto", className)}
        {...props}
      >
        <div
          ref={contentRef}
          className="p-4 gap-y-3 leading-relaxed whitespace-pre-wrap break-words"
        >
          {children}
        </div>
      </div>

      {!isScrolledToBottom && (
        <button
          className="absolute bottom-4 cursor-pointer right-4 rounded-full bg-zinc-500/30 p-2 text-white shadow-md transition hover:bg-zinc-600/80"
          onClick={scrollToBottom}
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

/**
 * Hook to handle automatic scrolling with user override and resize detection.
 */
export function useAutoScroll({ scrolledToBottomThreshold = 50 } = {}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Distinguishes programmatic scrolls from user scrolls, so our own
  // scrollToBottom can't be mistaken for the user opting out of auto-scroll.
  const programmaticScrollRef = useRef(false);
  // Last known scroll height, to detect the content being cleared.
  const lastScrollHeightRef = useRef(0);

  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      programmaticScrollRef.current = true;
      setShouldAutoScroll(true);
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const atBottom =
        scrollHeight - scrollTop <= clientHeight + scrolledToBottomThreshold;

      setIsScrolledToBottom(atBottom);

      // A programmatic scroll must not disable auto-scroll; only a user
      // scrolling away from the bottom opts out.
      if (programmaticScrollRef.current) {
        if (atBottom) {
          programmaticScrollRef.current = false;
        }
        return;
      }

      setShouldAutoScroll(atBottom);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [scrolledToBottomThreshold]);

  // Follow content growth (new messages) and recover from content clears.
  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const observer = new ResizeObserver(() => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const atBottom =
        scrollHeight - scrollTop <= clientHeight + scrolledToBottomThreshold;

      // A shrinking height means the content was cleared; re-enable
      // auto-scroll so the next session's messages are followed again.
      if (scrollHeight < lastScrollHeightRef.current) {
        setShouldAutoScroll(true);
      }

      setIsScrolledToBottom(atBottom);

      if (shouldAutoScroll) {
        scrollToBottom();
      }

      lastScrollHeightRef.current = scrollHeight;
    });

    observer.observe(content);
    return () => observer.disconnect();
  }, [shouldAutoScroll, scrollToBottom, scrolledToBottomThreshold]);

  return {
    containerRef,
    contentRef,
    scrollToBottom,
    isScrolledToBottom,
  };
}
