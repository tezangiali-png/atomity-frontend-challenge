interface BadgeProps {
  children: React.ReactNode;
  tone?: "neutral" | "success";
}

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  const toneClass =
    tone === "success"
      ? "bg-[var(--color-accent-success)] text-[#0e0f11]"
      : "bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)]";

  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-pill)] px-[var(--space-3)] py-[var(--space-1)] text-[var(--font-size-caption)] font-medium ${toneClass}`}
    >
      {children}
    </span>
  );
}
