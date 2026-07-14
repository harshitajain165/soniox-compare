import { FrequencyBars } from "@/components/frequency-bars";
import { ProviderCost } from "@/components/provider-cost";
import { Button } from "@/components/ui/button";
import { useConfig } from "@/contexts/config-context";
import { useTts } from "@/contexts/tts-context";
import {
  PROVIDER_DISPLAY_NAMES,
  PROVIDER_MODELS,
  getProviderIcon,
  type ProviderName,
} from "@/lib/providers";
import { cn } from "@/lib/utils";
import { Loader2, Play, Square } from "lucide-react";
import { useCallback } from "react";

export const ProviderPanel = ({ provider }: { provider: ProviderName }) => {
  const { isLanguageSupported } = useConfig();
  const {
    language,
    providerStates,
    play,
    stop,
    stopAll,
    isPlayingAll,
    getAnalyser,
  } = useTts();
  const { status, error } = providerStates[provider];
  const supported = isLanguageSupported(language, provider);
  const isSoniox = provider === "soniox";

  const isActive =
    status === "loading" || status === "playing" || status === "paused";
  const isHidden = isPlayingAll && !isActive;

  const idleButtonClass = isSoniox
    ? "bg-soniox hover:bg-soniox/90"
    : "bg-zinc-300 hover:bg-soniox";

  const buttonClass =
    status === "playing" ? "bg-zinc-800 hover:bg-zinc-700" : idleButtonClass;

  const getProviderAnalyser = useCallback(
    () => getAnalyser(provider),
    [getAnalyser, provider],
  );

  const handleClick = () => {
    if (isPlayingAll) {
      stopAll();
      return;
    }
    if (status === "playing" || status === "loading") stop(provider);
    else play(provider);
  };

  return (
    <section className="relative w-full h-full min-h-0 flex flex-row items-center gap-2 px-2 py-1 sm:flex-col sm:items-stretch sm:gap-0 sm:p-0 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-gray-950">
      {supported && isActive && (
        <div className="hidden sm:block pointer-events-none absolute inset-x-0 bottom-0">
          <FrequencyBars
            getAnalyser={getProviderAnalyser}
            active={status === "playing"}
            className="text-[#EEEFF4] dark:text-zinc-800"
          />
        </div>
      )}
      <div className="relative min-w-0 sm:border-b border-zinc-200 dark:border-zinc-700 sm:p-2">
        <div className="flex flex-row items-center gap-2.5">
          <div className="h-9 w-9 shrink-0 rounded-md dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center overflow-hidden">
            <img
              src={getProviderIcon(provider)}
              alt={`${PROVIDER_DISPLAY_NAMES[provider]} logo`}
              className="h-6 w-6 object-contain"
            />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <h2
              className={cn(
                "w-fit max-w-full text-sm font-bold truncate leading-tight text-zinc-800 dark:text-zinc-100",
                isSoniox && "text-soniox dark:text-soniox",
              )}
            >
              {PROVIDER_DISPLAY_NAMES[provider]}
            </h2>
            <p className="text-[10px] font-medium text-zinc-400 lowercase truncate leading-tight">
              {PROVIDER_MODELS[provider]}
            </p>
          </div>
          <ProviderCost
            provider={provider}
            providerName={PROVIDER_DISPLAY_NAMES[provider]}
          />
        </div>
      </div>

      {/* Mobile only */}
      <div className="min-w-0 flex-1 sm:hidden pointer-events-none">
        {supported && isActive && (
          <FrequencyBars
            getAnalyser={getProviderAnalyser}
            active={status === "playing"}
            height={40}
            className="text-[#EEEFF4] dark:text-zinc-800"
          />
        )}
      </div>

      <div className="relative shrink-0 sm:flex-grow flex flex-col items-center justify-center gap-2 sm:p-4">
        {supported ? (
          <>
            <Button
              size="icon"
              onClick={handleClick}
              tabIndex={isHidden ? -1 : undefined}
              aria-hidden={isHidden}
              className={cn(
                "h-11 w-11 sm:h-14 sm:w-14 rounded-full transition-all duration-300",
                buttonClass,
                isHidden && "scale-75 opacity-0 pointer-events-none",
              )}
            >
              {status === "loading" ? (
                <Loader2 className="size-6 animate-spin" />
              ) : status === "playing" ? (
                <Square className="size-5 fill-current" />
              ) : (
                <Play className="size-6 fill-current" />
              )}
            </Button>
            <p
              className={cn(
                "text-xs text-center leading-snug sm:min-h-4",
                status === "error" ? "text-red-500" : "text-zinc-400",
                status !== "error" && "hidden sm:block",
              )}
            >
              {status === "error"
                ? error
                : status === "loading"
                  ? "Generating..."
                  : status === "playing"
                    ? "Playing"
                    : status === "paused"
                      ? "Paused"
                      : " "}
            </p>
          </>
        ) : (
          <p className="text-xs text-zinc-400 text-center">
            Language not supported
          </p>
        )}
      </div>
    </section>
  );
};
