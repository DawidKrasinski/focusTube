import type { Video } from "@/lib/types";

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  const content = (
    <article className="group cursor-pointer">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-secondary rounded-lg overflow-hidden mb-3 border border-border">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <div className="w-0 h-0 border-t-6 border-b-6 border-l-10 border-t-transparent border-b-transparent border-l-muted-foreground ml-1" />
            </div>
          </div>
        )}
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-background/90 text-foreground text-xs font-medium px-2 py-1 rounded">
          {video.duration}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        <p className="text-sm text-muted-foreground">{video.channel}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{video.views}</span>
          <span>•</span>
          <span>{video.uploadDate}</span>
        </div>
      </div>
    </article>
  );

  if (video.videoUrl) {
    return (
      <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return content;
}

export function VideoCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-video bg-secondary rounded-lg mb-3" />
      <div className="space-y-2">
        <div className="h-4 bg-secondary rounded w-full" />
        <div className="h-4 bg-secondary rounded w-3/4" />
        <div className="h-3 bg-secondary rounded w-1/2" />
      </div>
    </div>
  );
}
