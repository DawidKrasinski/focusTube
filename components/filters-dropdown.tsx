"use client";

import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import type { DurationFilter, UploadDateFilter } from "@/lib/mock-data";

interface FiltersDropdownProps {
  duration: DurationFilter;
  uploadDate: UploadDateFilter;
  onDurationChange: (duration: DurationFilter) => void;
  onUploadDateChange: (uploadDate: UploadDateFilter) => void;
}

export function FiltersDropdown({
  duration,
  uploadDate,
  onDurationChange,
  onUploadDateChange,
}: FiltersDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hasActiveFilters = duration !== "any" || uploadDate !== "any";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearFilters = () => {
    onDurationChange("any");
    onUploadDateChange("any");
  };

  const durationOptions: { value: DurationFilter; label: string }[] = [
    { value: "any", label: "Any duration" },
    { value: "short", label: "Short (< 4 min)" },
    { value: "medium", label: "Medium (4-20 min)" },
    { value: "long", label: "Long (> 20 min)" },
  ];

  const uploadDateOptions: { value: UploadDateFilter; label: string }[] = [
    { value: "any", label: "Any time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This week" },
    { value: "year", label: "This year" },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all text-sm font-medium ${
          hasActiveFilters
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-secondary text-foreground border-border hover:bg-accent"
        }`}
      >
        <SlidersHorizontal className="h-4 w-4" />
        <span>Filters</span>
        {hasActiveFilters && (
          <span className="bg-primary-foreground text-primary text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {(duration !== "any" ? 1 : 0) + (uploadDate !== "any" ? 1 : 0)}
          </span>
        )}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-card border border-border rounded-lg shadow-lg z-50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <X className="h-3 w-3" />
                Clear all
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Duration
              </label>
              <div className="grid grid-cols-2 gap-2">
                {durationOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onDurationChange(option.value)}
                    className={`px-3 py-2 text-sm rounded-md border transition-all ${
                      duration === option.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary text-foreground border-border hover:bg-accent"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Upload date
              </label>
              <div className="grid grid-cols-2 gap-2">
                {uploadDateOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onUploadDateChange(option.value)}
                    className={`px-3 py-2 text-sm rounded-md border transition-all ${
                      uploadDate === option.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary text-foreground border-border hover:bg-accent"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
