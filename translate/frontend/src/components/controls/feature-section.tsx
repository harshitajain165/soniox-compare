import { Switch } from "@/components/ui/switch";
import { getProviderIcon, type ProviderName } from "@/lib/provider-features";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  hint?: string;
  providers: ProviderName[];
  getName: (provider: ProviderName) => string;
};

export const FeatureSection = ({
  title,
  description,
  checked,
  onCheckedChange,
  disabled,
  hint,
  providers,
  getName,
}: Props) => {
  return (
    <section
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={checked}
      aria-disabled={disabled}
      onClick={() => !disabled && onCheckedChange(!checked)}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCheckedChange(!checked);
        }
      }}
      className={cn(
        "flex gap-3.5 rounded-xl border p-3 outline-none transition-colors",
        checked
          ? "border-soniox/30 bg-soniox/5 dark:bg-soniox/10"
          : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900",
        disabled
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer focus-visible:ring-2 focus-visible:ring-soniox/40",
        !disabled &&
          !checked &&
          "hover:border-zinc-300 hover:bg-zinc-50 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/60"
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </h3>
          <p className="mt-0.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
          {hint && (
            <p className="mt-1.5 text-xs font-medium text-amber-600 dark:text-amber-500">
              {hint}
            </p>
          )}
          {providers.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-zinc-400">
                Supported by
              </span>
              <span className="flex items-center gap-1">
                {providers.map((provider) => (
                  <span
                    key={provider}
                    title={getName(provider)}
                    className="flex h-[18px] w-[18px] items-center justify-center overflow-hidden rounded-full bg-white p-[3px] ring-1 ring-zinc-200 dark:ring-zinc-700"
                  >
                    <img
                      src={getProviderIcon(provider)}
                      alt={getName(provider)}
                      loading="lazy"
                      className="h-full w-full rounded-full object-cover"
                    />
                  </span>
                ))}
              </span>
            </div>
          )}
        </div>
        <span
          className="mt-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          <Switch
            checked={checked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
            aria-label={title}
          />
        </span>
      </div>
    </section>
  );
};
