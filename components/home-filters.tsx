"use client";

import type { DurationFilter, UploadDateFilter } from "@/lib/types";

interface HomeFiltersProps {
  duration: DurationFilter;
  uploadDate: UploadDateFilter;
  maxResults: number;
  onDurationChange: (duration: DurationFilter) => void;
  onUploadDateChange: (uploadDate: UploadDateFilter) => void;
  onMaxResultsChange: (maxResults: number) => void;
  isVisible: boolean;
}

export function HomeFilters({
  duration,
  uploadDate,
  maxResults,
  onDurationChange,
  onUploadDateChange,
  onMaxResultsChange,
  isVisible,
}: HomeFiltersProps) {
  const durationOptions: {
    value: DurationFilter;
    label: string;
    shortLabel: string;
  }[] = [
    { value: "any", label: "Any", shortLabel: "Any" },
    { value: "short", label: "Short", shortLabel: "Short" },
    { value: "medium", label: "Medium", shortLabel: "Medium" },
    { value: "long", label: "Long", shortLabel: "Long" },
  ];

  const uploadDateOptions: { value: UploadDateFilter; label: string }[] = [
    { value: "any", label: "Any time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This week" },
    { value: "year", label: "This year" },
  ];

  const resultSteps = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
  const sliderIndex = Math.max(0, resultSteps.indexOf(maxResults));

  return (
    <div
      className={`w-full space-y-4 transition-all duration-300 ease-out ${
        isVisible
          ? "opacity-100 max-h-96"
          : "opacity-0 max-h-0 overflow-hidden sm:opacity-100 sm:max-h-96"
      }`}
    >
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-muted-foreground text-left sm:text-center">
          Duration
        </label>
        <div className="flex justify-start sm:justify-center gap-2 flex-wrap">
          {durationOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onDurationChange(option.value)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                duration === option.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-foreground border-border hover:bg-accent"
              }`}
            >
              <span className="sm:hidden">{option.shortLabel}</span>
              <span className="hidden sm:inline">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-muted-foreground text-left sm:text-center">
          Upload date
        </label>
        <div className="flex justify-start sm:justify-center gap-2 flex-wrap">
          {uploadDateOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onUploadDateChange(option.value)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
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

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-muted-foreground text-left sm:text-center">
          Max results: <span className="text-foreground">{maxResults}</span>
        </label>
        <div className="flex justify-start sm:justify-center sm:px-4">
          <input
            type="range"
            min="0"
            max={String(resultSteps.length - 1)}
            step="1"
            value={sliderIndex}
            onChange={(e) =>
              onMaxResultsChange(resultSteps[Number(e.target.value)] ?? 10)
            }
            className="w-full max-w-xs h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground max-w-xs sm:mx-auto">
          <span>1</span>
          <span>50</span>
        </div>
      </div>
    </div>
  );
}
