export type TranslationStatus = "original" | "translation";

export interface TranslationPart {
  text: string;
  speaker?: number | null;
  language?: string | null;
  sourceLanguage?: string | null;
  translationStatus?: TranslationStatus | null;
  start_ms?: number | null;
  end_ms?: number | null;
  confidence?: number | null;
}

/**
 * One utterance: the source text and its translation, side by side. Keyed by
 * (speaker, sourceLanguage) so a speaker switch or a language switch starts a
 * new block.
 */
export interface TranslationBlock {
  speaker: number | null;
  sourceLanguage: string | null;
  originalFinal: string;
  originalPartial: string;
  translationFinal: string;
  translationPartial: string;
  /** True once the provider emitted an `<end>` endpoint marker for this utterance. */
  endDetected: boolean;
  /** Closed by `<end>`: later tokens start a new block even for the same key. */
  closed: boolean;
}

// `<fin>` acknowledges a manual finalize — internal control, never shown.
// `<end>` (endpoint detection) is handled separately: it closes the current
// block and is rendered as an endpoint marker.
const CONTROL_TOKENS = new Set(["<fin>"]);

const emptyBlock = (
  speaker: number | null,
  sourceLanguage: string | null
): TranslationBlock => ({
  speaker,
  sourceLanguage,
  originalFinal: "",
  originalPartial: "",
  translationFinal: "",
  translationPartial: "",
  endDetected: false,
  closed: false,
});

const isEmpty = (b: TranslationBlock) =>
  !b.originalFinal &&
  !b.originalPartial &&
  !b.translationFinal &&
  !b.translationPartial;

/**
 * Group a provider's tokens into paired original/translation blocks.
 *
 * `finalParts` accumulate across the session; `nonFinalParts` are replaced
 * wholesale on every message and are always the tail of the stream, so they are
 * appended last and land in the `*Partial` fields.
 */
export function buildBlocks(
  finalParts: TranslationPart[],
  nonFinalParts: TranslationPart[] = []
): TranslationBlock[] {
  const blocks: TranslationBlock[] = [];

  const consume = (part: TranslationPart, isFinal: boolean) => {
    if (!part.text || CONTROL_TOKENS.has(part.text.trim())) return;

    if (part.text.trim() === "<end>") {
      const last = blocks[blocks.length - 1];
      if (last && !isEmpty(last)) {
        last.endDetected = true;
        last.closed = true;
      }
      return;
    }

    const isTranslation = part.translationStatus === "translation";
    // For originals, `language` IS the spoken language. For translations,
    // `language` is the target side and `sourceLanguage` is the spoken side.
    // We group by the spoken language so each block holds an utterance
    // together with its translation.
    const explicitLang = isTranslation
      ? part.sourceLanguage ?? null
      : part.language ?? null;

    const last = blocks[blocks.length - 1];
    // A token that omits speaker/language continues whatever block preceded it.
    const speaker = part.speaker ?? last?.speaker ?? null;
    const sourceLanguage = explicitLang ?? last?.sourceLanguage ?? null;

    let target: TranslationBlock;
    if (
      last &&
      !last.closed &&
      last.speaker === speaker &&
      last.sourceLanguage === sourceLanguage
    ) {
      target = last;
    } else {
      target = emptyBlock(speaker, sourceLanguage);
      blocks.push(target);
    }

    const side = isTranslation ? "translation" : "original";
    const field = `${side}${isFinal ? "Final" : "Partial"}` as const;
    target[field] += part.text;
  };

  finalParts.forEach((p) => consume(p, true));
  nonFinalParts.forEach((p) => consume(p, false));

  return blocks.filter((b) => !isEmpty(b));
}
