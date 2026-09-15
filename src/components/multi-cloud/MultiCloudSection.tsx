"use client";

import { useRef } from "react";
import { motion, useMotionValue, useScroll, useTransform, type HTMLMotionProps } from "framer-motion";
import { SectionIntro } from "./SectionIntro";
import { CloudProviderNode } from "./CloudProviderNode";
import { ConnectionLayer } from "./ConnectionLayer";
import { ResourceVisualization } from "./ResourceVisualization";
import { SavingsDetail } from "./SavingsDetail";
import { Button } from "@/components/ui/Button";
import { useCloudMetrics } from "@/hooks/useCloudMetrics";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { isLeftColumnProvider } from "@/lib/providerLayout";
import { STAGE } from "@/lib/scrollStages";
import { easeOutExpo } from "@/tokens/tokens";
import type { MotionValue } from "framer-motion";

function CompositionSkeleton() {
  return (
    <div className="w-full rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-[var(--space-6)]">
      <div className="grid w-full grid-cols-1 place-items-center gap-4 md:grid-cols-2 xl:grid-cols-3 xl:grid-rows-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 w-24 animate-pulse rounded-[var(--radius-lg)] bg-[var(--color-bg-muted)]"
          />
        ))}
        <div className="h-40 w-full max-w-md animate-pulse rounded-[var(--radius-md)] bg-[var(--color-bg-muted)] md:col-span-2 xl:col-span-1" />
      </div>
    </div>
  );
}

function CompositionError({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="mx-auto flex w-full max-w-md flex-col items-center gap-[var(--space-4)] rounded-[var(--radius-lg)] border border-[var(--color-accent-error)]/30 bg-[var(--color-bg-surface)] p-[var(--space-6)] text-center"
    >
      <p className="text-[var(--font-size-body)] text-[var(--color-text-primary)]">
        We couldn&rsquo;t load live cloud metrics right now.
      </p>
      <Button onClick={onRetry}>Retry</Button>
    </div>
  );
}

/** A single real bridge between the canvas panel and the savings card,
 * filling the actual gap between them so the relationship reads as one
 * continuous connection rather than a line fragment floating near either
 * element (see Manual Visual QA Corrections — Round 3). */
function DetailBridge({ progress, alignEnd }: { progress: MotionValue<number>; alignEnd: boolean }) {
  const [start, end] = STAGE.detail;
  const scaleY = useTransform(progress, [start, start + 0.06], [0, 1]);
  const opacity = useTransform(progress, [start, start + 0.02], [0, 1]);

  return (
    <div className={`flex h-6 w-full md:h-8 ${alignEnd ? "justify-end md:pe-[9%]" : "justify-start md:ps-[9%]"}`}>
      <motion.div
        aria-hidden="true"
        style={{ scaleY, opacity, transformOrigin: "top" }}
        className="w-0.5 bg-[var(--color-accent-success)]"
      />
    </div>
  );
}

const revealVariants: HTMLMotionProps<"div"> = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.5, ease: easeOutExpo },
};

export function MultiCloudSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, isError, refetch } = useCloudMetrics();

  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isMobile = useMediaQuery("(max-width: 767px)");
  const simplified = prefersReducedMotion || isMobile;

  // wrapperRef's element is rendered unconditionally below — including during
  // loading/error — specifically so this ref is always attached before
  // Framer Motion's useScroll effect runs. A ref that's defined but never
  // mounted (e.g. only inside a `{data && ...}` branch) throws
  // "Target ref is defined but not hydrated" — confirmed from an actual
  // browser session in this project; see the Phase 2 report's Manual Visual
  // QA Corrections for the exact captured error and root-cause trace.
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });
  const settledProgress = useMotionValue(1);
  const progress = simplified ? settledProgress : scrollYProgress;

  const revealProps = simplified ? revealVariants : {};

  const targetProviderId = data?.savings.targetProviderId;
  const pointsLeft = targetProviderId ? isLeftColumnProvider(targetProviderId) : true;
  const detailOffsetClass = pointsLeft ? "md:self-start md:ms-[6%]" : "md:self-end md:me-[6%]";

  return (
    <section aria-labelledby="multicloud-heading" className="relative">
      <SectionIntro />

      <div className="mx-auto flex max-w-4xl flex-col items-center px-[var(--space-4)] pb-[var(--space-8)]">
        <div ref={wrapperRef} className={simplified ? "relative w-full" : "relative w-full h-[400vh]"}>
          <div
            className={
              simplified
                ? "flex flex-col items-center gap-[var(--space-5)]"
                : "sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden"
            }
          >
            {isLoading && <CompositionSkeleton />}
            {isError && !isLoading && <CompositionError onRetry={() => refetch()} />}

            {data && !isLoading && !isError && (
              <>
                {/* One shared canvas: provider nodes, connectors, and the
                    chart all live on the same surface so they read as one
                    visualization rather than separate floating cards. */}
                <motion.div
                  {...revealProps}
                  className="relative w-full rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-[var(--space-4)] shadow-sm md:p-[var(--space-5)]"
                >
                  <div className="relative grid w-full grid-cols-1 place-items-center gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-[1fr_1.3fr_1fr] xl:grid-rows-3 xl:gap-3">
                    <ConnectionLayer progress={progress} />

                    <div className="xl:col-start-1 xl:row-start-1">
                      <CloudProviderNode
                        provider={data.providers[0]!}
                        progress={progress}
                        index={0}
                        total={data.providers.length}
                        highlighted={data.providers[0]!.id === data.savings.targetProviderId}
                        emphasizedGlyphIndex={0}
                      />
                    </div>
                    <div className="xl:col-start-3 xl:row-start-1">
                      <CloudProviderNode
                        provider={data.providers[1]!}
                        progress={progress}
                        index={1}
                        total={data.providers.length}
                        highlighted={data.providers[1]!.id === data.savings.targetProviderId}
                        emphasizedGlyphIndex={0}
                      />
                    </div>
                    <div className="xl:col-start-1 xl:row-start-3">
                      <CloudProviderNode
                        provider={data.providers[2]!}
                        progress={progress}
                        index={2}
                        total={data.providers.length}
                        highlighted={data.providers[2]!.id === data.savings.targetProviderId}
                        emphasizedGlyphIndex={0}
                      />
                    </div>
                    <div className="xl:col-start-3 xl:row-start-3">
                      <CloudProviderNode
                        provider={data.providers[3]!}
                        progress={progress}
                        index={3}
                        total={data.providers.length}
                        highlighted={data.providers[3]!.id === data.savings.targetProviderId}
                        emphasizedGlyphIndex={0}
                      />
                    </div>

                    <div className="md:col-span-2 xl:col-span-1 xl:col-start-2 xl:row-start-2">
                      <ResourceVisualization metrics={data.metrics} progress={progress} />
                    </div>
                  </div>
                </motion.div>

                <DetailBridge progress={progress} alignEnd={!pointsLeft} />

                <motion.div {...revealProps} className={`w-full max-w-sm ${detailOffsetClass}`}>
                  <SavingsDetail data={data.savings} progress={progress} />
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
