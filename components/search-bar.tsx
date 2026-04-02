"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface SearchBarProps {
  initialQuery?: string;
  size?: "large" | "normal";
  onSearch?: (query: string) => void;
  onFocusChange?: (focused: boolean) => void;
}

export function SearchBar({
  initialQuery = "",
  size = "normal",
  onSearch,
  onFocusChange,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query.trim());
    } else {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const isLarge = size === "large";

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <Search
          className={`absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground ${
            isLarge ? "h-5 w-5" : "h-4 w-4"
          }`}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => onFocusChange?.(true)}
          onBlur={() => onFocusChange?.(false)}
          placeholder="Find quality videos..."
          className={`w-full bg-secondary text-foreground placeholder:text-muted-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all ${
            isLarge ? "pl-12 pr-4 py-4 text-lg" : "pl-10 pr-4 py-3 text-base"
          }`}
        />
        <button
          type="submit"
          onMouseDown={(e) => e.preventDefault()}
          className={`absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground font-medium rounded-md hover:opacity-90 transition-opacity ${
            isLarge ? "px-6 py-2" : "px-4 py-1.5 text-sm"
          }`}
        >
          Search
        </button>
      </div>
    </form>
  );
}
