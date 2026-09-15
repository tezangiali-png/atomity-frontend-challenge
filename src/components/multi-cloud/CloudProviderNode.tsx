"use client";

import { motion, type MotionValue, useTransform } from "framer-motion";
import { ResourceGlyph } from "./ResourceGlyph";
import { STAGE } from "@/lib/scrollStages";
import type { ProviderDatum } from "@/types/cloud";

interface CloudProviderNodeProps {
  provider: ProviderDatum;
  /** 0..1 progress covering the whole animated sequence. */
  progress: MotionValue<number>;
  index: number;
  total: number;
  highlighted: boolean;
  /** Index of this node's glyph that the story drills into during the focus
   * stage. Only meaningful when `highlighted` is true. */
  emphasizedGlyphIndex?: number;
}

/** Original seven-sided container shape — a nod to the reference video's hub
 * layout, not a reproduction of any provider's actual logo mark. */
const NODE_CLIP =
  "polygon(50% 0%, 90% 22%, 100% 60%, 74% 100%, 26% 100%, 0% 60%, 10% 22%)";

export function CloudProviderNode({
  provider,
  progress,
  index,
  total,
  highlighted,
  emphasizedGlyphIndex,
}: CloudProviderNodeProps) {
  const [identityStart, identityEnd] = STAGE.identity;
  const identitySpan = identityEnd - identityStart;
  const nodeStart = identityStart + (index / total) * identitySpan * 0.7;
  const nodeEnd = nodeStart + identitySpan * 0.5;

  const revealOpacity = useTransform(progress, [nodeStart, nodeEnd], [0, 1]);
  const revealScale = useTransform(progress, [nodeStart, nodeEnd], [0.88, 1]);

  const [zoomStart, zoomEnd] = STAGE.zoom;
  const emphasisOpacity = useTransform(
    progress,
    [zoomStart, zoomEnd],
    highlighted ? [1, 1] : [1, 0.55],
  );
  const emphasisScale = useTransform(
    progress,
    [zoomStart, zoomEnd],
    highlighted ? [1, 1.15] : [1, 1],
  );
  // Restrained positional cue (a few pixels, not a zoom): the focused node
  // eases slightly toward the savings card below it, foreshadowing where the
  // story is headed without any large-scale motion.
  const focusY = useTransform(progress, [zoomStart, zoomEnd], highlighted ? [0, 6] : [0, 0]);

  const opacity = useTransform(
    [revealOpacity, emphasisOpacity],
    ([a, b]) => (a as number) * (b as number),
  );
  const scale = useTransform(
    [revealScale, emphasisScale],
    ([a, b]) => (a as number) * (b as number),
  );

  // Three-tier border, always resolved through one MotionValue so its type
  // stays consistent regardless of `highlighted`: neutral until this node's
  // glyphs have lit up, a light "connected" green tint once it's part of the
  // shared analysis, and a solid accent tier if the story focuses on it.
  const [connectorsStart, connectorsEnd] = STAGE.glyphsAndConnectors;
  const borderColor = useTransform(
    progress,
    highlighted
      ? [0, 1]
      : [connectorsStart + (index / total) * (connectorsEnd - connectorsStart), connectorsEnd],
    highlighted ? ["#34d399", "#34d399"] : ["#dbe1de", "#8fe0bd"],
  );

  return (
    <motion.div
      style={{ opacity, scale, y: focusY }}
      className="flex flex-col items-center gap-[var(--space-2)]"
    >
      <div
        className="flex h-24 w-24 flex-wrap items-center justify-center gap-1 p-4 xl:h-28 xl:w-28"
        style={{
          clipPath: NODE_CLIP,
          background: "var(--color-bg-surface)",
          borderWidth: highlighted ? 2 : 1,
          borderStyle: "solid",
          borderColor: borderColor as unknown as string,
          boxShadow: highlighted
            ? "0 0 0 6px color-mix(in srgb, var(--color-accent-success) 14%, transparent)"
            : "none",
        }}
      >
        {provider.glyphs.map((glyph, glyphIndex) => (
          <ResourceGlyph
            key={glyph.id}
            lit={glyph.lit}
            progress={progress}
            index={glyphIndex}
            total={provider.glyphs.length}
            emphasized={highlighted && glyphIndex === emphasizedGlyphIndex}
          />
        ))}
      </div>
      <span
        className="text-[var(--font-size-caption)] font-medium"
        style={{
          color: highlighted ? "var(--color-text-primary)" : "var(--color-text-secondary)",
          fontWeight: highlighted ? 600 : 500,
        }}
      >
        {provider.name}
      </span>
    </motion.div>
  );
}
