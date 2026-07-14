import { cn } from "@/lib/utils";
import {
  barCountForWidth,
  computeBarBinRanges,
  computeBars,
  drawBars,
} from "@/lib/audio-analysis";
import { useEffect, useRef } from "react";

type Props = {
  getAnalyser: () => AnalyserNode | null;
  active: boolean;
  height?: number;
  className?: string;
};

export const FrequencyBars = ({
  getAnalyser,
  active,
  height = 84,
  className,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barsRef = useRef<number[]>([]);
  const targetBarsRef = useRef<number[]>([]);
  const frequenciesRef = useRef<Uint8Array<ArrayBuffer>>(new Uint8Array(0));
  const binRangesRef = useRef<Array<[number, number]> | null>(null);
  const numBarsRef = useRef(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const activeRef = useRef(active);

  activeRef.current = active;

  useEffect(() => {
    let animationId = 0;

    const draw = () => {
      animationId = requestAnimationFrame(draw);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const cssWidth = canvas.parentElement?.clientWidth ?? canvas.offsetWidth;
      if (cssWidth === 0) return;

      const numBars = barCountForWidth(cssWidth);
      if (numBars !== numBarsRef.current) {
        numBarsRef.current = numBars;
        barsRef.current = new Array(numBars).fill(0);
        targetBarsRef.current = new Array(numBars).fill(0);
        binRangesRef.current = null;
      }

      const analyser = getAnalyser();
      if (analyser && analyser !== analyserRef.current) {
        analyserRef.current = analyser;
        frequenciesRef.current = new Uint8Array(analyser.frequencyBinCount);
        binRangesRef.current = null;
      }

      if (analyser && !binRangesRef.current) {
        binRangesRef.current = computeBarBinRanges(
          numBars,
          analyser.fftSize,
          analyser.context.sampleRate,
        );
      }

      if (activeRef.current && analyser && binRangesRef.current) {
        analyser.getByteFrequencyData(frequenciesRef.current);
        const levels = computeBars(
          frequenciesRef.current,
          binRangesRef.current,
        );
        for (let i = 0; i < numBars; i++) {
          if (levels[i] > targetBarsRef.current[i]) {
            targetBarsRef.current[i] = levels[i];
          }
        }
      }

      const dpr = window.devicePixelRatio || 1;
      if (
        canvas.width !== Math.round(cssWidth * dpr) ||
        canvas.height !== Math.round(height * dpr)
      ) {
        canvas.width = Math.round(cssWidth * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.scale(dpr, dpr);
      }

      drawBars(
        ctx,
        barsRef.current,
        targetBarsRef.current,
        cssWidth,
        height,
        getComputedStyle(canvas).color,
      );
    };

    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [getAnalyser, height]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("block w-full", className)}
      style={{ height }}
    />
  );
};
