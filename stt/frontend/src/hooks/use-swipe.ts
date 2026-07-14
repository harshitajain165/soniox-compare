import { useRef } from "react";
import type { TouchEvent } from "react";

interface SwipeInput {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  filter?: (e: TouchEvent) => boolean;
}

interface SwipeOutput {
  onTouchStart: (e: TouchEvent) => void;
  onTouchMove: (e: TouchEvent) => void;
  onTouchEnd: () => void;
}

const MIN_SWIPE_DISTANCE = 10;

export const useSwipe = (input: SwipeInput): SwipeOutput => {
  const touchStartCoords = useRef<{ x: number; y: number } | null>(null);
  const touchEndCoords = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = (e: TouchEvent) => {
    if (input.filter && !input.filter(e)) {
      touchStartCoords.current = null;
      return;
    }
    touchEndCoords.current = null;
    touchStartCoords.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!touchStartCoords.current) return;
    touchEndCoords.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  };

  const onTouchEnd = () => {
    if (!touchStartCoords.current || !touchEndCoords.current) {
      return;
    }

    const distanceX = touchStartCoords.current.x - touchEndCoords.current.x;
    const distanceY = touchStartCoords.current.y - touchEndCoords.current.y;

    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

    if (isHorizontalSwipe) {
      if (distanceX > MIN_SWIPE_DISTANCE && input.onSwipeLeft) {
        input.onSwipeLeft();
      } else if (distanceX < -MIN_SWIPE_DISTANCE && input.onSwipeRight) {
        input.onSwipeRight();
      }
    } else {
      if (distanceY > MIN_SWIPE_DISTANCE && input.onSwipeUp) {
        input.onSwipeUp();
      } else if (distanceY < -MIN_SWIPE_DISTANCE && input.onSwipeDown) {
        input.onSwipeDown();
      }
    }

    touchStartCoords.current = null;
    touchEndCoords.current = null;
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};
