import type { Video } from "@/lib/types";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

const MAX_DESC_CHARS = 140;

type OpenAIChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
};

function truncate(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars - 3)}...`;
}

function extractJsonObject(content: string): string {
  const trimmed = content.trim();

  if (!trimmed) {
    return "{}";
  }

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
}

function parseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((id): id is string => typeof id === "string");
}

function parseBlockedIds(content: string): string[] {
  try {
    const parsed = JSON.parse(extractJsonObject(content));
    if (!parsed || typeof parsed !== "object") return [];

    const candidateIds = [
      ...parseStringArray((parsed as { blockedIds?: unknown }).blockedIds),
      ...parseStringArray(
        (parsed as { blockedVideoIds?: unknown }).blockedVideoIds,
      ),
      ...parseStringArray((parsed as { removeIds?: unknown }).removeIds),
    ];

    return [...new Set(candidateIds)];
  } catch {
    return [];
  }
}

export async function aiFilterVideos(
  query: string,
  videos: Video[],
): Promise<Video[]> {
  if (!OPENAI_API_KEY || videos.length === 0) {
    return videos;
  }

  const payload = videos.map((video) => ({
    id: video.id,
    title: truncate(video.title, 120),
    description: truncate(video.description || "", MAX_DESC_CHARS),
  }));

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0,
      max_tokens: 180,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            'You must remove low-value, non-educational video results. Return compact JSON only: {"blockedIds": ["id1", ...]}. Judge videos only by title and description. Never use channel identity or channel name as a signal. Prefer keeping borderline educational videos. Block only clear non-educational, clickbait, entertainment-only, drama/gossip, reaction, meme, prank, or viral shorts-style content.',
        },
        {
          role: "user",
          content: JSON.stringify({
            query,
            videos: payload,
          }),
        },
      ],
    }),
  });

  if (!response.ok) {
    return videos;
  }

  const data = (await response.json()) as OpenAIChatCompletionResponse;
  const content = data.choices?.[0]?.message?.content || "";

  if (!content.trim()) {
    return videos;
  }

  const blockedIds = new Set(parseBlockedIds(content));
  if (blockedIds.size === 0) {
    return videos;
  }

  return videos.filter((video) => !blockedIds.has(video.id));
}
