import React from "react";
import { useComparison } from "@/contexts/comparison-context";
import { type ProviderName } from "@/lib/provider-features";
import {
  formatEstimatedCost,
  formatPricePerHour,
  getProviderPricing,
  type ProviderPricing,
} from "@/lib/provider-pricing";
import { cn } from "@/lib/utils";
import { ResponsiveTooltip } from "./ui/responsive-tooltip";

// How often the live cost re-computes while a session is recording.
const TICK_MS = 250;

interface ProviderCostProps {
  provider: ProviderName;
  providerName: string;
  // Suppress the hover tooltip while the card is being dragged.
  disableTooltip?: boolean;
}

export const ProviderCost: React.FC<ProviderCostProps> = ({
  provider,
  providerName,
  disableTooltip = false,
}) => {
  const { providerTimings, recordingState } = useComparison();
  const pricing = getProviderPricing(provider);
  const timing = providerTimings[provider];

  // The meter only runs live while audio is streaming. Once we leave the
  // "recording" state the cost freezes to the first-token -> last-token window,
  // which keeps the estimate honest (drain-time finals still extend lastTokenAt).
  const isLive = recordingState === "recording";
  const firstTokenAt = timing?.firstTokenAt ?? null;
  const lastTokenAt = timing?.lastTokenAt ?? null;

  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    if (!isLive || firstTokenAt === null) return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), TICK_MS);
    return () => window.clearInterval(id);
  }, [isLive, firstTokenAt]);

  const activeMs =
    firstTokenAt === null
      ? 0
      : Math.max(0, (isLive ? now : lastTokenAt ?? firstTokenAt) - firstTokenAt);

  const cost = pricing ? (activeMs / 3600000) * pricing.pricePerHour : 0;

  const costLabel = `~${formatEstimatedCost(cost)}`;
  const priceLabel = pricing
    ? formatPricePerHour(pricing.pricePerHour)
    : "n/a";

  // Swallow pointer-down so dragging cannot be initiated from the price area and
  // hovering the price can't fight with the card's drag handle.
  const priceBlock = (
    <div
      onPointerDown={(e) => e.stopPropagation()}
      className={cn(
        "flex flex-col items-end shrink-0 text-right",
        pricing && !disableTooltip && "cursor-help"
      )}
    >
      <span className="text-sm font-semibold tabular-nums leading-tight text-zinc-500 dark:text-zinc-400">
        {costLabel}
      </span>
      <span className="text-[10px] font-medium tabular-nums leading-tight text-zinc-400 dark:text-zinc-500">
        {priceLabel}
      </span>
    </div>
  );

  if (!pricing || disableTooltip) {
    return priceBlock;
  }

  return (
    <ResponsiveTooltip
      content={
        <PricingTooltip providerName={providerName} pricing={pricing} />
      }
      contentClassName="bg-white text-zinc-800 border border-zinc-200 shadow-md rounded-lg px-3 py-2.5 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700"
      arrowClassName="bg-white fill-white border-b border-r border-zinc-200 dark:bg-zinc-900 dark:fill-zinc-900 dark:border-zinc-700"
    >
      {priceBlock}
    </ResponsiveTooltip>
  );
};

interface PricingTooltipProps {
  providerName: string;
  pricing: ProviderPricing;
}

const PricingTooltip: React.FC<PricingTooltipProps> = ({
  providerName,
  pricing,
}) => (
  <div className="flex max-w-[240px] flex-col gap-1.5 py-0.5 text-left">
    <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
      Estimated cost
    </p>
    <p className="text-xs font-medium capitalize text-zinc-700 dark:text-zinc-200">
      {providerName} · {formatPricePerHour(pricing.pricePerHour)}
    </p>
    {pricing.tooltip.description && (
      <p className="text-[11px] leading-snug text-zinc-500 dark:text-zinc-400">
        {pricing.tooltip.description}
      </p>
    )}
    <p className="text-[10px] leading-snug text-zinc-400 dark:text-zinc-500">
      Total is approximated based on the active transcription window. Updated {pricing.tooltip.updatedAt}.
    </p>
  </div>
);
