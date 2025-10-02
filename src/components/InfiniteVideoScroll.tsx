"use client";

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { motion, PanInfo, useAnimation } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Share,
  Heart,
  MessageCircle,
  ExternalLink,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getYouTubeShortsClient } from "@/lib/client-api";

interface VideoData {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  comments: number;
  category: string;
  publishedAt: string;
  author: {
    name: string;
    avatar: string;
  };
}

interface VideoCardProps {
  video: VideoData;
  isActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onNavigateHome?: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, isActive, isMuted, onToggleMute, onNavigateHome }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | HTMLIFrameElement>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const [isYouTubeVideo, setIsYouTubeVideo] = useState(false);

  // Check if this is a YouTube video
  useEffect(() => {
    const getYouTubeVideoId = (url: string) => {
      if (!url) return null;
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\n?#]+)/);
      return match ? match[1] : null;
    };

    setIsYouTubeVideo(!!getYouTubeVideoId(video.videoUrl));
  }, [video.videoUrl]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || isYouTubeVideo) return; // Skip for YouTube videos as they're controlled by URL params

    const handleVideoPlay = async () => {
      if (isActive && isPlaying) {
        try {
          // Wait for any existing play promise to resolve/reject first
          if (playPromiseRef.current) {
            try {
              await playPromiseRef.current;
            } catch (error) {
              // Ignore previous play errors
            }
            playPromiseRef.current = null;
          }

          // Only play if video is not already playing
          if ((videoElement as HTMLVideoElement).paused) {
            playPromiseRef.current = (videoElement as HTMLVideoElement).play();
            await playPromiseRef.current;
            playPromiseRef.current = null;
          }
        } catch (error) {
          playPromiseRef.current = null;
          // Ignore AbortError which happens when play() is interrupted by pause()
          if (error.name !== 'AbortError') {
            console.error('Video play error:', error);
          }
        }
      } else {
        // Wait for any play promise to complete before pausing
        if (playPromiseRef.current) {
          try {
            await playPromiseRef.current;
          } catch (error) {
            // Ignore play errors before pausing
          }
          playPromiseRef.current = null;
        }

        // Pause and reset
        if (!(videoElement as HTMLVideoElement).paused) {
          (videoElement as HTMLVideoElement).pause();
        }
        if (!isActive) {
          (videoElement as HTMLVideoElement).currentTime = 0; // Reset to beginning when not active
        }
      }
    };

    handleVideoPlay();
  }, [isActive, isPlaying, isYouTubeVideo]);

  useEffect(() => {
    if (videoRef.current && !isYouTubeVideo) {
      (videoRef.current as HTMLVideoElement).muted = isMuted;
    }
    // For YouTube videos, mute is controlled by URL parameters
  }, [isMuted, isYouTubeVideo]);

  useEffect(() => {
    if (isActive) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [isActive]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      const video = videoRef.current;
      if (video && !isYouTubeVideo) {
        try {
          const videoElement = video as HTMLVideoElement;
          if (!videoElement.paused) {
            videoElement.pause();
          }
          videoElement.currentTime = 0;
        } catch (error) {
          // Ignore errors during cleanup
          console.debug('Video cleanup error:', error);
        }
      }
    };
  }, [isYouTubeVideo]);

  const handleVideoClick = async () => {
    if (!hasError) {
      if (isYouTubeVideo) {
        // For YouTube videos, just toggle the playing state
        // The iframe will be recreated with new autoplay parameter
        setIsPlaying(!isPlaying);
      } else if (videoRef.current) {
        const newPlayingState = !isPlaying;
        setIsPlaying(newPlayingState);

        try {
          // Wait for any existing play promise first
          if (playPromiseRef.current) {
            try {
              await playPromiseRef.current;
            } catch (error) {
              // Ignore previous errors
            }
            playPromiseRef.current = null;
          }

          const videoElement = videoRef.current as HTMLVideoElement;
          if (newPlayingState && videoElement.paused) {
            playPromiseRef.current = videoElement.play();
            await playPromiseRef.current;
            playPromiseRef.current = null;
          } else if (!newPlayingState && !videoElement.paused) {
            videoElement.pause();
          }
        } catch (error) {
          playPromiseRef.current = null;
          // Ignore AbortError
          if (error.name !== 'AbortError') {
            console.error('Video click error:', error);
          }
        }
      }
    }
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setHasError(true);
    setIsPlaying(false);
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* Video Container with 9:16 aspect ratio */}
      <div className="w-full h-full max-w-md mx-auto relative" style={{ aspectRatio: '9/16' }}>
        {(() => {
          // Extract YouTube video ID from URL
          const getYouTubeVideoId = (url: string) => {
            if (!url) return null;
            const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\n?#]+)/);
            return match ? match[1] : null;
          };

          const videoId = getYouTubeVideoId(video.videoUrl);

          if (videoId) {
            // Use YouTube embed for YouTube URLs
            const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${isActive && isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=0&modestbranding=1&rel=0&loop=1&playlist=${videoId}&enablejsapi=1`;

            return (
              <iframe
                key={`${videoId}-${isActive}-${isPlaying}-${isMuted}`} // Force recreation when state changes
                ref={videoRef as any}
                src={embedUrl}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={video.title}
                onLoad={handleVideoLoad}
                onError={handleVideoError}
              />
            );
          } else {
            // Fallback to regular video element for direct video files
            return (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                poster={video.thumbnail}
                loop
                playsInline
                onClick={handleVideoClick}
                onLoadedData={handleVideoLoad}
                onError={handleVideoError}
                preload="metadata"
              >
                <source src={video.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            );
          }
        })()}

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {/* Error state */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white text-center">
              <div className="text-4xl mb-2">⚠️</div>
              <p className="text-sm">Video unavailable</p>
            </div>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Play/Pause overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 rounded-full p-6">
              <Play className="h-12 w-12 text-white fill-current" />
            </div>
          </div>
        )}

        {/* Click overlay for YouTube videos */}
        {isYouTubeVideo && (
          <div
            className="absolute inset-0 z-10 cursor-pointer"
            onClick={handleVideoClick}
          />
        )}

        {/* Content overlays - positioned relative to video container */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
          {/* Top controls */}
          <div className="flex justify-between items-start">
            <div className="bg-primary px-3 py-1 rounded-full text-xs font-semibold">
              {video.category}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleMute}
                className="bg-black/30 text-white hover:bg-black/50"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Bottom content */}
          <div className="space-y-4">
            {/* Video info */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold leading-tight line-clamp-3">
                {video.title}
              </h2>
              <p className="text-sm text-gray-300 line-clamp-2">
                {video.description}
              </p>

              {/* Author info */}
              <div className="flex items-center space-x-3">
                <img
                  src={video.author.avatar}
                  alt={video.author.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium">{video.author.name}</p>
                  <p className="text-xs text-gray-400">
                    {formatViews(video.views)} views • {video.duration}
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLiked(!isLiked)}
                  className="flex items-center space-x-1 text-white hover:bg-white/20"
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  <span className="text-sm">{formatViews(video.likes)}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 text-white hover:bg-white/20"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-sm">{formatViews(video.comments)}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 text-white hover:bg-white/20"
                >
                  <Share className="h-5 w-5" />
                  <span className="text-sm">Share</span>
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={onNavigateHome}
                className="text-white hover:bg-white/20"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Read More
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation hints */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 space-y-4">
          <div className="flex flex-col items-center space-y-2 text-white/70">
            <ChevronUp className="h-6 w-6 animate-bounce" />
            <div className="text-xs text-center">Swipe up<br/>for next</div>
          </div>
        </div>

        <div className="absolute right-4 bottom-20 space-y-4">
          <div className="flex flex-col items-center space-y-2 text-white/70">
            <div className="text-xs text-center">Swipe down<br/>for previous</div>
            <ChevronDown className="h-6 w-6 animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
};

interface InfiniteVideoScrollProps {
  isDesktop?: boolean;
  onNavigateHome?: () => void;
  currentLocale?: string;
}

const InfiniteVideoScroll = ({
  isDesktop = false,
  onNavigateHome,
  currentLocale = 'en'
}: InfiniteVideoScrollProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [windowHeight, setWindowHeight] = useState(800); // Default fallback
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // Set window height on client side
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowHeight(window.innerHeight);

      const handleResize = () => setWindowHeight(window.innerHeight);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Fetch real YouTube videos data from API
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  // Fetch initial videos on component mount
  useEffect(() => {
    const fetchInitialVideos = async () => {
      try {
        setIsLoadingInitial(true);
        const response = await getYouTubeShortsClient(20);

        if (response?.shorts) {
          // Map YouTube API data to VideoData format
          const mappedVideos: VideoData[] = response.shorts.map((short: any) => ({
            id: short.id || Math.random().toString(),
            title: short.title || 'Untitled Video',
            description: short.description || '',
            videoUrl: short.youtubeUrl || short.videoUrl || '',
            thumbnail: short.thumbnail || '/api/placeholder/400/600',
            duration: short.duration || '0:00',
            views: short.viewCount || short.views || 0,
            likes: short.likeCount || short.likes || 0,
            comments: 0, // Comments not available from API
            category: short.category?.name || 'News',
            publishedAt: short.publishedAt || new Date().toISOString(),
            author: {
              name: short.channelName || 'The Cliff News',
              avatar: '/api/placeholder/40/40'
            }
          }));

          setVideos(mappedVideos);
        }
      } catch (error) {
        console.error('Failed to fetch YouTube videos:', error);
        // Keep empty array as fallback
      } finally {
        setIsLoadingInitial(false);
      }
    };

    fetchInitialVideos();
  }, []);

  const loadMoreVideos = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      // Fetch more videos from API
      const response = await getYouTubeShortsClient(10);

      if (response?.shorts) {
        // Map new YouTube API data to VideoData format
        const newMappedVideos: VideoData[] = response.shorts.map((short: any) => ({
          id: short.id || Math.random().toString(),
          title: short.title || 'Untitled Video',
          description: short.description || '',
          videoUrl: short.youtubeUrl || short.videoUrl || '',
          thumbnail: short.thumbnail || '/api/placeholder/400/600',
          duration: short.duration || '0:00',
          views: short.viewCount || short.views || 0,
          likes: short.likeCount || short.likes || 0,
          comments: 0, // Comments not available from API
          category: short.category?.name || 'News',
          publishedAt: short.publishedAt || new Date().toISOString(),
          author: {
            name: short.channelName || 'The Cliff News',
            avatar: '/api/placeholder/40/40'
          }
        }));

        // Filter out duplicates and add new videos
        setVideos(prev => {
          const existingIds = new Set(prev.map(v => v.id));
          const uniqueNewVideos = newMappedVideos.filter(v => !existingIds.has(v.id));
          return [...prev, ...uniqueNewVideos];
        });
      }
    } catch (error) {
      console.error('Failed to load more videos:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleSwipe = (info: PanInfo) => {
    const threshold = 50;

    if (info.offset.y < -threshold) {
      // Swipe up - next video
      if (currentIndex < videos.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        loadMoreVideos();
      }
    } else if (info.offset.y > threshold) {
      // Swipe down - previous video
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  const handleKeyNavigation = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowUp' || event.key === 'k') {
      event.preventDefault();
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    } else if (event.key === 'ArrowDown' || event.key === 'j') {
      event.preventDefault();
      if (currentIndex < videos.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        loadMoreVideos();
      }
    } else if (event.key === 'm') {
      event.preventDefault();
      setIsMuted(!isMuted);
    }
  }, [currentIndex, videos.length, isMuted, loadMoreVideos]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyNavigation);
      return () => window.removeEventListener('keydown', handleKeyNavigation);
    }
  }, [handleKeyNavigation]);

  // Auto-load more videos when approaching the end
  useEffect(() => {
    if (currentIndex >= videos.length - 2) {
      loadMoreVideos();
    }
  }, [currentIndex, videos.length, loadMoreVideos]);

  // Show loading state while fetching initial videos
  if (isLoadingInitial || videos.length === 0) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading videos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <motion.div
        ref={containerRef}
        className="relative w-full h-full"
        animate={{ y: -currentIndex * windowHeight }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragEnd={(_, info) => handleSwipe(info)}
      >
        {videos.map((video, index) => (
          <div key={video.id} className="absolute w-full h-full" style={{ top: `${index * 100}%` }}>
            <VideoCard
              video={video}
              isActive={index === currentIndex}
              isMuted={isMuted}
              onToggleMute={() => setIsMuted(!isMuted)}
              onNavigateHome={onNavigateHome}
            />
          </div>
        ))}
      </motion.div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
          <div className="bg-black/50 text-white px-4 py-2 rounded-full text-sm">
            Loading more videos...
          </div>
        </div>
      )}

      {/* Progress indicator */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <div className="flex flex-col space-y-2">
          {videos.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((_, index) => {
            const actualIndex = Math.max(0, currentIndex - 2) + index;
            return (
              <div
                key={actualIndex}
                className={`w-1 h-8 rounded-full transition-colors ${
                  actualIndex === currentIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="absolute top-4 left-4 text-white/70 text-xs bg-black/30 px-3 py-2 rounded-lg">
        <div>↑↓ or J/K: Navigate</div>
        <div>M: Toggle mute</div>
        <div>Tap: Play/Pause</div>
      </div>
    </div>
  );
};

export default InfiniteVideoScroll;