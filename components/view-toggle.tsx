"use client";

import { LayoutGrid, List } from "lucide-react";

export type ViewMode = "grid" | "list";

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  const isGridView = viewMode === "grid";

  return (
    <>
      <button
        onClick={() => onViewModeChange(isGridView ? "list" : "grid")}
        className="flex sm:hidden items-center justify-center min-w-10 h-10 px-3 rounded-lg border border-border bg-secondary text-foreground hover:bg-accent transition-all"
        aria-label={isGridView ? "Switch to list view" : "Switch to thumbnail view"}
        title={isGridView ? "Switch to list view" : "Switch to thumbnail view"}
      >
        {isGridView ? (
          <LayoutGrid className="h-4 w-4" />
        ) : (
          <List className="h-4 w-4" />
        )}
      </button>

      <div className="hidden sm:flex items-center gap-1 bg-secondary rounded-lg p-1 border border-border">
        <button
          onClick={() => onViewModeChange("grid")}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
            viewMode === "grid"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-label="Thumbnail view"
        >
          <LayoutGrid className="h-4 w-4" />
          <span>Thumbnails</span>
        </button>
        <button
          onClick={() => onViewModeChange("list")}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
            viewMode === "list"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-label="List view"
        >
          <List className="h-4 w-4" />
          <span>List</span>
        </button>
      </div>
    </>
  );
}
