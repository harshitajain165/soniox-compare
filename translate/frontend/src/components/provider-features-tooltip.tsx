import { Check, Minus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  FeatureListItem,
  FeatureState,
} from "@/contexts/feature-context";

const STATE_ICON: Record<FeatureState, typeof Check> = {
  SUPPORTED: Check,
  UNSUPPORTED: X,
  PARTIAL: Minus,
};

interface ProviderFeaturesTooltipProps {
  features: FeatureListItem[];
}

export const ProviderFeaturesTooltip = ({
  features,
}: ProviderFeaturesTooltipProps) => {
  if (features.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2.5 py-0.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
        Features
      </p>
      <ul className="flex flex-col gap-2">
        {features.map(({ key, label, state, comment }) => {
          const Icon = STATE_ICON[state];
          const unsupported = state === "UNSUPPORTED";
          return (
            <li key={key} className="flex items-start gap-2.5">
              <Icon
                className={cn(
                  "mt-px h-3.5 w-3.5 shrink-0",
                  unsupported
                    ? "text-zinc-300 dark:text-zinc-600"
                    : "text-zinc-600 dark:text-zinc-300"
                )}
                strokeWidth={2.5}
              />
              <div className="flex min-w-0 flex-col leading-tight">
                <span
                  className={cn(
                    "text-xs font-medium",
                    unsupported
                      ? "text-zinc-400 dark:text-zinc-500"
                      : "text-zinc-700 dark:text-zinc-200"
                  )}
                >
                  {label}
                </span>
                {comment && (
                  <span className="text-[10px] leading-snug text-zinc-400 dark:text-zinc-500">
                    {comment}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
