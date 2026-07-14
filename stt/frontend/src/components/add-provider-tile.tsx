import React from "react";
import { Plus } from "lucide-react";
import type { ProviderFeatures } from "@/contexts/feature-context";
import { type ProviderName } from "@/lib/provider-features";
import { FlipCard } from "./flip-card";
import { ProviderPickerBack } from "./provider-picker-back";
import { ProviderPickerGrid } from "./provider-picker-grid";

type Props = {
  remainingProviders: ProviderName[];
  providerFeatures: ProviderFeatures | null;
  onAdd: (provider: ProviderName) => void;
  disabled: boolean;
  prefersReducedMotion: boolean;
  // When collapsible, the tile is sized by its parent (a narrow strip that the
  // grid widens once open). Used on desktop where it sits beside the cards grid.
  collapsible?: boolean;
  // Optionally control the flip state from the parent.
  flipped?: boolean;
  onFlippedChange?: (flipped: boolean) => void;
};

export const AddProviderTile = ({
  remainingProviders,
  providerFeatures,
  onAdd,
  disabled,
  prefersReducedMotion,
  collapsible = false,
  flipped: controlledFlipped,
  onFlippedChange,
}: Props) => {
  const [internalFlipped, setInternalFlipped] = React.useState(false);
  const flipped = controlledFlipped ?? internalFlipped;
  const setFlipped = (next: boolean) => {
    onFlippedChange?.(next);
    if (controlledFlipped === undefined) setInternalFlipped(next);
  };

  // Keep the back face from lingering once everything has been added.
  React.useEffect(() => {
    if (remainingProviders.length === 0) {
      setFlipped(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingProviders.length]);

  const frontFace = (
    <button
      type="button"
      disabled={disabled}
      onClick={() => setFlipped(true)}
      className="group/add flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 bg-white/40 text-zinc-400 transition-colors hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-500 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900/40 dark:hover:border-zinc-600 dark:hover:text-zinc-300"
      aria-label="Add provider to compare"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-current transition-transform duration-300 group-hover/add:rotate-90 group-hover/add:scale-110">
        <Plus className="h-5 w-5" />
      </span>
      <span className="text-sm font-medium whitespace-nowrap">Add provider</span>
    </button>
  );

  const backFace = (
    <ProviderPickerBack onClose={() => setFlipped(false)}>
      <ProviderPickerGrid
        providers={remainingProviders}
        providerFeatures={providerFeatures}
        onPick={onAdd}
        prefersReducedMotion={prefersReducedMotion}
        columns={collapsible ? 1 : 2}
      />
    </ProviderPickerBack>
  );

  return (
    <FlipCard
      flipped={flipped}
      front={frontFace}
      back={backFace}
      prefersReducedMotion={prefersReducedMotion}
      className={collapsible ? undefined : "min-h-[10rem]"}
    />
  );
};
