"use client";

import { useState, useEffect } from "react";
import { Clock, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Article } from "@/services";

interface EnhancedHeroSectionProps {
  featuredArticles: Article[];
}

const EnhancedHeroSection = ({
  featuredArticles,
}: EnhancedHeroSectionProps) => {
  const locale = useLocale();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay || !featuredArticles.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredArticles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredArticles.length, isAutoPlay]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length
    );
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredArticles.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  if (!featuredArticles.length) return null;

  const currentArticle = featuredArticles[currentIndex];

  return (
    <section className="relative h-[70vh] overflow-hidden group">
      {/* Background Images */}
      {featuredArticles.map((article, index) => (
        <div
          key={article.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-end pb-12">
        <div className="max-w-4xl">
          {/* Breaking News Badge */}
          {currentArticle.isBreaking && (
            <div className="inline-flex items-center mb-4">
              <span className="category-badge breaking animate-pulse">
                🔴 BREAKING NEWS
              </span>
            </div>
          )}

          {/* Category Badge */}
          <div className="mb-4">
            <span
              className={`category-badge ${
                currentArticle.category?.name?.toLowerCase() || "uncategorized"
              }`}
            >
              {currentArticle.category?.name || "Uncategorized"}
            </span>
          </div>

          {/* Title */}
          <h1 className="headline-large text-white mb-4 max-w-3xl animate-fade-in-up">
            {currentArticle.title}
          </h1>

          {/* Excerpt */}
          <p className="body-large text-white/90 mb-6 max-w-2xl animate-fade-in-up">
            {currentArticle.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex items-center space-x-6 mb-6 text-white/80 animate-fade-in-up">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">
                {currentArticle.author?.name || "Unknown Author"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                {formatDate(currentArticle.publishedAt)}
              </span>
            </div>
            <div className="text-sm">{currentArticle.readTime} min read</div>
          </div>

          {/* CTA Button */}
          <Link href={`/${locale}/article/${currentArticle.slug}`}>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium animate-fade-in-up"
            >
              Read Full Story
            </Button>
          </Link>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 right-8 z-20 flex space-x-2">
        {featuredArticles.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
        <div
          className="h-full bg-primary transition-all duration-[5000ms] ease-linear"
          style={{
            width: isAutoPlay ? "100%" : "0%",
            transitionDuration: isAutoPlay ? "5000ms" : "0ms",
          }}
        />
      </div>
    </section>
  );
};

export default EnhancedHeroSection;