import { motion } from "motion/react";
import type { ProviderFeatures } from "@/contexts/feature-context";
import { type ProviderName } from "@/lib/provider-features";
import { cn } from "@/lib/utils";
import { ProviderLogo } from "./provider-logo";

type Props = {
  providers: ProviderName[];
  providerFeatures: ProviderFeatures | null;
  onPick: (provider: ProviderName) => void;
  prefersReducedMotion: boolean;
  columns: 1 | 2;
};

export const ProviderPickerGrid = ({
  providers,
  providerFeatures,
  onPick,
  prefersReducedMotion,
  columns,
}: Props) => (
  <div
    className={cn("grid gap-2", columns === 2 ? "grid-cols-2" : "grid-cols-1")}
  >
    {providers.map((provider) => {
      const name = providerFeatures?.[provider]?.name ?? provider;
      const model = providerFeatures?.[provider]?.model;
      return (
        <motion.button
          key={provider}
          type="button"
          onClick={() => onPick(provider)}
          whileHover={prefersReducedMotion ? undefined : { scale: 0.96 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
          transition={{ type: "spring", stiffness: 500, damping: 18 }}
          className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-zinc-200 bg-white p-2 text-left transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700/70"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
            <ProviderLogo provider={provider} name={name} />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold capitalize leading-tight text-zinc-800 dark:text-zinc-100">
              {name}
            </span>
            {model && (
              <span className="truncate text-[10px] lowercase leading-tight text-zinc-400">
                {model}
              </span>
            )}
          </span>
        </motion.button>
      );
    })}
  </div>
);
