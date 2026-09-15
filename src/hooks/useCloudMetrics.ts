"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCloudSourceData } from "@/lib/api";
import { mapResourceData } from "@/lib/mapResourceData";

export function useCloudMetrics() {
  return useQuery({
    queryKey: ["cloud-metrics"],
    queryFn: async () => {
      const products = await fetchCloudSourceData();
      return mapResourceData(products);
    },
  });
}
