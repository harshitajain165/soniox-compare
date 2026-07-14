import React from "react";
import { Panel } from "@/components/panel";
import { activeProviders, useUrlSettings } from "@/hooks/use-url-settings";
import { useComparison } from "@/contexts/comparison-context";
import { SONIOX_PROVIDER, type ProviderName } from "@/lib/provider-features";
import { cn } from "@/lib/utils";
import { useFeatures } from "@/contexts/feature-context";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useModeSupport } from "@/hooks/use-mode-support";
import { ProviderFeaturesTooltip } from "./provider-features-tooltip";
import { ProviderCost } from "./provider-cost";
import { ProviderLogo } from "./provider-logo";
import { InfoMessages } from "./info-messages";
import { AddProviderTile } from "./add-provider-tile";
import { SwappableProviderCard } from "./swappable-provider-card";
import { SortableProviderCard } from "./sortable-provider-card";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { TranslationRenderer } from "./translation-renderer";
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
} from "@dnd-kit/sortable";

export const ProviderGrid = () => {
  const { settings, setSelectedProviders } = useUrlSettings();
  const { selectedProviders = [] } = settings;

  const { providerOutputs, appError, recordingState } = useComparison();
  const {
    providerFeatures,
    availableComparisonProviders,
    getProviderFeaturesList,
    supportsFeature,
  } = useFeatures();
  const { disabledReasons } = useModeSupport();

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

  const nameOf = (provider: ProviderName) =>
    providerFeatures?.[provider]?.name ?? provider;

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
          <TranslationRenderer
            outputData={outputData}
            appError={appError}
            targetLanguage={settings.targetLanguage}
            showLanguages={
              settings.enableLanguageIdentification &&
              supportsFeature(providerName, "language_identification")
            }
          />
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

  const featuresTooltip = (provider: ProviderName) => (
    <ProviderFeaturesTooltip features={getProviderFeaturesList(provider)} />
  );

  // Speech-to-speech: exactly one provider (several speaking at once would be
  // unintelligible), chosen from the header dropdown.
  if (settings.mode === "s2s") {
    const provider = activeProviders(settings)[0];

    return (
      <div className="flex h-full flex-col overflow-hidden bg-gray-100 p-3 dark:bg-gray-900">
        <div className="min-h-0 w-full flex-1">
          <TooltipProvider>
            <Panel
              title={nameOf(provider)}
              subtitle={providerFeatures?.[provider]?.model}
              titleTooltip={featuresTooltip(provider)}
              logo={<ProviderLogo provider={provider} name={nameOf(provider)} />}
              priceSection={
                <ProviderCost
                  provider={provider}
                  providerName={nameOf(provider)}
                />
              }
              className={provider === SONIOX_PROVIDER ? "text-soniox" : undefined}
            >
              {renderPanelBody(provider)}
            </Panel>
          </TooltipProvider>
        </div>
      </div>
    );
  }

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
              title={nameOf(SONIOX_PROVIDER)}
              subtitle={providerFeatures?.[SONIOX_PROVIDER]?.model}
              titleTooltip={featuresTooltip(SONIOX_PROVIDER)}
              logo={
                <ProviderLogo
                  provider={SONIOX_PROVIDER}
                  name={nameOf(SONIOX_PROVIDER)}
                />
              }
              priceSection={
                <ProviderCost
                  provider={SONIOX_PROVIDER}
                  providerName={nameOf(SONIOX_PROVIDER)}
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
            <SwappableProviderCard
              provider={comparisonProvider}
              title={nameOf(comparisonProvider)}
              subtitle={providerFeatures?.[comparisonProvider]?.model}
              titleTooltip={featuresTooltip(comparisonProvider)}
              pickableProviders={pickableProviders}
              providerFeatures={providerFeatures}
              onSwap={handleSwapProvider}
              disabled={isBusy}
              prefersReducedMotion={!!prefersReducedMotion}
              disabledReasons={disabledReasons}
            >
              {renderPanelBody(comparisonProvider)}
            </SwappableProviderCard>
          ) : (
            <AddProviderTile
              remainingProviders={availableComparisonProviders}
              providerFeatures={providerFeatures}
              onAdd={(provider) => setSelectedProviders([provider])}
              disabled={isBusy}
              prefersReducedMotion={!!prefersReducedMotion}
              disabledReasons={disabledReasons}
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
                title={nameOf(SONIOX_PROVIDER)}
                subtitle={providerFeatures?.[SONIOX_PROVIDER]?.model}
                titleTooltip={featuresTooltip(SONIOX_PROVIDER)}
                logo={
                  <ProviderLogo
                    provider={SONIOX_PROVIDER}
                    name={nameOf(SONIOX_PROVIDER)}
                  />
                }
                priceSection={
                  <ProviderCost
                    provider={SONIOX_PROVIDER}
                    providerName={nameOf(SONIOX_PROVIDER)}
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
                  title={nameOf(providerName)}
                  subtitle={providerFeatures?.[providerName]?.model}
                  titleTooltip={featuresTooltip(providerName)}
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
