"use client";

import { Clock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Article } from "@/services";

interface NewsCardProps {
  article: Article;
  variant?: "default" | "featured" | "compact";
}

const NewsCard = ({ article, variant = "default" }: NewsCardProps) => {
  const locale = useLocale();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (variant === "compact") {
    return (
      <Link href={`/${locale}/article/${article.slug}`}>
        <article className="news-card p-4 transition-transform hover:scale-[1.02] cursor-pointer">
          <div className="flex space-x-4">
            <img
              src={article.featuredImage || '/api/placeholder/400/300'}
              alt={article.title}
              className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center mb-2">
                {article.isBreaking && (
                  <span className="category-badge breaking mr-2 text-xs">
                    BREAKING
                  </span>
                )}
                <span
                  className={`category-badge ${
                    article.category?.name?.toLowerCase() || "uncategorized"
                  } text-xs`}
                >
                  {article.category?.name || "Uncategorized"}
                </span>
              </div>
              <h3 className="font-semibold text-sm leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {article.title}
              </h3>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>{formatDate(article.publishedAt)}</span>
                <span className="mx-2">•</span>
                <span>{article.readTime} min</span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link href={`/${locale}/article/${article.slug}`}>
        <article className="news-card group cursor-pointer">
          <div className="relative overflow-hidden">
            <img
              src={article.featuredImage || '/api/placeholder/400/300'}
              alt={article.title}
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {article.isBreaking && (
              <div className="absolute top-4 left-4">
                <span className="category-badge breaking animate-pulse">
                  🔴 BREAKING
                </span>
              </div>
            )}
            <div className="absolute bottom-4 left-4">
              <span
                className={`category-badge ${
                  article.category?.name?.toLowerCase() || "uncategorized"
                }`}
              >
                {article.category?.name || "Uncategorized"}
              </span>
            </div>
          </div>

          <div className="p-6">
            <h2 className="headline-small mb-3 group-hover:text-primary transition-colors">
              {article.title}
            </h2>
            <p className="body-medium text-muted-foreground mb-4 line-clamp-3">
              {article.excerpt}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{article.author?.name || "Unknown Author"}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
                <span>{article.readTime} min read</span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="group-hover:text-primary pointer-events-none"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/${locale}/article/${article.slug}`}>
      <article className="news-card group cursor-pointer">
        <div className="relative overflow-hidden">
          <img
            src={article.featuredImage || '/api/placeholder/400/300'}
            alt={article.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {article.isBreaking && (
            <div className="absolute top-3 left-3">
              <span className="category-badge breaking text-xs animate-pulse">
                BREAKING
              </span>
            </div>
          )}
          <div className="absolute bottom-3 left-3">
            <span
              className={`category-badge ${
                article.category?.name?.toLowerCase() || "uncategorized"
              } text-xs`}
            >
              {article.category?.name || "Uncategorized"}
            </span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="body-small text-muted-foreground mb-3 line-clamp-2">
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <span>{article.author?.name || "Unknown Author"}</span>
              <span>•</span>
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            <span>{article.readTime} min</span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default NewsCard;