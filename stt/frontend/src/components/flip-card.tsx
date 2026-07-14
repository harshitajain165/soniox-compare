import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Props = {
  flipped: boolean;
  front: ReactNode;
  back: ReactNode;
  prefersReducedMotion: boolean;
  className?: string;
};

export const FlipCard = ({
  flipped,
  front,
  back,
  prefersReducedMotion,
  className,
}: Props) => {
  // Reduced motion: skip the 3D flip, just swap the faces.
  if (prefersReducedMotion) {
    return (
      <div className={cn("h-full min-h-0", className)}>
        {flipped ? back : front}
      </div>
    );
  }

  return (
    <div
      className={cn("h-full min-h-0", className)}
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
      >
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
            // The away-facing side still intercepts touches on some mobile
            // browsers, which blocked the picker's close button.
            pointerEvents: flipped ? "none" : "auto",
          }}
        >
          {front}
        </div>
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            pointerEvents: flipped ? "auto" : "none",
          }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
};
