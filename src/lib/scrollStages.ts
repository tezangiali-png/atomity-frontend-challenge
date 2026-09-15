/**
 * Single source of truth for the pinned scroll sequence's stage boundaries.
 * Every component that needs a slice of the 0..1 scroll progress value reads
 * from here instead of hardcoding its own range, so retuning the pacing of
 * the narrative only ever requires editing this file.
 */
export const STAGE = {
  identity: [0, 0.15] as const,
  glyphsAndConnectors: [0.15, 0.35] as const,
  chartFill: [0.35, 0.6] as const,
  zoom: [0.6, 0.8] as const,
  detail: [0.8, 1] as const,
};
