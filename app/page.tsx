"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/search-bar";
import { CountPicker } from "@/components/count-picker";
import { Focus } from "lucide-react";

export default function HomePage() {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [count, setCount] = useState(20);
  const router = useRouter();

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}&count=${count}`);
  };

  return (
    <main
      className={`min-h-screen flex flex-col items-center px-4 py-12 transition-all duration-300 ease-out ${
        isInputFocused
          ? "justify-start pt-8 sm:justify-center sm:pt-12"
          : "justify-center -mt-16 sm:-mt-8 md:mt-0"
      }`}
    >
      <div className="w-full max-w-2xl mx-auto space-y-8">
        {/* Logo and Title */}
        <div
          className={`text-center space-y-4 transition-all duration-300 ease-out ${
            isInputFocused
              ? "sm:opacity-100 opacity-0 h-0 sm:h-auto overflow-hidden sm:overflow-visible"
              : "opacity-100"
          }`}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-primary rounded-xl">
              <Focus className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground text-balance">
            FocusTube
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto text-pretty">
            Search for videos without distractions. No recommendations, no
            feeds, just focus.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full">
          <SearchBar
            size="large"
            onSearch={handleSearch}
            onFocusChange={setIsInputFocused}
          />
        </div>

        {/* Count picker — desktop zawsze widoczny, mobile tylko gdy input focused */}
        <div className="hidden sm:block">
          <CountPicker count={count} onChange={setCount} visible />
        </div>
        <div className="sm:hidden">
          <CountPicker
            count={count}
            onChange={setCount}
            visible={isInputFocused}
          />
        </div>

        {/* Subtle hint */}
        <p
          className={`text-center text-sm text-muted-foreground transition-opacity duration-300 ${
            isInputFocused ? "opacity-0 sm:opacity-100" : "opacity-100"
          }`}
        >
          <span className="hidden sm:inline">
            Press Enter or click Search to find educational content
          </span>
          <span className="sm:hidden">Tap Search to find videos</span>
        </p>
      </div>

      {/* Footer */}
      <footer
        className={`absolute bottom-0 left-0 right-0 py-6 text-center text-xs text-muted-foreground transition-opacity duration-300 ${
          isInputFocused ? "opacity-0 sm:opacity-100" : "opacity-100"
        }`}
      >
        <p>A distraction-free video search experience</p>
      </footer>
    </main>
  );
}
