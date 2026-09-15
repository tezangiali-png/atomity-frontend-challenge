"use client";

import { useSyncExternalStore } from "react";

/**
 * Single generic media-query hook, reused for both the reduced-motion check
 * and the mobile-layout check — one small abstraction instead of two
 * near-identical hooks. Uses useSyncExternalStore (rather than
 * useState+useEffect) since matchMedia is exactly the kind of external,
 * subscribable browser API that hook exists for.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener("change", onChange);
      return () => mediaQueryList.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
