"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Share,
  Heart,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  views?: number;
  publishedAt: string;
  channel: {
    name: string;
    avatar?: string;
  };
}

interface HorizontalVideoScrollProps {
  videos: VideoData[];
  maxVideos?: number;
}

const HorizontalVideoScroll: React.FC<HorizontalVideoScrollProps> = ({
  videos,
  maxVideos = 10
}) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});
  const [isMuted, setIsMuted] = useState<{ [key: string]: boolean }>({});
  const [likes, setLikes] = useState<{ [key: string]: boolean }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  // Limit videos to maxVideos
  const displayVideos = videos.slice(0, maxVideos);

  const togglePlay = (videoId: string) => {
    const video = videoRefs.current[videoId];
    const isCurrentlyPlaying = isPlaying[videoId];

    if (video) {
      if (isCurrentlyPlaying) {
        video.pause();
      } else {
        video.play().catch(console.error);
      }
    } else {
      // If no video element yet, just toggle state to show video
      setIsPlaying(prev => ({ ...prev, [videoId]: !prev[videoId] }));
    }
  };

  const toggleMute = (videoId: string) => {
    const video = videoRefs.current[videoId];
    const newMutedState = !isMuted[videoId];

    setIsMuted(prev => ({ ...prev, [videoId]: newMutedState }));

    if (video) {
      video.muted = newMutedState;
    }
  };

  const toggleLike = (videoId: string) => {
    setLikes(prev => ({ ...prev, [videoId]: !prev[videoId] }));
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const formatViews = (views?: number) => {
    if (!views || views === 0) return '0';
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Unknown';

    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (!displayVideos.length) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>No video bytes available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      {displayVideos.length > 3 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
            onClick={scrollRight}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Horizontal Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayVideos.map((video, index) => (
          <motion.div
            key={video.id}
            className="flex-shrink-0 w-72 bg-card border border-border rounded-lg overflow-hidden group"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Video Thumbnail/Player */}
            <div className="relative aspect-[9/16] bg-black cursor-pointer" onClick={() => togglePlay(video.id)}>
              {isPlaying[video.id] && video.videoUrl ? (
                <video
                  ref={(el) => (videoRefs.current[video.id] = el)}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted={isMuted[video.id]}
                  playsInline
                  poster={video.thumbnail || '/api/placeholder/400/600'}
                  onError={() => {
                    console.log('Video error, falling back to thumbnail');
                    setIsPlaying(prev => ({ ...prev, [video.id]: false }));
                  }}
                  onPlay={() => {
                    setIsPlaying(prev => ({ ...prev, [video.id]: true }));
                  }}
                  onPause={() => {
                    setIsPlaying(prev => ({ ...prev, [video.id]: false }));
                  }}
                >
                  <source src={video.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={video.thumbnail || '/api/placeholder/400/600'}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Play Overlay when paused */}
              {!isPlaying[video.id] && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/60 rounded-full p-3">
                    <Play className="h-8 w-8 text-white fill-current" />
                  </div>
                </div>
              )}

              {/* Video Controls Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="bg-black/50 hover:bg-black/70"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlay(video.id);
                      }}
                    >
                      {isPlaying[video.id] ? (
                        <Pause className="h-4 w-4 text-white" />
                      ) : (
                        <Play className="h-4 w-4 text-white" />
                      )}
                    </Button>

                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="bg-black/50 hover:bg-black/70"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMute(video.id);
                        }}
                      >
                        {isMuted[video.id] ? (
                          <VolumeX className="h-4 w-4 text-white" />
                        ) : (
                          <Volume2 className="h-4 w-4 text-white" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Duration Badge */}
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
            </div>

            {/* Video Info */}
            <div className="p-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm line-clamp-2 text-foreground mb-1">
                  {video.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  {video.channel?.name || 'Unknown Channel'}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatViews(video.views)} views</span>
                  <span>•</span>
                  <span>{formatTimeAgo(video.publishedAt)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2"
                    onClick={() => toggleLike(video.id)}
                  >
                    <Heart className={`h-4 w-4 ${likes[video.id] ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 px-2">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
                <Button size="sm" variant="ghost" className="h-8 px-2">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Show more indicator */}
      {videos.length > maxVideos && (
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {maxVideos} of {videos.length} videos
          </p>
        </div>
      )}
    </div>
  );
};

export default HorizontalVideoScroll;