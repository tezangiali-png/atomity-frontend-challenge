"use client";

import { motion, type MotionValue, useTransform } from "framer-motion";
import { STAGE } from "@/lib/scrollStages";

interface ResourceGlyphProps {
  lit: boolean;
  /** 0..1 progress covering the whole animated sequence this glyph belongs to. */
  progress: MotionValue<number>;
  index: number;
  total: number;
  /** Marks this as the one specific workload the story drills into — grows
   * further during the focus stage and keeps a permanent ring so the later
   * savings card reads as "about this exact glyph," not the node in general. */
  emphasized?: boolean;
}

const HEX_CLIP = "polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%)";

export function ResourceGlyph({ lit, progress, index, total, emphasized = false }: ResourceGlyphProps) {
  const [start, end] = STAGE.glyphsAndConnectors;
  const span = end - start;
  const localStart = start + (index / total) * span * 0.6;
  const localEnd = localStart + span * 0.4;

  const opacity = useTransform(progress, [localStart, localEnd], [0, 1]);
  const revealScale = useTransform(progress, [localStart, localEnd], [0.5, 1]);

  const [zoomStart, zoomEnd] = STAGE.zoom;
  const focusScale = useTransform(progress, [zoomStart, zoomEnd], emphasized ? [1, 1.5] : [1, 1]);
  const scale = useTransform(
    [revealScale, focusScale],
    ([a, b]) => (a as number) * (b as number),
  );

  return (
    <motion.div
      aria-hidden="true"
      style={{
        clipPath: HEX_CLIP,
        background: lit ? "var(--color-accent-success)" : "var(--color-bg-primary)",
        border: lit ? "none" : "1px solid var(--color-border-subtle)",
        boxShadow: emphasized ? "0 0 0 2px var(--color-accent-success)" : "none",
        opacity,
        scale,
      }}
      className="h-5 w-5"
    />
  );
}
