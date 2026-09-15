"use client";

import type { MotionValue } from "framer-motion";
import { ResourceMetric } from "./ResourceMetric";
import type { ResourceMetricDatum } from "@/types/cloud";

interface ResourceVisualizationProps {
  metrics: ResourceMetricDatum[];
  progress: MotionValue<number>;
}

/**
 * Deliberately has no card chrome of its own (no border/background/shadow) —
 * it lives inside MultiCloudSection's shared canvas panel alongside the
 * provider nodes, so the chart reads as emerging from that one surface
 * rather than as an independent floating card.
 */
export function ResourceVisualization({ metrics, progress }: ResourceVisualizationProps) {
  return (
    <figure className="relative flex w-full max-w-md flex-col items-center gap-[var(--space-4)] rounded-[var(--radius-md)] border border-dashed border-[var(--color-border-subtle)] bg-[color-mix(in_srgb,var(--color-accent-success)_4%,var(--color-bg-surface))] p-[var(--space-4)] @container">
      <figcaption className="text-center text-[var(--font-size-caption)] font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
        Aggregated across all four providers
      </figcaption>
      <div className="flex w-full items-end justify-between gap-[var(--space-2)] @[420px]:gap-[var(--space-4)]">
        {metrics.map((metric, index) => (
          <ResourceMetric
            key={metric.key}
            metric={metric}
            progress={progress}
            index={index}
            total={metrics.length}
          />
        ))}
      </div>
    </figure>
  );
}
