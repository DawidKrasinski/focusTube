"use client";

import { useState } from "react";
import {
  X,
  Clock,
  User,
  Calendar,
  ThumbsUp,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import type { Video } from "@/lib/types";

interface VideoModalProps {
  video: Video;
  onClose: () => void;
}

export function VideoModal({ video, onClose }: VideoModalProps) {
  const [confirmed, setConfirmed] = useState(false);

  // Close on escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="bg-background border border-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold text-foreground text-sm sm:text-base truncate pr-4">
            {video.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {!confirmed ? (
            // Confirmation screen
            <div className="p-6 flex flex-col items-center justify-center min-h-64 text-center space-y-6">
              <div className="p-4 bg-black/10 rounded-full">
                <AlertCircle className="h-8 w-8 text-foreground" />
              </div>
              <div className="space-y-2 max-w-sm">
                <h3 className="text-lg font-semibold text-foreground">
                  Do you need to watch this video?
                </h3>
                <p className="text-sm text-muted-foreground text-pretty">
                  Take a moment to consider if this video will help you achieve
                  your goal. Stay focused on what matters.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                <button
                  onClick={() => setConfirmed(true)}
                  className="flex-1 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-neutral-900 transition-opacity"
                >
                  Yes, I need this
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-neutral-900 transition-colors"
                >
                  No, go back
                </button>
              </div>
            </div>
          ) : (
            // Video content
            <div className="space-y-4">
              {/* Video player */}
              <div className="aspect-video bg-secondary rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`}
                  title={video.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Video metadata */}
              <div className="px-4 space-y-4">
                <h3 className="font-semibold text-foreground text-lg leading-tight">
                  {video.title}
                </h3>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    {video.channel}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {video.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {video.uploadDate}
                  </span>
                  <span>{video.views}</span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {video.description}
                </p>

                {/* Comments section */}
                <div className="border-t border-border pt-4 mt-4">
                  <h4 className="font-medium text-foreground flex items-center gap-2 mb-4">
                    <MessageSquare className="h-4 w-4" />
                    Comments ({video.comments.length})
                  </h4>
                  <div className="space-y-4 pb-4">
                    {video.comments.map((comment) => (
                      <div key={comment.id} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-muted-foreground">
                            {comment.author.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-sm text-foreground">
                            {comment.author}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {comment.date}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground pl-10">
                          {comment.text}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground pl-10">
                          <ThumbsUp className="h-3 w-3" />
                          {comment.likes}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
