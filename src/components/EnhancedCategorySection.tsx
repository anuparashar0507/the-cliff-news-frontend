"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NewsCard from "./NewsCard";
import { Article } from "@/services";

interface EnhancedCategorySectionProps {
  title: string;
  articles: Article[];
  layout?: "hero" | "grid" | "featured";
  showViewAll?: boolean;
  backgroundColor?: "default" | "muted" | "accent";
  maxArticles?: number;
  categorySlug?: string;
}

const EnhancedCategorySection = ({
  title,
  articles,
  layout = "grid",
  showViewAll = true,
  backgroundColor = "default",
  maxArticles = 5,
  categorySlug,
}: EnhancedCategorySectionProps) => {
  const backgroundClasses = {
    default: "",
    muted: "bg-muted/30",
    accent: "bg-gradient-to-r from-primary/5 to-primary/10",
  };

  const displayArticles = articles.slice(0, maxArticles);

  if (displayArticles.length === 0) return null;

  const renderHeroLayout = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Main Featured Article */}
      <div className="lg:col-span-1">
        <NewsCard article={displayArticles[0]} variant="featured" />
      </div>

      {/* Secondary Articles */}
      <div className="space-y-6">
        {displayArticles.slice(1, 4).map((article) => (
          <NewsCard key={article.id} article={article} variant="compact" />
        ))}
      </div>
    </div>
  );

  const renderFeaturedLayout = () => (
    <div className="grid grid-cols-1 gap-8">
      {/* Hero Article */}
      <div className="lg:col-span-2">
        <NewsCard article={displayArticles[0]} variant="featured" />
      </div>

      {/* Supporting Articles */}
      {displayArticles.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayArticles.slice(1, maxArticles).map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );

  const renderGridLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {displayArticles.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  );

  return (
    <section className={`py-16 ${backgroundClasses[backgroundColor]}`}>
      <div className="container mx-auto px-4">
        {/* Enhanced Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="relative">
            <h2 className="headline-large text-brand-navy mb-3">{title}</h2>
            <div className="w-16 h-1 bg-primary rounded-full"></div>
            <div className="w-8 h-1 bg-primary/60 rounded-full mt-1"></div>
            <p className="body-medium text-muted-foreground mt-4 max-w-md">
              Stay updated with the latest {title.toLowerCase()} stories and developments
            </p>
          </div>

          {showViewAll && displayArticles.length > 0 && (
            <Link href={`/category/${categorySlug || title.toLowerCase()}`}>
              <Button variant="outline" size="lg" className="group">
                Explore All {title}
                <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          )}
        </div>

        {/* Dynamic Layout Rendering */}
        {layout === "hero" && renderHeroLayout()}
        {layout === "featured" && renderFeaturedLayout()}
        {layout === "grid" && renderGridLayout()}

        {/* Mobile View All Button */}
        {showViewAll && displayArticles.length > 0 && (
          <div className="flex justify-center mt-12 lg:hidden">
            <Link href={`/category/${categorySlug || title.toLowerCase()}`}>
              <Button variant="outline" className="group">
                View All {title}
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default EnhancedCategorySection;