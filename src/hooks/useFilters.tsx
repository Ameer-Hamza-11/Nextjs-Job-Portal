"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";

export const useFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isUpdating = useRef(false);

  const getParams = () => new URLSearchParams(searchParams.toString());

  const updateFilters = useCallback(
    (newParams: Record<string, string | number | null>) => {
      // Prevent multiple rapid updates
      if (isUpdating.current) return;
      
      const params = getParams();
      let changed = false;

      Object.entries(newParams).forEach(([key, value]) => {
        let val: string | null = null;
        if (value !== null && value !== undefined) {
          val = String(value);
        }
        
        const current = params.get(key) || "";

        if (!val || val === "all" || val === "null") {
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
      
      if (changed) {
        isUpdating.current = true;
        params.set("page", "1");
        router.push(`?${params.toString()}`, { scroll: false });
        
        // Reset the flag after a short delay
        setTimeout(() => {
          isUpdating.current = false;
        }, 100);
      }
    },
    [searchParams, router]
  );
  
  const clearFilters = useCallback(() => {
    isUpdating.current = true;
    router.push(window.location.pathname);
    setTimeout(() => {
      isUpdating.current = false;
    }, 100);
  }, [router]);

  return {
    searchParams,
    updateFilters,
    clearFilters,
  };
};