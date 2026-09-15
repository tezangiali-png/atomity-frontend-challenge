"use client";

import { useState } from "react";
import { type MotionValue, useMotionValueEvent } from "framer-motion";

interface StatValueProps {
  value: MotionValue<number>;
  format?: (n: number) => string;
  className?: string;
}

/** Renders a MotionValue<number> as live text — the shared count-up primitive
 * used by both the chart bars and the savings detail card. */
export function StatValue({ value, format, className }: StatValueProps) {
  const [display, setDisplay] = useState(() => value.get());

  useMotionValueEvent(value, "change", (latest) => {
    setDisplay(latest);
  });

  const text = format ? format(display) : Math.round(display).toString();

  return <span className={className}>{text}</span>;
}
