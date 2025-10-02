"use client";

import { Share2, Bookmark, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Article } from "@/services";

interface QuickReadCardProps {
  item: Article;
}

const QuickReadCard = ({ item }: QuickReadCardProps) => {
  const locale = useLocale();

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 max-w-sm mx-auto">
      <div className="relative">
        <img
          src={item.featuredImage}
          alt={item.title}
          className="w-full h-48 object-cover"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`category-badge text-xs ${
              item.category?.name?.toLowerCase() || "uncategorized"
            }`}
          >
            {item.category?.name || "Uncategorized"}
          </span>
        </div>
      </div>

      <div className="p-4">
        {/* Headline */}
        <h3 className="font-bold text-foreground mb-2 line-clamp-2 text-base leading-tight">
          {item.title}
        </h3>

        {/* Summary */}
        <p className="text-muted-foreground text-sm mb-3 line-clamp-3 leading-relaxed">
          {item.excerpt}
        </p>

        {/* Meta Information */}
        <div className="flex justify-between items-center text-xs text-muted-foreground mb-4">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{formatTimeAgo(item.publishedAt)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Link href={`/${locale}/article/${item.slug}`} className="flex-1">
            <Button
              size="sm"
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-medium"
            >
              Read Full
            </Button>
          </Link>

          <Button variant="outline" size="sm" className="p-2 h-8 w-8">
            <Share2 className="h-3 w-3" />
          </Button>

          <Button variant="outline" size="sm" className="p-2 h-8 w-8">
            <Bookmark className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickReadCard;