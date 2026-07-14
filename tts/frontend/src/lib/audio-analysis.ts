export const BAR_DECAY = 0.97;
export const BAR_ATTACK = 0.18;

// Bars are hairline-thin and packed edge to edge, so the count follows the
// available width rather than being fixed.
export const BAR_PITCH_PX = 3.3;
export const MAX_BARS = 300;
export const MIN_BARS = 8;

export function barCountForWidth(width: number): number {
  const count = Math.round(width / BAR_PITCH_PX);
  return Math.max(MIN_BARS, Math.min(MAX_BARS, count));
}

export const FFT_SIZE = 1024;
export const SMOOTHING = 0.6;
// Speech sits well inside this window; a tighter range keeps the bars lively
// instead of pinning them near the floor.
export const MIN_DECIBELS = -75;
export const MAX_DECIBELS = -20;

// Bars are spaced logarithmically so low frequencies, where speech carries most
// of its energy, don't collapse into a single bar.
export function computeBarBinRanges(
  numBars: number,
  fftSize: number,
  sampleRate: number
): Array<[number, number]> {
  const binCount = fftSize / 2;
  const freqPerBin = sampleRate / fftSize;
  const logMin = Math.log(60);
  const logMax = Math.log(Math.min(6000, sampleRate / 2));

  const ranges: Array<[number, number]> = [];
  for (let bar = 0; bar < numBars; bar++) {
    const freqLo = Math.exp(logMin + (bar / numBars) * (logMax - logMin));
    const freqHi = Math.exp(logMin + ((bar + 1) / numBars) * (logMax - logMin));
    const binLo = Math.max(1, Math.round(freqLo / freqPerBin));
    const binHi = Math.min(binCount - 1, Math.round(freqHi / freqPerBin));
    ranges.push([binLo, Math.max(binLo, binHi)]);
  }
  return ranges;
}

export function computeBars(
  frequencies: Uint8Array,
  barBinRanges: Array<[number, number]>
): number[] {
  return barBinRanges.map(([lo, hi]) => {
    let sum = 0;
    for (let bin = lo; bin <= hi; bin++) sum += frequencies[bin];
    return sum / (hi - lo + 1) / 255;
  });
}

export function drawBars(
  ctx: CanvasRenderingContext2D,
  bars: number[],
  targetBars: number[],
  width: number,
  height: number,
  color: string
): void {
  ctx.clearRect(0, 0, width, height);

  const numBars = bars.length;
  const barWidth = width / numBars;
  const gap = Math.max(1, barWidth * 0.15);
  const centerY = height / 2;

  // Bars snap up to a new peak, then bleed back down, so a bar that spikes for
  // one frame stays readable for several.
  for (let i = 0; i < numBars; i++) {
    targetBars[i] *= BAR_DECAY;
    bars[i] += (targetBars[i] - bars[i]) * BAR_ATTACK;
  }

  // Blend each bar with its neighbours so the row reads as one waveform.
  const smoothed = bars.map((value, i) => {
    const prev = bars[Math.max(i - 1, 0)];
    const next = bars[Math.min(i + 1, numBars - 1)];
    return value * 0.6 + prev * 0.2 + next * 0.2;
  });

  ctx.fillStyle = color;
  for (let i = 0; i < numBars; i++) {
    const half = Math.max(smoothed[i] * height * 0.5, 1);
    const x = i * barWidth + gap / 2;
    const w = barWidth - gap;
    ctx.beginPath();
    ctx.roundRect(x, centerY - half, w, half * 2, 2);
    ctx.fill();
  }
}
