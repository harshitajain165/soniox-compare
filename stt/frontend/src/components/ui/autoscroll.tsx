import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface AutoScrollContainerProps
  extends React.ComponentPropsWithoutRef<"div"> {
  className?: string;
  followKey?: unknown;
}

/**
 * A reusable scroll container that automatically handles scrolling and
 * provides a "Scroll to Bottom" button when the user scrolls up.
 */
export const AutoScrollContainer = ({
  className,
  children,
  followKey,
  ...props
}: AutoScrollContainerProps) => {
  const { containerRef, contentRef, scrollToBottom, isScrolledToBottom } =
    useAutoScroll({ followKey });

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

      {/* Scroll to Bottom Button */}
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

export function useAutoScroll({
  scrolledToBottomThreshold = 50,
  // When set, the content is followed as this value changes rather than on any
  // growth in content height. Pass it when the content can also grow from user
  // interaction (e.g. expanding a collapsed row), which must not move the
  // viewport.
  followKey,
}: { scrolledToBottomThreshold?: number; followKey?: unknown } = {}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Ref to track if a scroll is programmatic (our code) vs user-initiated
  const programmaticScrollRef = useRef(false);
  // Ref to track the last known scroll height to detect when content is cleared
  const lastScrollHeightRef = useRef(0);

  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      programmaticScrollRef.current = true;
      setShouldAutoScroll(true); // Ensure auto-scroll is enabled when this is called
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  // Effect for handling manual scroll events by the user
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const atBottom =
        scrollHeight - scrollTop <= clientHeight + scrolledToBottomThreshold;

      // Always keep the button visibility updated
      setIsScrolledToBottom(atBottom);

      // If the scroll was initiated by our code, don't let it disable auto-scroll
      if (programmaticScrollRef.current) {
        if (atBottom) {
          programmaticScrollRef.current = false;
        }
        return;
      }

      // If it was a user scroll, update the auto-scroll preference
      setShouldAutoScroll(atBottom);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [scrolledToBottomThreshold]);

  const followsContent = followKey === undefined;

  // Effect for observing content size changes (new messages, content clears)
  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const observer = new ResizeObserver(() => {
      // Get current dimensions
      const { scrollTop, scrollHeight, clientHeight } = container;
      const atBottom =
        scrollHeight - scrollTop <= clientHeight + scrolledToBottomThreshold;

      // 1. Detect if content has been cleared. Only a shrink back to something
      //    that fits counts: content that shrinks but still overflows was
      //    reflowed rather than cleared, and hijacking the user's scroll
      //    position for that would fight them.
      const contentCleared =
        scrollHeight < lastScrollHeightRef.current &&
        scrollHeight <= clientHeight;
      if (contentCleared) {
        // If content was cleared, we must re-enable auto-scroll for subsequent messages
        setShouldAutoScroll(true);
      }

      // 2. Always keep the button visibility in sync with the actual scroll position
      setIsScrolledToBottom(atBottom);

      // 3. If auto-scroll is enabled, perform the scroll
      if (followsContent && shouldAutoScroll) {
        scrollToBottom();
      }

      // 4. Update the last known height
      lastScrollHeightRef.current = scrollHeight;
    });

    observer.observe(content);
    return () => observer.disconnect();
  }, [
    followsContent,
    shouldAutoScroll,
    scrollToBottom,
    scrolledToBottomThreshold,
  ]);

  // Read through a ref by the effect below, which must run when `followKey`
  // changes and at no other time.
  const shouldAutoScrollRef = useRef(shouldAutoScroll);
  useEffect(() => {
    shouldAutoScrollRef.current = shouldAutoScroll;
  }, [shouldAutoScroll]);

  // Effect for following explicit updates (e.g. a new message) when the caller
  // opted out of following content height.
  useEffect(() => {
    if (followKey === undefined) return;
    if (shouldAutoScrollRef.current) {
      scrollToBottom();
    }
  }, [followKey, scrollToBottom]);

  return {
    containerRef,
    contentRef,
    scrollToBottom,
    isScrolledToBottom,
  };
}
