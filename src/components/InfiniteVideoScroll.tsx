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
}

const VideoCard: React.FC<VideoCardProps> = ({ video, isActive, isMuted, onToggleMute }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive && isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive, isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    if (isActive) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [isActive]);

  const handleVideoClick = () => {
    setIsPlaying(!isPlaying);
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
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        poster={video.thumbnail}
        loop
        playsInline
        onClick={handleVideoClick}
      >
        <source src={video.videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

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

      {/* Content */}
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
  );
};

const InfiniteVideoScroll = () => {
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

  // Mock video data - in production, fetch from API
  const [videos, setVideos] = useState<VideoData[]>([
    {
      id: '1',
      title: 'Breaking: Major Political Development Shakes Nation',
      description: 'Latest updates on the political situation that has captured nationwide attention with significant implications.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: '/api/placeholder/400/600',
      duration: '2:30',
      views: 125000,
      likes: 3200,
      comments: 456,
      category: 'Breaking News',
      publishedAt: '2024-09-28T10:00:00Z',
      author: {
        name: 'The Cliff News',
        avatar: '/api/placeholder/40/40'
      }
    },
    {
      id: '2',
      title: 'Sports Highlight: Championship Finals Draw Record Viewers',
      description: 'Exciting moments from the championship finals that broke all previous viewership records.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail: '/api/placeholder/400/600',
      duration: '1:45',
      views: 89000,
      likes: 2100,
      comments: 234,
      category: 'Sports',
      publishedAt: '2024-09-28T08:30:00Z',
      author: {
        name: 'Sports Desk',
        avatar: '/api/placeholder/40/40'
      }
    },
    {
      id: '3',
      title: 'Technology: Revolutionary AI Breakthrough Announced',
      description: 'Scientists reveal groundbreaking AI technology that could change how we interact with machines.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: '/api/placeholder/400/600',
      duration: '3:15',
      views: 67000,
      likes: 1800,
      comments: 167,
      category: 'Technology',
      publishedAt: '2024-09-28T06:15:00Z',
      author: {
        name: 'Tech Reporter',
        avatar: '/api/placeholder/40/40'
      }
    },
    {
      id: '4',
      title: 'Business: Market Surge Following Policy Changes',
      description: 'Financial markets respond positively to new government policies with significant gains across sectors.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnail: '/api/placeholder/400/600',
      duration: '2:00',
      views: 45000,
      likes: 1200,
      comments: 89,
      category: 'Business',
      publishedAt: '2024-09-28T04:45:00Z',
      author: {
        name: 'Business Team',
        avatar: '/api/placeholder/40/40'
      }
    }
  ]);

  const loadMoreVideos = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Add more mock videos
    const newVideos: VideoData[] = [
      {
        id: `${videos.length + 1}`,
        title: 'Entertainment: Celebrity News and Updates',
        description: 'Latest news from the entertainment world with exclusive interviews and behind-the-scenes content.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        thumbnail: '/api/placeholder/400/600',
        duration: '1:55',
        views: 23000,
        likes: 890,
        comments: 45,
        category: 'Entertainment',
        publishedAt: '2024-09-28T02:30:00Z',
        author: {
          name: 'Entertainment Desk',
          avatar: '/api/placeholder/40/40'
        }
      }
    ];

    setVideos(prev => [...prev, ...newVideos]);
    setIsLoading(false);
  }, [isLoading, videos.length]);

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