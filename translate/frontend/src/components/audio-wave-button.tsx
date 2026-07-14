import React, { useRef, useEffect, forwardRef } from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { useComparison } from "@/contexts/comparison-context";

// Wave shape: base height (px), horizontal speed, and curve tightness.
const BASE_AMPLITUDE = 8;
const BASE_SPEED = 0.01;
const BASE_FREQUENCY = 0.02;

// How strongly overall volume drives wave height and bass drives wave speed.
const AMPLITUDE_SENSITIVITY = 10;
const SPEED_SENSITIVITY = 0.04;

// 0..1; higher = smoother, less jittery reaction to the audio.
const SMOOTHING_FACTOR = 0.95;

// Each wave layers the base values with its own offsets.
const WAVE_DEFINITIONS = [
  {
    color: "rgba(0,0,0, 0.3)",
    timeOffset: 0,
    amplitudeOffset: 5,
    speedOffset: -0.005,
    frequencyOffset: 0.001,
  },
  {
    color: "rgba(0,0,0, 0.15)",
    timeOffset: 2,
    amplitudeOffset: 0,
    speedOffset: 0,
    frequencyOffset: 0.002,
  },
  {
    color: "rgba(0,0,0, 0.05)",
    timeOffset: 4,
    amplitudeOffset: -5,
    speedOffset: 0.005,
    frequencyOffset: -0.001,
  },
];

export interface AudioWaveButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  enableAnimation?: boolean;
  children: React.ReactNode;
}

/**
 * A button that displays an animated, artistic audio waveform on its background
 * when recording is active. The animation is a fluid, multi-layered sine wave
 * whose amplitude and speed are driven by the user's audio input.
 */
export const AudioWaveButton = forwardRef<
  HTMLButtonElement,
  AudioWaveButtonProps
>(({ className, enableAnimation = true, children, ...props }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { analyserRef, recordingState } = useComparison();
  const animationFrameId = useRef<number>(0);

  const wavesRef = useRef(
    WAVE_DEFINITIONS.map((wave) => ({
      color: wave.color,
      time: wave.timeOffset,
      baseAmplitude: BASE_AMPLITUDE + wave.amplitudeOffset,
      baseSpeed: BASE_SPEED + wave.speedOffset,
      frequency: BASE_FREQUENCY + wave.frequencyOffset,
      amplitudeVariation: AMPLITUDE_SENSITIVITY,
      speedVariation: SPEED_SENSITIVITY,
    }))
  );

  const smoothedLoudnessRef = useRef(0);
  const smoothedBassRef = useRef(0);
  const isPlaying = recordingState === "recording";

  useEffect(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const renderWave = () => {
      animationFrameId.current = requestAnimationFrame(renderWave);
      analyser.getByteFrequencyData(dataArray);

      const totalLoudness = dataArray.reduce((sum, value) => sum + value, 0);
      const averageLoudness = totalLoudness / bufferLength;

      const bassSlice = dataArray.slice(0, Math.floor(bufferLength * 0.2));
      const totalBass = bassSlice.reduce((sum, value) => sum + value, 0);
      const averageBass = totalBass / bassSlice.length || 0;

      smoothedLoudnessRef.current =
        smoothedLoudnessRef.current * SMOOTHING_FACTOR +
        averageLoudness * (1 - SMOOTHING_FACTOR);
      smoothedBassRef.current =
        smoothedBassRef.current * SMOOTHING_FACTOR +
        averageBass * (1 - SMOOTHING_FACTOR);

      context.clearRect(0, 0, canvas.width, canvas.height);
      const centerY = canvas.height / 2;

      wavesRef.current.forEach((wave) => {
        context.fillStyle = wave.color;
        context.beginPath();
        // Trace the sine along the top, then close along the bottom edge so
        // the fill reaches the bottom of the button.
        context.moveTo(0, canvas.height);

        const loudnessFactor = smoothedLoudnessRef.current / 128.0;
        const bassFactor = smoothedBassRef.current / 128.0;
        const currentAmplitude =
          wave.baseAmplitude + wave.amplitudeVariation * loudnessFactor;
        const currentSpeed = wave.baseSpeed + wave.speedVariation * bassFactor;
        wave.time += currentSpeed;

        for (let x = 0; x <= canvas.width; x++) {
          const y =
            centerY +
            currentAmplitude * Math.sin(x * wave.frequency + wave.time);
          context.lineTo(x, y);
        }

        context.lineTo(canvas.width, canvas.height);
        context.closePath();
        context.fill();
      });
    };

    const resizeCanvas = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        const parent = canvasRef.current.parentElement;
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    const resizeObserver = new ResizeObserver(resizeCanvas);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    resizeCanvas();

    if (isPlaying) {
      renderWave();
    } else {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      resizeObserver.disconnect();
    };
  }, [isPlaying, analyserRef]);

  return (
    <Button
      className={cn(
        "relative overflow-hidden group transition-colors duration-300",
        "bg-soniox text-white",
        !isPlaying && "hover:bg-gray-800",
        isPlaying && "hover:bg-red-500",
        className
      )}
      ref={ref}
      {...props}
    >
      {enableAnimation && (
        <canvas
          ref={canvasRef}
          className={cn(
            "absolute inset-0 w-full h-full transition-opacity duration-500",
            isPlaying ? "opacity-100" : "opacity-0"
          )}
        />
      )}
      <span className="relative z-10 transition-transform duration-200 group-hover:scale-105">
        {children}
      </span>
    </Button>
  );
});

AudioWaveButton.displayName = "AudioWaveButton";
