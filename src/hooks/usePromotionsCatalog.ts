"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PromotionsResponse } from "@/app/api/promotions/route";
import { fetchPromotions, PromotionsClientError } from "@/lib/promotionsClient";

type CatalogState = {
  data: PromotionsResponse | null;
  loading: boolean;
  error: string | null;
};

let sharedInitial: Promise<PromotionsResponse> | null = null;

function getInitialFetch(): Promise<PromotionsResponse> {
  if (!sharedInitial) {
    sharedInitial = fetchPromotions(false).finally(() => {
      sharedInitial = null;
    });
  }
  return sharedInitial;
}

export function usePromotionsCatalog(enabled: boolean) {
  const [s, setS] = useState<CatalogState>({ data: null, loading: false, error: null });
  const mounted = useRef(true);
  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(
    async (refresh: boolean) => {
      if (!enabled) return;
      if (!mounted.current) return;
      setS((p) => ({ ...p, loading: true, error: null }));
      try {
        const data = refresh ? await fetchPromotions(true) : await getInitialFetch();
        if (mounted.current) setS({ data, loading: false, error: null });
      } catch (e) {
        const msg =
          e instanceof PromotionsClientError
            ? e.message
            : e instanceof Error
              ? e.message
              : "Network error";
        if (mounted.current) setS({ data: null, loading: false, error: msg });
      }
    },
    [enabled]
  );

  useEffect(() => {
    if (!enabled) {
      setS({ data: null, loading: false, error: null });
      return;
    }
    void load(false);
  }, [enabled, load]);

  const refresh = useCallback(() => {
    void load(true);
  }, [load]);

  return { ...s, refresh };
}
