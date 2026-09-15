import type { ProviderId } from "@/types/cloud";

/**
 * The provider grid places aws/gcp in the left column and azure/onprem in
 * the right column (see MultiCloudSection's xl:col-start placements). This
 * is the single place that mapping is expressed, so the savings card's
 * leader-line direction and its horizontal offset always agree with the
 * actual grid position instead of being guessed independently in two files.
 */
const LEFT_COLUMN: ProviderId[] = ["aws", "gcp"];

export function isLeftColumnProvider(id: ProviderId): boolean {
  return LEFT_COLUMN.includes(id);
}
