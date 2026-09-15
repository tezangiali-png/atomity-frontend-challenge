export type ProviderId = "aws" | "azure" | "gcp" | "onprem";

export interface ResourceGlyphDatum {
  id: string;
  lit: boolean;
}

export interface ProviderDatum {
  id: ProviderId;
  name: string;
  glyphs: ResourceGlyphDatum[];
}

export type MetricKey = "cpu" | "gpu" | "ram" | "pv" | "network" | "cloud";

export interface ResourceMetricDatum {
  key: MetricKey;
  label: string;
  /** 0-100, normalized against the largest fetched value, drives bar height */
  value: number;
  /** the actual fetched-and-transformed dollar figure shown to the user */
  displayValue: number;
}

export interface SavingsDetailData {
  cpuUsage: string;
  cpuRequest: string;
  memoryUsage: string;
  memoryRequest: string;
  estimatedSavings: number;
  targetProviderId: ProviderId;
}

export interface CloudMetricsData {
  providers: ProviderDatum[];
  metrics: ResourceMetricDatum[];
  savings: SavingsDetailData;
}
