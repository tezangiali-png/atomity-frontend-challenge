"use client";

import { motion } from "framer-motion";
import { easeOutExpo } from "@/tokens/tokens";

export function SectionIntro() {
  return (
    <header className="mx-auto max-w-2xl px-[var(--space-4)] pb-[var(--space-6)] pt-[var(--space-8)] text-center">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, ease: easeOutExpo }}
        className="mb-[var(--space-2)] text-[var(--font-size-caption)] font-semibold uppercase tracking-wide text-[var(--color-accent-success-text)]"
      >
        Multi-Cloud Cost Intelligence
      </motion.p>
      <motion.h2
        id="multicloud-heading"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, delay: 0.08, ease: easeOutExpo }}
        className="text-[length:var(--font-size-h2)] font-semibold leading-tight"
      >
        See every provider&rsquo;s spend before it surprises you.
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, delay: 0.16, ease: easeOutExpo }}
        className="mt-[var(--space-3)] text-[var(--font-size-body)] text-[var(--color-text-secondary)]"
      >
        Scroll to watch four providers resolve into one shared view of resource
        cost, down to the exact workload that&rsquo;s worth resizing.
      </motion.p>
    </header>
  );
}
