"use client";

import { motion, type MotionValue, useTransform } from "framer-motion";
import { StatValue } from "@/components/ui/StatValue";
import { STAGE } from "@/lib/scrollStages";
import type { ResourceMetricDatum } from "@/types/cloud";

interface ResourceMetricProps {
  metric: ResourceMetricDatum;
  progress: MotionValue<number>;
  index: number;
  total: number;
}

export function ResourceMetric({ metric, progress, index, total }: ResourceMetricProps) {
  const [start, end] = STAGE.chartFill;
  const span = end - start;
  const localStart = start + (index / total) * span * 0.6;
  const localEnd = localStart + span * 0.4;

  const localProgress = useTransform(progress, [localStart, localEnd], [0, 1]);
  const scaleY = useTransform(localProgress, [0, 1], [0, Math.max(metric.value, 4) / 100]);
  const countValue = useTransform(localProgress, [0, 1], [0, metric.displayValue]);

  return (
    <div className="flex flex-col items-center gap-[var(--space-2)]">
      <div className="flex h-28 w-7 items-end @[420px]:h-36 @[420px]:w-9">
        <motion.div
          className="w-full rounded-t-[var(--radius-sm)] bg-[var(--color-accent-success)]"
          style={{ scaleY, transformOrigin: "bottom", height: "100%" }}
        />
      </div>
      <StatValue
        value={countValue}
        format={(n) => `$${Math.round(n)}`}
        className="text-[var(--font-size-caption)] font-semibold text-[var(--color-text-primary)]"
      />
      <span className="text-[var(--font-size-caption)] text-[var(--color-text-secondary)]">
        {metric.label}
      </span>
    </div>
  );
}
