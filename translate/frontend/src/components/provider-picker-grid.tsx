import { Check } from "lucide-react";
import { motion } from "motion/react";
import type { ProviderFeatures } from "@/contexts/feature-context";
import { type ProviderName } from "@/lib/provider-features";
import { cn } from "@/lib/utils";
import { ProviderLogo } from "./provider-logo";
import { ResponsiveTooltip } from "./ui/responsive-tooltip";

type Props = {
  providers: ProviderName[];
  providerFeatures: ProviderFeatures | null;
  onPick: (provider: ProviderName) => void;
  prefersReducedMotion: boolean;
  columns: 1 | 2;
  /**
   * The provider already in use, when the list doubles as a dropdown. It stays
   * clickable (picking it is a no-op) and carries a check.
   */
  selectedProvider?: ProviderName;
  /**
   * Providers that can't run in the current mode, mapped to why. They stay
   * visible but unclickable, so the absence is explained rather than mysterious.
   */
  disabledReasons?: Partial<Record<ProviderName, string>>;
};

export const ProviderPickerGrid = ({
  providers,
  providerFeatures,
  onPick,
  prefersReducedMotion,
  columns,
  selectedProvider,
  disabledReasons = {},
}: Props) => (
  <div
    className={cn("grid gap-2", columns === 2 ? "grid-cols-2" : "grid-cols-1")}
  >
    {providers.map((provider) => {
      const name = providerFeatures?.[provider]?.name ?? provider;
      const model = providerFeatures?.[provider]?.model;
      const reason = disabledReasons[provider];
      const disabled = reason !== undefined;
      const selected = provider === selectedProvider;

      const tile = (
        <motion.button
          key={provider}
          type="button"
          onClick={() => !disabled && onPick(provider)}
          disabled={disabled}
          whileHover={prefersReducedMotion || disabled ? undefined : { scale: 0.96 }}
          whileTap={prefersReducedMotion || disabled ? undefined : { scale: 0.92 }}
          transition={{ type: "spring", stiffness: 500, damping: 18 }}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-lg border border-zinc-200 bg-white p-2 text-left transition-colors dark:border-zinc-700 dark:bg-zinc-800",
            disabled
              ? "cursor-not-allowed opacity-40 grayscale"
              : "cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700/70"
          )}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
            <ProviderLogo provider={provider} name={name} />
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold capitalize leading-tight text-zinc-800 dark:text-zinc-100">
              {name}
            </span>
            {model && (
              <span className="truncate text-[10px] lowercase leading-tight text-zinc-400">
                {model}
              </span>
            )}
          </span>
          {selected && (
            <Check className="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
          )}
        </motion.button>
      );

      if (!disabled) return tile;

      return (
        // The button is disabled, so it can't be the tooltip's hover target.
        <ResponsiveTooltip key={provider} content={reason}>
          <span className="block cursor-not-allowed">{tile}</span>
        </ResponsiveTooltip>
      );
    })}
  </div>
);
