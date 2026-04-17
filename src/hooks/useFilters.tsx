"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getParams = () => new URLSearchParams(searchParams.toString());

  const updateFilters = useCallback(
    (newParams: Record<string, string | null>) => {
      const params = getParams();
      let changed = false;

      Object.entries(newParams).forEach(([key, value]) => {
        // Don't trim numbers - preserve exact value
        const val = value?.trim === undefined ? value : value?.trim?.();
        const current = params.get(key) || "";

        if (!val || val === "all") {
          if (params.has(key)) {
            params.delete(key);
            changed = true;
          }
        } else {
          if (String(val) !== current) {
            params.set(key, String(val));
            changed = true;
          }
        }
      });
      
      if (changed) {
        // Reset to page 1 when filters change
        params.set("page", "1");
        router.push(`?${params.toString()}`, { scroll: false });
      }
    },
    [searchParams, router]
  );
  
  const clearFilters = useCallback(() => {
    router.push(window.location.pathname);
  }, [router]);

  return {
    searchParams,
    updateFilters,
    clearFilters,
  };
};