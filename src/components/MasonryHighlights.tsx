import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, Share2, Calendar } from 'lucide-react';

interface HighlightItem {
  id: string;
  title: string;
  image: string;
  category: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'wide';
  isBreaking?: boolean;
}

interface MasonryHighlightsProps {
  highlights: HighlightItem[];
  onHighlightClick?: (highlight: HighlightItem) => void;
}

const MasonryHighlights: React.FC<MasonryHighlightsProps> = ({ 
  highlights, 
  onHighlightClick 
}) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  const getImageHeight = (aspectRatio?: string) => {
    switch (aspectRatio) {
      case 'portrait': return 'h-80';
      case 'square': return 'h-64';
      case 'landscape': return 'h-48';
      case 'wide': return 'h-40';
      default: return 'h-60';
    }
  };

  const getCardSpan = (aspectRatio?: string, index?: number) => {
    if (aspectRatio === 'wide') return 'md:col-span-2';
    if (aspectRatio === 'portrait') return 'md:row-span-2';
    if (index === 0 || index === 4 || index === 9) return 'md:col-span-2 md:row-span-2';
    return '';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-auto">
      {highlights.map((highlight, index) => (
        <Card
          key={highlight.id}
          className={`overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer break-inside-avoid ${getCardSpan(highlight.aspectRatio, index)}`}
          onClick={() => onHighlightClick?.(highlight)}
        >
          <div className="relative">
            <img
              src={highlight.image}
              alt={highlight.title}
              className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${getImageHeight(highlight.aspectRatio)}`}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Breaking News Badge */}
            {highlight.isBreaking && (
              <div className="absolute top-3 left-3">
                <Badge variant="destructive" className="animate-pulse bg-primary text-primary-foreground">
                  🔥 Breaking
                </Badge>
              </div>
            )}

            {/* Category Badge */}
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-background/80 text-foreground">
                {highlight.category}
              </Badge>
            </div>

            {/* Stats Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="font-bold text-lg mb-2 line-clamp-2">
                {highlight.title}
              </h3>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(highlight.publishedAt)}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{formatNumber(highlight.viewCount)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span>{formatNumber(highlight.likeCount)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Share2 className="h-3 w-3" />
                    <span>{formatNumber(highlight.shareCount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MasonryHighlights;