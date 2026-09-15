"use client";

import { motion, type MotionValue, useTransform } from "framer-motion";
import { StatValue } from "@/components/ui/StatValue";
import { Badge } from "@/components/ui/Badge";
import { STAGE } from "@/lib/scrollStages";
import type { ProviderId, SavingsDetailData } from "@/types/cloud";

interface SavingsDetailProps {
  data: SavingsDetailData;
  progress: MotionValue<number>;
}

const PROVIDER_LABELS: Record<ProviderId, string> = {
  aws: "AWS",
  azure: "Azure",
  gcp: "Google Cloud",
  onprem: "On-Premise",
};

export function SavingsDetail({ data, progress }: SavingsDetailProps) {
  const [start, end] = STAGE.detail;

  const opacity = useTransform(progress, [start, start + 0.06, end], [0, 1, 1]);
  const x = useTransform(progress, [start, end], [24, 0]);
  const savingsCount = useTransform(progress, [start + 0.1, end], [0, data.estimatedSavings]);

  return (
    <motion.div
      style={{ opacity, x }}
      className="relative flex w-full max-w-sm flex-col gap-[var(--space-3)] rounded-[var(--radius-lg)] border border-[var(--color-accent-success)] bg-[var(--color-bg-surface)] p-[var(--space-5)] shadow-md"
    >
      <Badge tone="success">{PROVIDER_LABELS[data.targetProviderId]} — selected workload</Badge>

      <dl className="grid grid-cols-2 gap-x-[var(--space-4)] gap-y-[var(--space-3)]">
        <div>
          <dt className="text-[var(--font-size-caption)] text-[var(--color-text-secondary)]">
            CPU Usage
          </dt>
          <dd className="text-[var(--font-size-body)] font-semibold">{data.cpuUsage}</dd>
        </div>
        <div>
          <dt className="text-[var(--font-size-caption)] text-[var(--color-text-secondary)]">
            CPU Request
          </dt>
          <dd className="text-[var(--font-size-body)] font-semibold">{data.cpuRequest}</dd>
        </div>
        <div>
          <dt className="text-[var(--font-size-caption)] text-[var(--color-text-secondary)]">
            Memory Usage
          </dt>
          <dd className="text-[var(--font-size-body)] font-semibold">{data.memoryUsage}</dd>
        </div>
        <div>
          <dt className="text-[var(--font-size-caption)] text-[var(--color-text-secondary)]">
            Memory Request
          </dt>
          <dd className="text-[var(--font-size-body)] font-semibold">{data.memoryRequest}</dd>
        </div>
        <div className="col-span-2 border-t border-[var(--color-border-subtle)] pt-[var(--space-3)]">
          <dt className="text-[var(--font-size-caption)] font-semibold uppercase tracking-wide text-[var(--color-accent-success-text)]">
            Estimated Savings
          </dt>
          <dd className="text-[length:var(--font-size-stat)] font-bold text-[var(--color-accent-success-text)]">
            <StatValue value={savingsCount} format={(n) => `$${n.toFixed(1)}/mo`} />
          </dd>
        </div>
      </dl>
    </motion.div>
  );
}
