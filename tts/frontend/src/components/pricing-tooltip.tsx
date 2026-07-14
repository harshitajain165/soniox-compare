import {
  formatCharPrice,
  formatPricePerHour,
  formatTokenPrice,
  type ProviderPricing,
} from "@/lib/provider-pricing";

type Props = {
  providerName: string;
  pricing: ProviderPricing;
};

export const PricingTooltip = ({ providerName, pricing }: Props) => (
  <div className="flex max-w-[240px] flex-col gap-1.5 py-0.5 text-left">
    <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
      Estimated cost
    </p>
    <p className="text-xs font-medium capitalize text-zinc-700 dark:text-zinc-200">
      {providerName} · {formatPricePerHour(pricing.pricePerHour)}
    </p>
    <div className="flex flex-col gap-0.5 text-[11px] leading-snug text-zinc-600 dark:text-zinc-300">
      {pricing.billing === "characters" ? (
        <p>
          Input text · {formatCharPrice(pricing.pricePerThousandChars)} per 1K
          characters
        </p>
      ) : (
        <>
          <p>
            Input text · {formatTokenPrice(pricing.inputPrice)} per 1M tokens
          </p>
          <p>
            Output audio · {formatTokenPrice(pricing.outputPrice)} per 1M tokens
          </p>
        </>
      )}
    </div>
    {pricing.tooltip.description && (
      <p className="text-[11px] leading-snug text-zinc-500 dark:text-zinc-400">
        {pricing.tooltip.description}
      </p>
    )}
    <p className="text-[10px] leading-snug text-zinc-400 dark:text-zinc-500">
      Total is approximated from the duration of the generated audio. Updated{" "}
      {pricing.tooltip.updatedAt}.
    </p>
  </div>
);
