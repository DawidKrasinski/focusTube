import { NextRequest, NextResponse } from "next/server";
import type { Video } from "@/lib/types";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

function parseIsoDuration(iso: string): { formatted: string; seconds: number } {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return { formatted: "0:00", seconds: 0 };
  const hours = parseInt(match[1] || "0");
  const minutes = parseInt(match[2] || "0");
  const seconds = parseInt(match[3] || "0");
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  if (hours > 0) {
    return {
      formatted: `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
      seconds: totalSeconds,
    };
  }
  return {
    formatted: `${minutes}:${String(seconds).padStart(2, "0")}`,
    seconds: totalSeconds,
  };
}

function formatUploadDate(publishedAt: string): string {
  const now = new Date();
  const published = new Date(publishedAt);
  const diffDays = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

function formatViewCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M views`;
  if (count >= 1_000) return `${Math.round(count / 1_000)}K views`;
  return `${count} views`;
}

export async function GET(request: NextRequest) {
  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === "your_youtube_api_key_here") {
    return NextResponse.json(
      { error: "YouTube API key not configured. Set YOUTUBE_API_KEY in .env.local" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const duration = searchParams.get("duration") || "any";
  const uploadDate = searchParams.get("uploadDate") || "any";

  if (!query?.trim()) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  // Build YouTube search params
  const params = new URLSearchParams({
    part: "snippet",
    q: query.trim(),
    type: "video",
    maxResults: "20",
    key: YOUTUBE_API_KEY,
  });

  if (duration === "short") params.set("videoDuration", "short");   // < 4 min
  else if (duration === "medium") params.set("videoDuration", "medium"); // 4–20 min
  else if (duration === "long") params.set("videoDuration", "long");    // > 20 min

  if (uploadDate !== "any") {
    const now = new Date();
    let publishedAfter: Date | null = null;
    if (uploadDate === "hour") publishedAfter = new Date(now.getTime() - 60 * 60 * 1000);
    else if (uploadDate === "today") {
      const d = new Date(now);
      d.setHours(0, 0, 0, 0);
      publishedAfter = d;
    } else if (uploadDate === "week") publishedAfter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    else if (uploadDate === "month") publishedAfter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    else if (uploadDate === "year") publishedAfter = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    if (publishedAfter) params.set("publishedAfter", publishedAfter.toISOString());
  }

  // Step 1: Search for videos
  const searchRes = await fetch(`${YOUTUBE_API_BASE}/search?${params.toString()}`);
  if (!searchRes.ok) {
    const err = await searchRes.json().catch(() => ({}));
    return NextResponse.json({ error: err }, { status: searchRes.status });
  }
  const searchData = await searchRes.json();
  const items: any[] = (searchData.items || []).filter((item: any) => item.id?.videoId);

  if (items.length === 0) {
    return NextResponse.json({ videos: [] });
  }

  // Step 2: Fetch durations + view counts for found videos
  const videoIds = items.map((item) => item.id.videoId).join(",");
  const videosParams = new URLSearchParams({
    part: "contentDetails,statistics",
    id: videoIds,
    key: YOUTUBE_API_KEY,
  });

  const videosRes = await fetch(`${YOUTUBE_API_BASE}/videos?${videosParams.toString()}`);
  const videosData = videosRes.ok ? await videosRes.json() : { items: [] };

  const durationMap = new Map<string, { formatted: string; seconds: number }>();
  const viewsMap = new Map<string, string>();
  for (const item of videosData.items || []) {
    durationMap.set(item.id, parseIsoDuration(item.contentDetails?.duration || "PT0S"));
    const viewCount = parseInt(item.statistics?.viewCount || "0");
    viewsMap.set(item.id, formatViewCount(viewCount));
  }

  // Map YouTube results to Video type
  const videos: Video[] = items.map((item) => {
    const videoId: string = item.id.videoId;
    const dur = durationMap.get(videoId) || { formatted: "0:00", seconds: 0 };
    return {
      id: videoId,
      title: item.snippet.title,
      description: item.snippet.description || "",
      duration: dur.formatted,
      durationSeconds: dur.seconds,
      uploadDate: formatUploadDate(item.snippet.publishedAt),
      uploadDateISO: item.snippet.publishedAt,
      channel: item.snippet.channelTitle,
      views: viewsMap.get(videoId) || "N/A",
      thumbnailUrl:
        item.snippet.thumbnails?.medium?.url ||
        item.snippet.thumbnails?.default?.url ||
        undefined,
      videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
    };
  });

  return NextResponse.json({ videos });
}
