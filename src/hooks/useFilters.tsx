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
        const val = value?.trim();
        const current = params.get(key) || "";

        if (!val || val === "all") {
          if (params.has(key)) {
            params.delete(key);
            changed = true;
          }
        } else {
          if (val !== current) {
            params.set(key, val);
            changed = true;
          }
        }
      });
      if(changed){
        // params.set("page", "1")
      router.push(`?${params.toString()}`, {scroll: false})
    }
    },[searchParams]

    
  );
  const clearFilters = useCallback(() => {
    router.push(window.location.pathname);
  }, []);

  return {
    searchParams,
    updateFilters,
    clearFilters,
  };
};
