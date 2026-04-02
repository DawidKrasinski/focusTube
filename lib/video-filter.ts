import type { Video } from "@/lib/types";

const SHORTS_PATTERNS = ["#shorts"];
const MIN_DURATION_SECONDS = 60;

export function filterVideos(videos: Video[]) {
  return videos.filter((video) => {
    const haystack = `${video.title} ${video.description}`.toLowerCase();
    const hasShortsTag = SHORTS_PATTERNS.some((pattern) =>
      haystack.includes(pattern),
    );

    return !hasShortsTag && video.durationSeconds >= MIN_DURATION_SECONDS;
  });
}
