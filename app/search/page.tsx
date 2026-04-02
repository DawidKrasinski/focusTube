"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Focus } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { FiltersDropdown } from "@/components/filters-dropdown";
import { ViewToggle, type ViewMode } from "@/components/view-toggle";
import { VideoCard, VideoCardSkeleton } from "@/components/video-card";
import {
  VideoListItem,
  VideoListItemSkeleton,
} from "@/components/video-list-item";
import { type Video, type DurationFilter, type UploadDateFilter } from "@/lib/mock-data";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [duration, setDuration] = useState<DurationFilter>("any");
  const [uploadDate, setUploadDate] = useState<UploadDateFilter>("any");
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setVideos([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    const params = new URLSearchParams({ q: query, duration, uploadDate });
    fetch(`/api/search?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(JSON.stringify(data.error));
        setVideos(data.videos || []);
      })
      .catch(() => setError("Nie udało się pobrać filmów. Sprawdź klucz API i spróbuj ponownie."))
      .finally(() => setIsLoading(false));
  }, [query, duration, uploadDate]);

  const handleSearch = (newQuery: string) => {
    router.push(`/search?q=${encodeURIComponent(newQuery)}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Logo and Search */}
            <div className="flex items-center gap-4 flex-1">
              <Link
                href="/"
                className="flex items-center gap-2 shrink-0 group"
                aria-label="Back to home"
              >
                <div className="p-2 bg-primary rounded-lg group-hover:opacity-90 transition-opacity">
                  <Focus className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-semibold text-foreground hidden sm:inline">
                  FocusTube
                </span>
              </Link>
              <div className="flex-1 max-w-xl">
                <SearchBar initialQuery={query} onSearch={handleSearch} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-6 w-full">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <FiltersDropdown
              duration={duration}
              uploadDate={uploadDate}
              onDurationChange={setDuration}
              onUploadDateChange={setUploadDate}
            />
            {!isLoading && !error && (
              <span className="text-sm text-muted-foreground">
                {videos.length} result
                {videos.length !== 1 ? "s" : ""}
                {query && (
                  <span>
                    {" "}
                    for{" "}
                    <span className="text-foreground font-medium">
                      &quot;{query}&quot;
                    </span>
                  </span>
                )}
              </span>
            )}
          </div>
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>

        {/* Results */}
        {isLoading ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <VideoCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="max-w-3xl">
              {Array.from({ length: 6 }).map((_, i) => (
                <VideoListItemSkeleton key={i} />
              ))}
            </div>
          )
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-destructive font-medium mb-2">{error}</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-muted-foreground mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No quality content found
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Try a different search term. My AI filters for educational content
              that teaches something meaningful.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="max-w-3xl">
            {videos.map((video) => (
              <VideoListItem key={video.id} video={video} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <p>
          Results filtered by AI for quality & educational value. No shorts, no
          clickbait, no distractions.
        </p>
      </footer>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageSkeleton />}>
      <SearchContent />
    </Suspense>
  );
}

function SearchPageSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-secondary rounded-lg">
              <div className="h-5 w-5" />
            </div>
            <div className="flex-1 max-w-xl h-12 bg-secondary rounded-lg animate-pulse" />
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto px-4 py-6 w-full">
        <div className="flex justify-between mb-6">
          <div className="h-10 w-32 bg-secondary rounded-lg animate-pulse" />
          <div className="h-10 w-48 bg-secondary rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
