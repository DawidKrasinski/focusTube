// import { NextRequest, NextResponse } from "next/server";
// import type { Video } from "@/lib/types";
// import { filterVideos } from "@/lib/video-filter";
// import { aiFilterVideos } from "@/lib/ai-video-filter";

// const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
// const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
// const AI_BATCH_SIZE = 20;
// const MAX_AI_ANALYZED_VIDEOS = 100;

// function parseIsoDuration(iso: string): { formatted: string; seconds: number } {
//   const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
//   if (!match) return { formatted: "0:00", seconds: 0 };
//   const hours = parseInt(match[1] || "0");
//   const minutes = parseInt(match[2] || "0");
//   const seconds = parseInt(match[3] || "0");
//   const totalSeconds = hours * 3600 + minutes * 60 + seconds;
//   if (hours > 0) {
//     return {
//       formatted: `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
//       seconds: totalSeconds,
//     };
//   }
//   return {
//     formatted: `${minutes}:${String(seconds).padStart(2, "0")}`,
//     seconds: totalSeconds,
//   };
// }

// function formatUploadDate(publishedAt: string): string {
//   const now = new Date();
//   const published = new Date(publishedAt);
//   const diffDays = Math.floor(
//     (now.getTime() - published.getTime()) / (1000 * 60 * 60 * 24),
//   );
//   if (diffDays === 0) return "Today";
//   if (diffDays === 1) return "Yesterday";
//   if (diffDays < 7) return `${diffDays} days ago`;
//   if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
//   if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
//   return `${Math.floor(diffDays / 365)} years ago`;
// }

// function formatViewCount(count: number): string {
//   if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M views`;
//   if (count >= 1_000) return `${Math.round(count / 1_000)}K views`;
//   return `${count} views`;
// }

// export async function GET(request: NextRequest) {
//   if (!YOUTUBE_API_KEY) {
//     return NextResponse.json(
//       {
//         error:
//           "YouTube API key not configured. Set YOUTUBE_API_KEY in .env.local",
//       },
//       { status: 500 },
//     );
//   }

//   const { searchParams } = new URL(request.url);
//   const query = searchParams.get("q");
//   const duration = searchParams.get("duration") || "any";
//   const uploadDate = searchParams.get("uploadDate") || "any";
//   const targetCount = Math.min(
//     50,
//     Math.max(1, Number(searchParams.get("count")) || 20),
//   );

//   if (!query?.trim()) {
//     return NextResponse.json(
//       { error: "Query parameter 'q' is required" },
//       { status: 400 },
//     );
//   }

//   const baseSearchParams = new URLSearchParams({
//     part: "snippet",
//     q: query.trim(),
//     type: "video",
//     maxResults: "25",
//     key: YOUTUBE_API_KEY,
//   });

//   if (duration === "short")
//     baseSearchParams.set("videoDuration", "short"); // < 4 min
//   else if (duration === "medium")
//     baseSearchParams.set("videoDuration", "medium"); // 4–20 min
//   else if (duration === "long") baseSearchParams.set("videoDuration", "long"); // > 20 min

//   if (uploadDate !== "any") {
//     const now = new Date();
//     let publishedAfter: Date | null = null;
//     if (uploadDate === "hour")
//       publishedAfter = new Date(now.getTime() - 60 * 60 * 1000);
//     else if (uploadDate === "today") {
//       const d = new Date(now);
//       d.setHours(0, 0, 0, 0);
//       publishedAfter = d;
//     } else if (uploadDate === "week")
//       publishedAfter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//     else if (uploadDate === "month")
//       publishedAfter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//     else if (uploadDate === "year")
//       publishedAfter = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
//     if (publishedAfter)
//       baseSearchParams.set("publishedAfter", publishedAfter.toISOString());
//   }

//   const collectedVideos: Video[] = [];
//   const processedVideoIds = new Set<string>();
//   let nextPageToken: string | null = "";
//   let analyzedByAiCount = 0;
//   const isAiFilteringEnabled = Boolean(process.env.OPENAI_API_KEY);

//   while (collectedVideos.length < targetCount && nextPageToken !== null) {
//     if (isAiFilteringEnabled && analyzedByAiCount >= MAX_AI_ANALYZED_VIDEOS) {
//       break;
//     }

//     const searchParamsPage = new URLSearchParams(baseSearchParams);
//     if (nextPageToken) {
//       searchParamsPage.set("pageToken", nextPageToken);
//     }

//     const searchRes = await fetch(
//       `${YOUTUBE_API_BASE}/search?${searchParamsPage.toString()}`,
//     );
//     if (!searchRes.ok) {
//       const err = await searchRes.json().catch(() => ({}));
//       return NextResponse.json({ error: err }, { status: searchRes.status });
//     }

//     const searchData = await searchRes.json();
//     nextPageToken = searchData.nextPageToken || null;

//     const items: any[] = (searchData.items || []).filter(
//       (item: any) => item.id?.videoId,
//     );

//     if (items.length === 0 && nextPageToken) {
//       continue;
//     }

//     const videoIds = items.map((item) => item.id.videoId).join(",");
//     const videosParams = new URLSearchParams({
//       part: "contentDetails,statistics",
//       id: videoIds,
//       key: YOUTUBE_API_KEY,
//     });

//     const videosRes = await fetch(
//       `${YOUTUBE_API_BASE}/videos?${videosParams.toString()}`,
//     );
//     const videosData = videosRes.ok ? await videosRes.json() : { items: [] };

//     const durationMap = new Map<
//       string,
//       { formatted: string; seconds: number }
//     >();
//     const viewsMap = new Map<string, string>();
//     for (const item of videosData.items || []) {
//       durationMap.set(
//         item.id,
//         parseIsoDuration(item.contentDetails?.duration || "PT0S"),
//       );
//       const viewCount = parseInt(item.statistics?.viewCount || "0");
//       viewsMap.set(item.id, formatViewCount(viewCount));
//     }

//     const pageVideos: Video[] = items.map((item) => {
//       const videoId: string = item.id.videoId;
//       const dur = durationMap.get(videoId) || { formatted: "0:00", seconds: 0 };
//       return {
//         id: videoId,
//         title: item.snippet.title,
//         description: item.snippet.description || "",
//         duration: dur.formatted,
//         durationSeconds: dur.seconds,
//         uploadDate: formatUploadDate(item.snippet.publishedAt),
//         uploadDateISO: item.snippet.publishedAt,
//         channel: item.snippet.channelTitle,
//         views: viewsMap.get(videoId) || "N/A",
//         thumbnailUrl:
//           item.snippet.thumbnails?.medium?.url ||
//           item.snippet.thumbnails?.default?.url ||
//           undefined,
//         videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
//       };
//     });

//     const nonShortVideos = filterVideos(pageVideos);
//     const uniqueNonShortVideos = nonShortVideos.filter(
//       (video) => !processedVideoIds.has(video.id),
//     );

//     if (uniqueNonShortVideos.length === 0) {
//       continue;
//     }

//     let acceptedVideos: Video[] = uniqueNonShortVideos;

//     if (isAiFilteringEnabled) {
//       const aiBudgetLeft = MAX_AI_ANALYZED_VIDEOS - analyzedByAiCount;
//       const aiCandidates = uniqueNonShortVideos.slice(
//         0,
//         Math.min(AI_BATCH_SIZE, aiBudgetLeft),
//       );

//       analyzedByAiCount += aiCandidates.length;

//       try {
//         acceptedVideos = await aiFilterVideos(query.trim(), aiCandidates);
//       } catch {
//         acceptedVideos = aiCandidates;
//       }
//     }

//     for (const video of acceptedVideos) {
//       if (!processedVideoIds.has(video.id)) {
//         processedVideoIds.add(video.id);
//         collectedVideos.push(video);
//       }
//       if (collectedVideos.length >= targetCount) {
//         break;
//       }
//     }

//     // Mark candidates as processed even when AI rejected them to avoid re-analysis.
//     for (const video of uniqueNonShortVideos) {
//       processedVideoIds.add(video.id);
//     }
//   }

//   return NextResponse.json({
//     videos: collectedVideos.slice(0, targetCount),
//   });
// }

import { NextRequest, NextResponse } from "next/server";
import type { Video } from "@/lib/types";
import { filterVideos } from "@/lib/video-filter";
import { aiFilterVideos } from "@/lib/ai-video-filter";

const AI_BATCH_SIZE = 20;
const MAX_AI_ANALYZED_VIDEOS = 100;
const MOCK_PAGE_SIZE = 25;

const MOCK_CHANNELS = [
  "FocusTube Channel 1",
  "FocusTube Channel 2",
  "FocusTube Channel 3",
  "FocusTube Channel 4",
  "FocusTube Channel 5",
  "FocusTube Channel 6",
  "FocusTube Channel 7",
  "FocusTube Channel 8",
] as const;

const MOCK_VIDEO_TITLES = [
  "React useEffect Explained Simply",
  "TypeScript Types You Actually Need",
  "Build a REST API with Node.js",
  "Next.js App Router Basics for Beginners",
  "JavaScript Closures in Plain English",
  "Git Rebase vs Merge Explained",
  "How JWT Authentication Actually Works",
  "Async Await and the Event Loop",
  "Prisma ORM Tutorial with Real Examples",
  "GraphQL vs REST Practical Comparison",
  "Fortnite Chapter 6 Battle Pass Reaction",
  "Fortnite Solo Ranked Grind to Unreal",
  "Fortnite Funny Moments with My Squad",
  "Fortnite Zero Build Highlights Compilation",
  "Fortnite New Update Everything You Missed",
  "Fortnite Controller Settings for Better Aim",
  "Fortnite Tournament Endgame Clutch",
  "Fortnite Mythic Loot Challenge",
  "Fortnite Item Shop Review Today",
  "Fortnite Live Event First Reaction",
  "Fortnite Skybase Win in Zero Build",
  "Fortnite Stream Highlights with Subscribers",
  "Fortnite But I Can Only Use Gray Weapons",
  "Fortnite Reload Mode Best Moments",
  "Fortnite Duos Arena with My Best Friend",
  "Fortnite New Season Secret POIs",
  "Fortnite Sniping Montage 2026",
  "Fortnite XP Glitch That Still Works",
  "Fortnite Locker Tour and Best Skins",
  "Fortnite Cash Cup Road to Earnings",
  "Fortnite 1v1 Box Fight Wager Match",
  "Fortnite Meme Tactics That Somehow Work",
  "Fortnite Keyboard Cam Ranked Session",
  "Fortnite Warmup Routine Before Tournaments",
  "Fortnite Custom Lobbies with Fans",
  "Fortnite Chapter 6 Map Changes Explained",
  "Fortnite Movement Tips for Zero Build",
  "Fortnite Sensitivity Settings Revealed",
  "Fortnite Reaction to the New Shotgun",
  "Fortnite Late Night Ranked Session",
  "Fortnite Full Day Grind to Champion",
  "Fortnite Trios Scrims with Comms",
  "Fortnite Weirdest Hiding Spots Ever",
  "Fortnite Landing Spots for Easy Wins",
  "Fortnite Best Budget Gaming Setup",
  "Fortnite Challenge Wheel with Punishments",
  "Fortnite No Healing Victory Challenge",
  "Fortnite Playing with Random Duos",
  "Fortnite New Skin Review and Gameplay",
  "Fortnite Fastest Way to Level Up",
  "Fortnite Building Tips for Beginners",
  "Fortnite High Kill Solo vs Squads",
  "Fortnite Unexpected Clutch in Finals",
  "Fortnite Every Mythic Tested in One Match",
  "Fortnite Is This the Best Season Yet",
  "Fortnite One Chest Challenge Extreme",
  "Fortnite Ranked Endgame with Insane Loot",
  "Fortnite Best Drop Spots After Update",
  "Fortnite Streamer Tournament Highlights",
  "Fortnite New Patch Honest Review",
  "Fortnite Victory Royale with No Builds",
  "Fortnite Duo Carry Challenge",
  "Fortnite Trickshots Only Challenge",
  "Fortnite New Mobility Items Tested",
  "Fortnite Random Skin Challenge",
  "Fortnite Sweatiest Lobbies of the Night",
  "Fortnite Can We Win with Pistols Only",
  "Fortnite Best Crosshair and HUD Setup",
  "Fortnite Hidden Vault Location Guide",
  "Fortnite 24 Hours of Ranked Grind",
  "Fortnite Reaching Unreal with No Mic",
  "Fortnite Best Edit Course Warmup",
  "Fortnite Duo Tournament Day Vlog",
  "Fortnite New Meta Weapons Ranked",
  "Fortnite Controller vs Keyboard Challenge",
  "Fortnite Reactions to My Craziest Clips",
  "Fortnite Full Locker Rating Session",
  "Fortnite Trying Viral TikTok Tactics",
  "Fortnite Last Player Standing Chaos",
  "Fortnite Funny Deaths Compilation",
  "Fortnite Ranked Grind with Chill Music",
  "A Day in My Life Working from Home Vlog",
  "Sunday Reset Vlog Cleaning Cooking and Planning",
  "My Morning Routine as a Remote Worker",
  "Realistic Week in My Life Vlog",
  "Productive Day in My Life at Home",
  "Weekend Vlog Coffee Shopping and Reading",
  "Come Spend a Slow Day with Me Vlog",
  "Night Routine Vlog After a Long Week",
  "Travel Vlog 48 Hours in Rome",
  "Paris Travel Guide Best Cafes and Views",
  "Weekend Trip to Barcelona Vlog",
  "What I Ate in Tokyo Travel Food Diary",
  "Hidden Beaches in Portugal Travel Vlog",
  "Solo Trip to Prague Honest Travel Diary",
  "Street Food Tour in Bangkok",
  "Trying the Best Pizza Places in Naples",
  "Easy Homemade Pasta for Busy Evenings",
  "Korean Street Food Tour in Seoul",
  "Testing Viral Fast Food Menu Hacks",
  "Best Burgers in New York Food Crawl",
  "How to Make Crispy Potatoes Every Time",
  "Comfort Food Recipes for Rainy Days",
  "Trying Michelin Recommended Desserts in Paris",
] as const;

function createMockVideo(title: string, index: number): Video {
  const durationSeconds = 420 + ((index % 10) + 1) * 90;
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  const channel = MOCK_CHANNELS[index % MOCK_CHANNELS.length];
  const uploadDateISO = new Date(
    Date.UTC(2026, 2, 31 - (index % 28), 12, index % 60, 0),
  ).toISOString();

  return {
    id: `mock-video-${String(index + 1).padStart(3, "0")}`,
    title,
    description:
      "Neutral mock description used only to test which titles are filtered by AI.",
    duration: `${minutes}:${String(seconds).padStart(2, "0")}`,
    durationSeconds,
    uploadDate: `${(index % 4) + 1} weeks ago`,
    uploadDateISO,
    channel,
    views: `${(index + 3) * 7}K views`,
    thumbnailUrl: `https://placehold.co/480x360/png?text=FocusTube+${index + 1}`,
    videoUrl: `https://www.youtube.com/watch?v=mock-video-${String(index + 1).padStart(3, "0")}`,
  };
}

const MOCK_VIDEOS: Video[] = MOCK_VIDEO_TITLES.map(createMockVideo);

function searchMockVideos(query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  const matches = MOCK_VIDEOS.filter((video) => {
    const haystack = `${video.title} ${video.description}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  return matches.length > 0 ? matches : MOCK_VIDEOS;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
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

  const sourceVideos = searchMockVideos(query);
  const collectedVideos: Video[] = [];
  const processedVideoIds = new Set<string>();
  const isAiFilteringEnabled = Boolean(process.env.OPENAI_API_KEY);
  let offset = 0;
  let analyzedByAiCount = 0;

  while (collectedVideos.length < targetCount && offset < sourceVideos.length) {
    if (isAiFilteringEnabled && analyzedByAiCount >= MAX_AI_ANALYZED_VIDEOS) {
      break;
    }

    const pageVideos = sourceVideos.slice(offset, offset + MOCK_PAGE_SIZE);
    offset += MOCK_PAGE_SIZE;

    const nonShortVideos = filterVideos(pageVideos);
    const uniqueNonShortVideos = nonShortVideos.filter(
      (video) => !processedVideoIds.has(video.id),
    );

    if (uniqueNonShortVideos.length === 0) {
      continue;
    }

    let acceptedVideos = uniqueNonShortVideos;

    if (isAiFilteringEnabled) {
      const aiBudgetLeft = MAX_AI_ANALYZED_VIDEOS - analyzedByAiCount;
      const aiCandidates = uniqueNonShortVideos.slice(
        0,
        Math.min(AI_BATCH_SIZE, aiBudgetLeft),
      );

      analyzedByAiCount += aiCandidates.length;

      try {
        acceptedVideos = await aiFilterVideos(query.trim(), aiCandidates);
      } catch {
        acceptedVideos = aiCandidates;
      }
    }

    for (const video of acceptedVideos) {
      if (!processedVideoIds.has(video.id)) {
        processedVideoIds.add(video.id);
        collectedVideos.push(video);
      }

      if (collectedVideos.length >= targetCount) {
        break;
      }
    }

    for (const video of uniqueNonShortVideos) {
      processedVideoIds.add(video.id);
    }
  }

  return NextResponse.json({
    videos: collectedVideos.slice(0, targetCount),
  });
}
