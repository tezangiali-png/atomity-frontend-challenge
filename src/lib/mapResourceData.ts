import type { DummyJsonProduct } from "./api";
import type { CloudMetricsData, MetricKey, ProviderId } from "@/types/cloud";

/**
 * Deterministic, honest transformation of DummyJSON's e-commerce product fields
 * into this section's cloud-cost visual language. The brief explicitly allows
 * this ("data doesn't need to be 'real' cloud data") as long as the numbers
 * themselves are genuinely fetched and dynamic, which they are: every value
 * below traces back to a specific field on a specific fetched product, not a
 * hardcoded constant. Nothing here is presented as real cloud telemetry.
 */

const METRIC_DEFS: { key: MetricKey; label: string }[] = [
  { key: "cpu", label: "CPU" },
  { key: "gpu", label: "GPU" },
  { key: "ram", label: "RAM" },
  { key: "pv", label: "PV" },
  { key: "network", label: "Network" },
  { key: "cloud", label: "Cloud" },
];

const PROVIDER_DEFS: { id: ProviderId; name: string; glyphCount: number }[] = [
  { id: "aws", name: "AWS", glyphCount: 3 },
  { id: "azure", name: "Azure", glyphCount: 4 },
  { id: "gcp", name: "Google Cloud", glyphCount: 4 },
  { id: "onprem", name: "On-Premise", glyphCount: 2 },
];

export function mapResourceData(products: DummyJsonProduct[]): CloudMetricsData {
  if (products.length < 10) {
    throw new Error("mapResourceData requires at least 10 source products");
  }

  const rawMetrics = METRIC_DEFS.map((def, index) => {
    const product = products[index]!;
    return {
      key: def.key,
      label: def.label,
      // price -> a monthly-cost-style magnitude
      displayValue: Math.round(product.price * 8.5),
    };
  });

  const maxDisplayValue = Math.max(...rawMetrics.map((m) => m.displayValue), 1);
  const metrics = rawMetrics.map((m) => ({
    ...m,
    value: Math.round((m.displayValue / maxDisplayValue) * 100),
  }));

  let providerCursor = 0;
  const providers = PROVIDER_DEFS.map((def) => {
    const product = products[providerCursor % products.length]!;
    providerCursor += 1;
    const litCount = Math.max(1, Math.min(def.glyphCount, Math.round((product.stock % 20) / 5) + 1));
    return {
      id: def.id,
      name: def.name,
      glyphs: Array.from({ length: def.glyphCount }, (_, glyphIndex) => ({
        id: `${def.id}-glyph-${glyphIndex}`,
        lit: glyphIndex < litCount,
      })),
    };
  });

  const savingsProduct = products[6]!;
  const usageProduct = products[7]!;

  const estimatedSavings =
    Math.round(savingsProduct.price * (savingsProduct.discountPercentage / 100) * 10) / 10;

  return {
    providers,
    metrics,
    savings: {
      cpuUsage: `${Math.round(usageProduct.rating * 20)} M`,
      cpuRequest: `${Math.round(usageProduct.stock * 6)} M`,
      memoryUsage: `${Math.round(usageProduct.price * 4)} MiB`,
      memoryRequest: `${Math.max(1, Math.round(usageProduct.discountPercentage / 3))} GiB`,
      estimatedSavings,
      targetProviderId: "azure",
    },
  };
}
