import { Play, Heart, Share2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { YouTubeShort } from "@/services";

interface VideoByteCardProps {
  video: YouTubeShort;
}

const VideoByteCard = ({ video }: VideoByteCardProps) => {
  const formatViews = (views: number | undefined) => {
    if (!views || views === 0) return "0";
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="news-card p-0 max-w-sm mx-auto group">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Play Button Overlay */}
        <Link to="/bytes" className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="lg"
            className="rounded-full bg-white/90 text-black hover:bg-white pointer-events-none"
          >
            <Play className="h-6 w-6 ml-1" />
          </Button>
        </Link>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {formatDuration(video.duration)}
        </div>

        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <span
            className={`category-badge ${
              video.category?.name?.toLowerCase() || "uncategorized"
            } text-xs`}
          >
            {video.category?.name || "Uncategorized"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-2">
          {video.title}
        </h3>

        <p className="body-small text-muted-foreground mb-3 line-clamp-2">
          {video.description}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>{formatViews(video.views)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-3 w-3" />
              <span>{formatViews(video.likes)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          <Link to="/bytes">
            <Button variant="outline" size="sm" className="text-xs">
              <Play className="h-3 w-3 mr-1" />
              Watch
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VideoByteCard;
