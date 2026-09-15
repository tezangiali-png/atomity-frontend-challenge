"use client";

import { motion, type MotionValue, useTransform } from "framer-motion";
import { STAGE } from "@/lib/scrollStages";

interface ConnectionLayerProps {
  progress: MotionValue<number>;
}

/**
 * Endpoints are derived from the actual grid proportions used in
 * MultiCloudSection (xl:grid-cols-[1fr_1.3fr_1fr], equal-thirds rows), not
 * guessed values — corner node centers sit at ~15%/85%, the chart column
 * spans ~30%-70%. Only shown at the `xl` breakpoint, where this 4-corners-
 * feeding-a-center topology actually matches the grid; the tablet 2x2 layout
 * has no equivalent single center point for these coordinates to target.
 */
const PATHS = [
  "M 15 17 L 33 36",
  "M 85 17 L 67 36",
  "M 15 83 L 33 64",
  "M 85 83 L 67 64",
];

export function ConnectionLayer({ progress }: ConnectionLayerProps) {
  const [start, end] = STAGE.glyphsAndConnectors;
  const [zoomStart, zoomEnd] = STAGE.zoom;

  const pathLength = useTransform(progress, [start, end], [0, 1]);
  const opacity = useTransform(
    progress,
    [start, start + 0.02, zoomStart, zoomEnd],
    [0, 1, 1, 0],
  );

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 hidden h-full w-full xl:block"
    >
      {PATHS.map((d) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          stroke="var(--color-accent-success)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray="6 4"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength, opacity }}
        />
      ))}
    </svg>
  );
}
