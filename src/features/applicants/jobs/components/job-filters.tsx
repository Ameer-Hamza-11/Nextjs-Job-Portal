"use client";

import { useEffect, useState } from "react";
import { Search, X, Filter, DollarSign, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JOB_TYPE, WORK_TYPE, JOB_LEVEL } from "@/config/constant";
import { useFilters } from "@/hooks/useFilters";
import { useJobAlerts } from "@/hooks/useJobAlerts";
import { toast } from "sonner";

export const JobFilters = () => {
  const { searchParams, updateFilters, clearFilters } = useFilters();
  const { createAlert } = useJobAlerts();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [jobType, setJobType] = useState(searchParams.get("jobType") || "");
  const [jobLevel, setJobLevel] = useState(searchParams.get("jobLevel") || "");
  const [workType, setWorkType] = useState(searchParams.get("workType") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [minSalary, setMinSalary] = useState(searchParams.get("minSalary") || "");
  const [maxSalary, setMaxSalary] = useState(searchParams.get("maxSalary") || "");

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => updateFilters({ search }), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Handle immediate filter updates for selects
  const handleJobTypeChange = (val: string) => {
    const newValue = val === "all" ? "" : val;
    setJobType(newValue);
    updateFilters({ jobType: newValue });
  };

  const handleJobLevelChange = (val: string) => {
    const newValue = val === "all" ? "" : val;
    setJobLevel(newValue);
    updateFilters({ jobLevel: newValue });
  };

  const handleWorkTypeChange = (val: string) => {
    const newValue = val === "all" ? "" : val;
    setWorkType(newValue);
    updateFilters({ workType: newValue });
  };

  const handleLocationChange = (val: string) => {
    const newValue = val === "all" ? "" : val;
    setLocation(newValue);
    updateFilters({ location: newValue });
  };

  const handleSalaryChange = () => {
    updateFilters({ minSalary, maxSalary });
  };

  const handleClearAll = () => {
    setSearch("");
    setJobType("");
    setJobLevel("");
    setWorkType("");
    setLocation("");
    setMinSalary("");
    setMaxSalary("");
    clearFilters();
    setIsMobileFiltersOpen(false);
  };

  const hasActiveFilters = !!(search || jobType || jobLevel || workType || location || minSalary || maxSalary);

  const FilterContent = () => (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search by title, skill, or company..."
          className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Salary Range */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Salary Range</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="number"
              placeholder="Min"
              min={0}
              className="pl-10 h-11 bg-gray-50"
              value={minSalary}
              onChange={(e) => {
                setMinSalary(e.target.value);
                handleSalaryChange();
              }}
            />
          </div>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="number"
              placeholder="Max"
              min={0}
              className="pl-10 h-11 bg-gray-50"
              value={maxSalary}
              onChange={(e) => {
                setMaxSalary(e.target.value);
                handleSalaryChange();
              }}
            />
          </div>
        </div>
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Select value={jobType || "all"} onValueChange={handleJobTypeChange}>
          <SelectTrigger className="h-11 bg-gray-50 text-sm">
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {JOB_TYPE.map((type) => (
              <SelectItem key={type} value={type} className="capitalize">
                {type.replace(/-/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={jobLevel || "all"} onValueChange={handleJobLevelChange}>
          <SelectTrigger className="h-11 bg-gray-50 text-sm">
            <SelectValue placeholder="Job Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {JOB_LEVEL.map((level) => (
              <SelectItem key={level} value={level} className="capitalize">
                {level.replace(/-/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={workType || "all"} onValueChange={handleWorkTypeChange}>
          <SelectTrigger className="h-11 bg-gray-50 text-sm">
            <SelectValue placeholder="Work Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Work Styles</SelectItem>
            {WORK_TYPE.map((type) => (
              <SelectItem key={type} value={type} className="capitalize">
                {type.replace(/-/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={location || "all"} onValueChange={handleLocationChange}>
          <SelectTrigger className="h-11 bg-gray-50 text-sm">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            <SelectItem value="Karachi">Karachi</SelectItem>
            <SelectItem value="Lahore">Lahore</SelectItem>
            <SelectItem value="Islamabad">Islamabad</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button
          size="default"
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          onClick={() => setIsMobileFiltersOpen(false)}
        >
          <Search className="h-4 w-4" />
          Apply Filters
        </Button>

        <Button
          variant="outline"
          size="default"
          className="gap-2 border-green-200 text-green-600 hover:bg-green-50"
          onClick={() => {
            createAlert({
              keywords: search || null,
              location: location || null,
              jobType: jobType || null,
              jobLevel: jobLevel || null,
              workType: workType || null,
            });
            toast.success("Job alert created successfully!");
          }}
        >
          <Filter className="h-4 w-4" />
          Save Job Alert
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="default"
            onClick={handleClearAll}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filters - Custom Modal (No Sheet component) */}
      <div className="block lg:hidden">
        <Button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 gap-2 h-12"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters & Sorting
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs">
              Active
            </span>
          )}
        </Button>

        {/* Mobile Filter Modal */}
        {isMobileFiltersOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsMobileFiltersOpen(false)}
            />
            
            {/* Modal Panel */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-xl transform transition-transform duration-300 ease-out">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-5 overflow-y-auto max-h-[70vh]">
                <FilterContent />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};