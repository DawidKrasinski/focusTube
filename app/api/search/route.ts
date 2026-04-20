import { NextRequest, NextResponse } from "next/server";
import type { Video } from "@/lib/types";
import { filterVideos } from "@/lib/video-filter";

// Konfiguracja zewnętrznych usług.
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

// Zamienia czas z formatu YouTube ISO 8601 (`PT4M13S`) na czytelny string i sekundy.
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

// Pobiera komentarze dla filmów z YouTube API.
async function fetchCommentsForVideos(
  videoIds: string[],
  apiKey: string,
): Promise<Map<string, Comment[]>> {
  const commentsMap = new Map<string, Comment[]>();

  // Pobieramy komentarze dla maksymalnie 10 filmów, aby nie przekroczyć limitów API
  const videosToFetch = videoIds.slice(0, 10);

  for (const videoId of videosToFetch) {
    try {
      const commentsParams = new URLSearchParams({
        part: "snippet",
        videoId,
        key: apiKey,
        order: "relevance",
        maxResults: "10", // Maksymalnie 10 komentarzy na film
      });

      const commentsRes = await fetch(
        `${YOUTUBE_API_BASE}/commentThreads?${commentsParams.toString()}`,
        { cache: "no-store" },
      );

      if (commentsRes.ok) {
        const commentsData = await commentsRes.json();
        const comments: Comment[] = (commentsData.items || []).map(
          (item: any) => ({
            id: item.snippet.topLevelComment.id,
            author: item.snippet.topLevelComment.snippet.authorDisplayName,
            text: item.snippet.topLevelComment.snippet.textDisplay,
            date: formatCommentDate(
              item.snippet.topLevelComment.snippet.publishedAt,
            ),
            likes: item.snippet.topLevelComment.snippet.likeCount || 0,
          }),
        );
        commentsMap.set(videoId, comments);
      } else {
        // Jeśli nie można pobrać komentarzy (np. komentarze wyłączone), ustaw pustą tablicę
        commentsMap.set(videoId, []);
      }
    } catch (error) {
      console.warn(`Failed to fetch comments for video ${videoId}:`, error);
      commentsMap.set(videoId, []);
    }
  }

  return commentsMap;
}

// Formatuje datę komentarza do czytelnego formatu.
function formatCommentDate(publishedAt: string): string {
  const now = new Date();
  const published = new Date(publishedAt);
  const diffMs = now.getTime() - published.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;

  return `${Math.floor(diffDays / 365)}y ago`;
}

// Formatuje datę publikacji do prostego opisu względnego dla UI.
function formatUploadDate(publishedAt: string): string {
  const now = new Date();
  const published = new Date(publishedAt);
  const diffDays = Math.floor(
    (now.getTime() - published.getTime()) / (1000 * 60 * 60 * 24),
  );

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
  // Bez klucza nie jesteśmy w stanie pobrać wyników z YouTube API.
  if (!YOUTUBE_API_KEY) {
    return NextResponse.json(
      {
        error:
          "YouTube API key not configured. Set YOUTUBE_API_KEY in .env.local",
      },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const duration = searchParams.get("duration") || "any";
  const uploadDate = searchParams.get("uploadDate") || "any";
  const targetCount = Math.min(
    50,
    Math.max(1, Number(searchParams.get("count")) || 20),
  );

  if (!query?.trim()) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 },
    );
  }

  const trimmedQuery = query.trim();

  // Bazowe parametry wyszukiwania przekazywane do endpointu `/search` YouTube.
  const baseSearchParams = new URLSearchParams({
    part: "snippet",
    q: trimmedQuery,
    type: "video",
    order: "relevance",
    maxResults: "25",
    key: YOUTUBE_API_KEY,
  });

  if (duration === "short") {
    baseSearchParams.set("videoDuration", "short");
  } else if (duration === "medium") {
    baseSearchParams.set("videoDuration", "medium");
  } else if (duration === "long") {
    baseSearchParams.set("videoDuration", "long");
  }

  if (uploadDate !== "any") {
    const now = new Date();
    let publishedAfter: Date | null = null;

    if (uploadDate === "hour") {
      publishedAfter = new Date(now.getTime() - 60 * 60 * 1000);
    } else if (uploadDate === "today") {
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      publishedAfter = startOfDay;
    } else if (uploadDate === "week") {
      publishedAfter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (uploadDate === "month") {
      publishedAfter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (uploadDate === "year") {
      publishedAfter = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    }

    if (publishedAfter) {
      baseSearchParams.set("publishedAfter", publishedAfter.toISOString());
    }
  }

  // Zbieramy gotowe wyniki etapami i pilnujemy, żeby nie zwracać duplikatów.
  const collectedVideos: Video[] = [];
  const processedVideoIds = new Set<string>();
  let nextPageToken: string | null = "";

  // Pobieramy kolejne strony z YouTube aż uzbieramy docelową liczbę filmów.
  while (collectedVideos.length < targetCount && nextPageToken !== null) {
    const searchParamsPage = new URLSearchParams(baseSearchParams);
    if (nextPageToken) {
      searchParamsPage.set("pageToken", nextPageToken);
    }

    const searchRes = await fetch(
      `${YOUTUBE_API_BASE}/search?${searchParamsPage.toString()}`,
      { cache: "no-store" },
    );

    if (!searchRes.ok) {
      const err = await searchRes.json().catch(() => ({}));
      return NextResponse.json({ error: err }, { status: searchRes.status });
    }

    const searchData = await searchRes.json();
    nextPageToken = searchData.nextPageToken || null;

    const items: any[] = (searchData.items || []).filter(
      (item: any) => item.id?.videoId,
    );

    if (items.length === 0) {
      if (nextPageToken) {
        continue;
      }
      break;
    }

    // Drugi request do `/videos` daje nam statystyki i dokładny czas trwania.
    const videoIds = items.map((item) => item.id.videoId).join(",");
    const videosParams = new URLSearchParams({
      part: "contentDetails,statistics",
      id: videoIds,
      key: YOUTUBE_API_KEY,
    });

    const videosRes = await fetch(
      `${YOUTUBE_API_BASE}/videos?${videosParams.toString()}`,
      { cache: "no-store" },
    );
    const videosData = videosRes.ok ? await videosRes.json() : { items: [] };

    const durationMap = new Map<
      string,
      { formatted: string; seconds: number }
    >();
    const viewsMap = new Map<string, string>();

    for (const item of videosData.items || []) {
      durationMap.set(
        item.id,
        parseIsoDuration(item.contentDetails?.duration || "PT0S"),
      );

      const viewCount = parseInt(item.statistics?.viewCount || "0");
      viewsMap.set(item.id, formatViewCount(viewCount));
    }

    const pageVideos: Video[] = items.map((item) => {
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

    // Najpierw odrzucamy shorts i techniczne śmieci lokalnym filtrem.
    const nonShortVideos = filterVideos(pageVideos);
    const uniqueNonShortVideos = nonShortVideos.filter(
      (video) => !processedVideoIds.has(video.id),
    );

    if (uniqueNonShortVideos.length === 0) {
      continue;
    }

    for (const video of uniqueNonShortVideos) {
      if (!processedVideoIds.has(video.id)) {
        processedVideoIds.add(video.id);
        collectedVideos.push(video);
      }

      if (collectedVideos.length >= targetCount) {
        break;
      }
    }
  }

  // Zwracamy maksymalnie tyle wyników, ile zażądał frontend.
  const finalVideos = collectedVideos.slice(0, targetCount);

  // Pobieramy komentarze dla zebranych filmów
  const videoIds = finalVideos.map((v) => v.id);
  const commentsMap = await fetchCommentsForVideos(videoIds, YOUTUBE_API_KEY);

  // Przypisujemy komentarze do filmów
  const videosWithComments = finalVideos.map((video) => ({
    ...video,
    comments: commentsMap.get(video.id) || [],
  }));

  return NextResponse.json({
    videos: videosWithComments,
  });
}
