import React from "react";
import { Panel } from "@/components/panel";
import { useUrlSettings } from "@/hooks/use-url-settings";
import { useComparison, type InfoMessage } from "@/contexts/comparison-context";
import {
  SONIOX_PROVIDER,
  getProviderIcon,
  type ProviderName,
} from "@/lib/provider-features";
import { cn } from "@/lib/utils";
import { AlertTriangle, ArrowLeftRight, Info, Plus, X, XCircle } from "lucide-react";
import { useFeatures } from "@/contexts/feature-context";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { ProviderFeaturesTooltip } from "./provider-features-tooltip";
import { ProviderCost } from "./provider-cost";
import MarkdownRenderer from "./markdown-renderer";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { TranscriptRenderer } from "./transcript-renderer";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const ProviderGrid: React.FC = () => {
  const { settings, setSelectedProviders } = useUrlSettings();
  const { selectedProviders = [] } = settings;

  const { providerOutputs, appError, recordingState } = useComparison();
  const {
    providerFeatures,
    availableComparisonProviders,
    // getProviderFeatures,
    getProviderFeaturesList,
  } = useFeatures();

  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const isBusy =
    recordingState === "recording" ||
    recordingState === "starting" ||
    recordingState === "connecting" ||
    recordingState === "stopping";

  const handleRemoveProvider = (provider: ProviderName) => {
    setSelectedProviders(selectedProviders.filter((p) => p !== provider));
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = selectedProviders.indexOf(active.id as ProviderName);
    const newIndex = selectedProviders.indexOf(over.id as ProviderName);
    if (oldIndex === -1 || newIndex === -1) return;
    setSelectedProviders(arrayMove(selectedProviders, oldIndex, newIndex));
  };

  // Measure the cards area so we can pick a balanced column count instead of
  // greedily packing (which leaves an awkward, much-wider last row e.g. 6 + 2).
  // A callback ref attaches the observer whenever the node mounts (the desktop
  // branch isn't present on the very first render), measuring immediately.
  const [cardsWidth, setCardsWidth] = React.useState(0);
  const resizeObserverRef = React.useRef<ResizeObserver | null>(null);
  const setCardsRef = React.useCallback((node: HTMLDivElement | null) => {
    resizeObserverRef.current?.disconnect();
    resizeObserverRef.current = null;
    if (!node) return;
    const measure = () => setCardsWidth(node.getBoundingClientRect().width);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    resizeObserverRef.current = ro;
  }, []);

  const MIN_CARD_WIDTH = 280;
  const CARD_GAP = 12; // matches gap-3
  const CARD_PADDING = 12; // matches p-3 (per side)
  const totalCards = 1 + selectedProviders.length; // Soniox + comparisons
  // cardsWidth is the border-box; the cards lay out within the padded content.
  const availableWidth = Math.max(0, cardsWidth - 2 * CARD_PADDING);
  const maxColumns = Math.max(
    1,
    Math.floor((availableWidth + CARD_GAP) / (MIN_CARD_WIDTH + CARD_GAP))
  );
  // Even out the rows: minimise row count, then spread cards across them.
  const cappedColumns = Math.min(totalCards, maxColumns);
  const rowCount = Math.max(1, Math.ceil(totalCards / cappedColumns));
  const columnCount = Math.ceil(totalCards / rowCount);
  const cardBasis = `calc((100% - ${
    (columnCount - 1) * CARD_GAP
  }px) / ${columnCount})`;
  const cardStyle: React.CSSProperties = {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: cardBasis,
    minWidth: 0,
    // Keep cards usable when many rows / short viewports would otherwise squash
    // them; the container scrolls once the rows no longer fit.
    minHeight: "10rem",
  };

  const springTransition: Transition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 420, damping: 34 };

  const cardMotion = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.9, y: 10 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.9 },
      };

  const renderPanelBody = (providerName: ProviderName) => {
    const outputData = providerOutputs[providerName] || {
      statusMessage: "Waiting for data...",
      finalParts: [],
      nonFinalParts: [],
      error: null,
      infoMessages: [],
    };
    return (
      <div className="absolute flex flex-col inset-0">
        <div className="relative flex-1">
          <TranscriptRenderer outputData={outputData} appError={appError} />
        </div>
        <InfoMessages
          infoMessages={
            outputData.error
              ? [
                  ...outputData.infoMessages,
                  { message: outputData.error, level: "error" },
                ]
              : outputData.infoMessages
          }
        />
      </div>
    );
  };

  if (isMobile) {
    // Mobile is limited to Soniox vs a single provider: two stacked cards.
    const comparisonProvider =
      selectedProviders.filter((p) => p !== SONIOX_PROVIDER)[0] ?? null;
    const pickableProviders = availableComparisonProviders.filter(
      (p) => p !== comparisonProvider
    );

    // Mobile compares against exactly one provider, so swapping replaces it
    // outright rather than growing the selection (which recording would honor).
    const handleSwapProvider = (provider: ProviderName) => {
      setSelectedProviders([provider]);
    };

    return (
      <div className="flex h-full flex-col gap-3 overflow-hidden bg-gray-100 p-3 dark:bg-gray-900">
        <div className="min-h-0 flex-1">
          <TooltipProvider>
            <Panel
              title={providerFeatures?.[SONIOX_PROVIDER]?.name ?? SONIOX_PROVIDER}
              subtitle={providerFeatures?.[SONIOX_PROVIDER]?.model}
              titleTooltip={
                <ProviderFeaturesTooltip
                  features={getProviderFeaturesList(SONIOX_PROVIDER)}
                />
              }
              logo={
                <ProviderLogo
                  provider={SONIOX_PROVIDER}
                  name={
                    providerFeatures?.[SONIOX_PROVIDER]?.name ?? SONIOX_PROVIDER
                  }
                />
              }
              priceSection={
                <ProviderCost
                  provider={SONIOX_PROVIDER}
                  providerName={
                    providerFeatures?.[SONIOX_PROVIDER]?.name ?? SONIOX_PROVIDER
                  }
                />
              }
              className="text-soniox"
            >
              {renderPanelBody(SONIOX_PROVIDER)}
            </Panel>
          </TooltipProvider>
        </div>

        <div className="min-h-0 flex-1">
          {comparisonProvider ? (
            <MobileComparisonCard
              provider={comparisonProvider}
              title={
                providerFeatures?.[comparisonProvider]?.name ?? comparisonProvider
              }
              subtitle={providerFeatures?.[comparisonProvider]?.model}
              titleTooltip={
                <ProviderFeaturesTooltip
                  features={getProviderFeaturesList(comparisonProvider)}
                />
              }
              pickableProviders={pickableProviders}
              providerFeatures={providerFeatures}
              onSwap={handleSwapProvider}
              disabled={isBusy}
              prefersReducedMotion={!!prefersReducedMotion}
            >
              {renderPanelBody(comparisonProvider)}
            </MobileComparisonCard>
          ) : (
            <AddProviderTile
              remainingProviders={availableComparisonProviders}
              providerFeatures={providerFeatures}
              onAdd={(provider) => setSelectedProviders([provider])}
              disabled={isBusy}
              prefersReducedMotion={!!prefersReducedMotion}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setIsDragging(false)}
    >
      <div className="flex bg-gray-100 dark:bg-gray-900 h-full overflow-hidden">
        <div
          ref={setCardsRef}
          className={cn(
            // Flex-wrap (rather than grid) so the last row's card(s) stretch to
            // fill the remaining width instead of leaving empty column tracks.
            "flex flex-1 flex-wrap content-stretch items-stretch",
            // Padding lives inside the scroll container so it scrolls with the
            // cards instead of being a static frame around the scroll area.
            "min-w-0 gap-3 overflow-y-auto p-3"
          )}
        >
          {/* Soniox is always pinned first and is not sortable/removable. */}
          <motion.div
            key={SONIOX_PROVIDER}
            layout
            transition={springTransition}
            {...cardMotion}
            style={cardStyle}
            className="group relative min-h-0"
          >
            <TooltipProvider>
              <Panel
                title={providerFeatures?.[SONIOX_PROVIDER]?.name ?? SONIOX_PROVIDER}
                subtitle={providerFeatures?.[SONIOX_PROVIDER]?.model}
                titleTooltip={
                  <ProviderFeaturesTooltip
                    features={getProviderFeaturesList(SONIOX_PROVIDER)}
                  />
                }
                logo={
                  <ProviderLogo
                    provider={SONIOX_PROVIDER}
                    name={
                      providerFeatures?.[SONIOX_PROVIDER]?.name ??
                      SONIOX_PROVIDER
                    }
                  />
                }
                priceSection={
                  <ProviderCost
                    provider={SONIOX_PROVIDER}
                    providerName={
                      providerFeatures?.[SONIOX_PROVIDER]?.name ??
                      SONIOX_PROVIDER
                    }
                    disableTooltip={isDragging}
                  />
                }
                className="text-soniox"
                disableTitleTooltip={isDragging}
              >
                {renderPanelBody(SONIOX_PROVIDER)}
              </Panel>
            </TooltipProvider>
          </motion.div>

          <SortableContext
            items={selectedProviders}
            strategy={rectSortingStrategy}
          >
            {/* popLayout pulls an exiting card out of the flex flow immediately
                so the surviving cards spring into the freed space concurrently
                with the fade, instead of snapping after the exit completes. */}
            <AnimatePresence initial={false} mode="popLayout">
              {selectedProviders.map((providerName) => (
                <SortableProviderCard
                  key={providerName}
                  provider={providerName}
                  title={providerFeatures?.[providerName]?.name ?? providerName}
                  subtitle={providerFeatures?.[providerName]?.model}
                  titleTooltip={
                    <ProviderFeaturesTooltip
                      features={getProviderFeaturesList(providerName)}
                    />
                  }
                  onRemove={() => handleRemoveProvider(providerName)}
                  disabled={isBusy}
                  disableTitleTooltip={isDragging}
                  dragActive={isDragging}
                  cardStyle={cardStyle}
                  prefersReducedMotion={!!prefersReducedMotion}
                >
                  {renderPanelBody(providerName)}
                </SortableProviderCard>
              ))}
            </AnimatePresence>
          </SortableContext>
        </div>
      </div>
    </DndContext>
  );
};

interface SortableProviderCardProps {
  provider: ProviderName;
  title: string;
  subtitle?: string;
  titleTooltip?: React.ReactNode;
  onRemove: () => void;
  disabled: boolean;
  disableTitleTooltip: boolean;
  // True while any card in the grid is being dragged. Framer layout animations
  // are disabled then so they don't fight dnd-kit's transforms.
  dragActive: boolean;
  // Flex sizing (basis/grow) shared by every card so rows stay balanced.
  cardStyle: React.CSSProperties;
  prefersReducedMotion: boolean;
  children: React.ReactNode;
}

const SortableProviderCard: React.FC<SortableProviderCardProps> = ({
  provider,
  title,
  subtitle,
  titleTooltip,
  onRemove,
  disabled,
  disableTitleTooltip,
  dragActive,
  cardStyle,
  prefersReducedMotion,
  children,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: provider, disabled });

  // dnd-kit drives position via `transform`/`transition`; framer only animates
  // opacity here so the two don't fight over the `transform` property.
  const style: React.CSSProperties = {
    ...cardStyle,
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 30 : undefined,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout={!dragActive && !prefersReducedMotion}
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={prefersReducedMotion ? undefined : { opacity: 0 }}
      transition={{
        duration: 0.18,
        layout: { type: "spring", stiffness: 420, damping: 34 },
      }}
      className={cn(
        "group relative min-h-0",
        isDragging && "shadow-xl"
      )}
    >
      <TooltipProvider>
        <Panel
          title={title}
          subtitle={subtitle}
          titleTooltip={titleTooltip}
          logo={<ProviderLogo provider={provider} name={title} />}
          priceSection={
            <ProviderCost
              provider={provider}
              providerName={title}
              disableTooltip={disableTitleTooltip}
            />
          }
          disableTitleTooltip={disableTitleTooltip}
          headerProps={disabled ? undefined : { ...attributes, ...listeners }}
          headerClassName={cn(
            "touch-none select-none",
            !disabled && "cursor-grab active:cursor-grabbing"
          )}
          trailingElement={
            <button
              type="button"
              onClick={onRemove}
              onPointerDown={(e) => e.stopPropagation()}
              disabled={disabled}
              aria-label={`Remove ${title}`}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              <X className="h-4 w-4" />
            </button>
          }
        >
          {children}
        </Panel>
      </TooltipProvider>
    </motion.div>
  );
};

interface AddProviderTileProps {
  remainingProviders: ProviderName[];
  providerFeatures: ReturnType<typeof useFeatures>["providerFeatures"];
  onAdd: (provider: ProviderName) => void;
  disabled: boolean;
  prefersReducedMotion: boolean;
  // When collapsible, the tile is sized by its parent (a narrow strip that the
  // grid widens once open). Used on desktop where it sits beside the cards grid.
  collapsible?: boolean;
  // Optionally control the flip state from the parent.
  flipped?: boolean;
  onFlippedChange?: (flipped: boolean) => void;
}

const AddProviderTile: React.FC<AddProviderTileProps> = ({
  remainingProviders,
  providerFeatures,
  onAdd,
  disabled,
  prefersReducedMotion,
  collapsible = false,
  flipped: controlledFlipped,
  onFlippedChange,
}) => {
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

interface MobileComparisonCardProps {
  provider: ProviderName;
  title: string;
  subtitle?: string;
  titleTooltip?: React.ReactNode;
  pickableProviders: ProviderName[];
  providerFeatures: ReturnType<typeof useFeatures>["providerFeatures"];
  onSwap: (provider: ProviderName) => void;
  disabled: boolean;
  prefersReducedMotion: boolean;
  children: React.ReactNode;
}

const MobileComparisonCard: React.FC<MobileComparisonCardProps> = ({
  provider,
  title,
  subtitle,
  titleTooltip,
  pickableProviders,
  providerFeatures,
  onSwap,
  disabled,
  prefersReducedMotion,
  children,
}) => {
  const [flipped, setFlipped] = React.useState(false);

  // Reset to the transcript face whenever the displayed provider changes.
  React.useEffect(() => {
    setFlipped(false);
  }, [provider]);

  const frontFace = (
    <TooltipProvider>
      <Panel
        title={title}
        subtitle={subtitle}
        titleTooltip={titleTooltip}
        logo={<ProviderLogo provider={provider} name={title} />}
        priceSection={
          <ProviderCost
            provider={provider}
            providerName={title}
            disableTooltip={flipped}
          />
        }
        disableTitleTooltip={flipped}
        trailingElement={
          <button
            type="button"
            onClick={() => setFlipped(true)}
            disabled={disabled || pickableProviders.length === 0}
            aria-label={`Switch provider (currently ${title})`}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>
        }
      >
        {children}
      </Panel>
    </TooltipProvider>
  );

  const backFace = (
    <ProviderPickerBack onClose={() => setFlipped(false)}>
      <ProviderPickerGrid
        providers={pickableProviders}
        providerFeatures={providerFeatures}
        onPick={(picked) => {
          onSwap(picked);
          setFlipped(false);
        }}
        prefersReducedMotion={prefersReducedMotion}
        columns={2}
      />
    </ProviderPickerBack>
  );

  return (
    <FlipCard
      flipped={flipped}
      front={frontFace}
      back={backFace}
      prefersReducedMotion={prefersReducedMotion}
    />
  );
};

interface FlipCardProps {
  flipped: boolean;
  front: React.ReactNode;
  back: React.ReactNode;
  prefersReducedMotion: boolean;
  className?: string;
}

const FlipCard: React.FC<FlipCardProps> = ({
  flipped,
  front,
  back,
  prefersReducedMotion,
  className,
}) => {
  // Reduced motion: skip the 3D flip, just swap the faces.
  if (prefersReducedMotion) {
    return (
      <div className={cn("h-full min-h-0", className)}>
        {flipped ? back : front}
      </div>
    );
  }

  return (
    <div
      className={cn("h-full min-h-0", className)}
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
      >
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
            // The away-facing side still intercepts touches on some mobile
            // browsers, which blocked the picker's close button.
            pointerEvents: flipped ? "none" : "auto",
          }}
        >
          {front}
        </div>
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            pointerEvents: flipped ? "auto" : "none",
          }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
};

interface ProviderPickerGridProps {
  providers: ProviderName[];
  providerFeatures: ReturnType<typeof useFeatures>["providerFeatures"];
  onPick: (provider: ProviderName) => void;
  prefersReducedMotion: boolean;
  columns: 1 | 2;
}

export const ProviderPickerGrid: React.FC<ProviderPickerGridProps> = ({
  providers,
  providerFeatures,
  onPick,
  prefersReducedMotion,
  columns,
}) => (
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

interface ProviderPickerBackProps {
  onClose: () => void;
  children: React.ReactNode;
}

const ProviderPickerBack: React.FC<ProviderPickerBackProps> = ({
  onClose,
  children,
}) => (
  <div className="flex h-full w-full flex-col rounded-xl border-2 border-dashed border-zinc-300 bg-white/40 p-2 dark:border-zinc-700 dark:bg-zinc-900/40">
    <div className="mb-2 flex items-center justify-between px-1">
      <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Compare with
      </span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Cancel"
        className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
    <div className="flex-1 overflow-y-auto p-0.5">{children}</div>
  </div>
);

interface ProviderLogoProps {
  provider: ProviderName;
  name: string;
  className?: string;
}

export const ProviderLogo: React.FC<ProviderLogoProps> = ({
  provider,
  name,
  className,
}) => (
  <img
    src={getProviderIcon(provider)}
    alt={`${name} logo`}
    loading="lazy"
    className={cn("h-full w-full scale-[0.8] object-contain", className)}
  />
);

interface InfoMessagesProps {
  infoMessages?: InfoMessage[];
}

const InfoMessages = ({ infoMessages }: InfoMessagesProps) => {
  if (!infoMessages || infoMessages.length === 0) {
    return null;
  }

  return (
    <div className="border-t shrink-0 z-10 border-gray-100 dark:border-gray-700">
      <Accordion type="multiple" className="w-full">
        {infoMessages.map((info, index) => (
          <AccordionItem
            value={`item-${index}`}
            key={index}
            className="border-b-0 hover:bg-black/5 transition-colors"
          >
            <AccordionTrigger className="px-2 py-1.5 text-xs truncate hover:no-underline cursor-pointer">
              <div className="flex items-center gap-2 truncate">
                {info.level === "warning" && (
                  <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0" />
                )}
                {info.level === "error" && (
                  <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                )}
                {info.level === "info" && (
                  <Info className="h-4 w-4 text-blue-500 shrink-0" />
                )}
                <span className="truncate text-[10px]">{info.message}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-2 mb-1 mx-2 text-[10px] bg-black/5 dark:bg-white/5 rounded-md">
              <MarkdownRenderer>{info.message}</MarkdownRenderer>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
