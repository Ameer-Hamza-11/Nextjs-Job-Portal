"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useFilters } from "@/hooks/useFilters";

import React from "react";
import { organizationTypes } from "@/features/employers/employers.schema";

const EmployerFilters = () => {
  const { searchParams, updateFilters, clearFilters } = useFilters();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [organizationType, setOrganizationType] = useState(
    searchParams.get("organizationType") || ""
  );
  
  useEffect(() => {
    const t = setTimeout(() => updateFilters({ search }), 500);     
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="space-y-4 rounded-xl bg-white p-4 shadow-sm border border-gray-100">
      {/* --- Row 1: Search --- */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search by company name..."
          className="pl-10 h-11 bg-gray-50/50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* --- Row 2: Filters --- */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Job Type Dropdown */}
        <Select
          value={organizationType}
          onValueChange={(val) => {
            setOrganizationType(val);
            updateFilters({ organizationType: val });
          }}
        >
          <SelectTrigger className="w-[160px] h-9 text-xs">
            <SelectValue placeholder="Industry Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {organizationTypes.map((type) => (
              <SelectItem key={type} value={type} className="capitalize">
                {type.replace(/-/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset Button (Only show if filters are active) */}
        {(search || organizationType) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="ml-auto text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <X className="mr-2 h-3 w-3" />
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmployerFilters;
