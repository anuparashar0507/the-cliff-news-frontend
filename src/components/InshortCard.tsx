"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Share2, Heart, Volume2, VolumeX, Clock, Eye, ArrowRight, ChevronUp } from 'lucide-react';
import { FeaturedImage } from '@/components/FeaturedImage';
import { useTranslations } from 'next-intl';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface InshortItem {
  id: string;
  title: string;
  content: string;
  featuredImage?: string;
  category?: { id: string; name: string; slug: string };
  publishedAt?: string;
  readTime?: number;
  isBreaking?: boolean;
  viewCount?: number;
  likeCount?: number;
  shareCount?: number;
  sourceArticleId?: string;
  sourceArticle?: {
    id: string;
    title: string;
    slug: string;
  };
}

interface InshortCardProps {
  item: InshortItem;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  isActive?: boolean;
  locale?: string;
  currentIndex?: number;
  totalCount?: number;
}

export function InshortCard({
  item,
  onSwipeUp,
  onSwipeDown,
  isActive = true,
  locale = 'en',
  currentIndex = 1,
  totalCount = 1
}: InshortCardProps) {
  const t = useTranslations();
  const [isLiked, setIsLiked] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likeCount || 0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.content,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const toggleSpeech = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const text = `${item.title}. ${item.content}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = locale === 'hi' ? 'hi-IN' : 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (utteranceRef.current && isSpeaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSpeaking]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const swipeThreshold = 100;
    const swipeVelocityThreshold = 500;

    if (info.offset.y < -swipeThreshold || info.velocity.y < -swipeVelocityThreshold) {
      onSwipeUp?.();
    } else if (info.offset.y > swipeThreshold || info.velocity.y > swipeVelocityThreshold) {
      onSwipeDown?.();
    }
  };

  // Build the article URL based on locale
  const articleUrl = item.sourceArticle
    ? `/${locale}/article/${item.sourceArticle.slug}?from=inshorts&index=${currentIndex}`
    : null;

  return (
    <motion.div
      className="h-full w-full flex items-center justify-center px-4"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="w-full max-w-md"
        whileDrag={{ scale: 0.95 }}
      >
        <div className="bg-card rounded-3xl shadow-2xl overflow-hidden">
          {/* Progress Indicator */}
          <div className="h-1 bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(currentIndex / totalCount) * 100}%` }}
            />
          </div>

          {/* Featured Image */}
          {item.featuredImage && (
            <div className="relative">
              <FeaturedImage
                src={item.featuredImage}
                alt={item.title}
                variant="mobile"
                className="w-full h-64"
              />

              {/* Category Badge */}
              {item.category && (
                <div className="absolute top-4 left-4">
                  <span className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md",
                    "bg-white/90 dark:bg-black/90 text-foreground"
                  )}>
                    {item.category.name}
                  </span>
                </div>
              )}

              {/* Breaking Badge */}
              {item.isBreaking && (
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1.5 bg-red-500 text-white rounded-full text-xs font-semibold animate-pulse">
                    {t('home.breakingNews')}
                  </span>
                </div>
              )}

              {/* Counter */}
              <div className="absolute bottom-4 right-4">
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md bg-black/70 text-white">
                  {currentIndex}/{totalCount}
                </span>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-3 line-clamp-2">
              {item.title}
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-4">
              {item.content}
            </p>

            {/* Read Full Article Button - Prominent */}
            {articleUrl && (
              <Link
                href={articleUrl}
                className="inline-flex items-center gap-2 w-full mb-4 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
              >
                <span className="flex-1">{t('home.readMore')}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}

            {/* Meta Info */}
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-3">
                {item.publishedAt && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}
                  </span>
                )}
                {item.viewCount && (
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {item.viewCount.toLocaleString()}
                  </span>
                )}
              </div>
              {item.readTime && (
                <span>{t('article.minRead', { minutes: item.readTime })}</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className={cn(
                    "p-3 rounded-full transition-all",
                    isLiked
                      ? "bg-red-500/10 text-red-500"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground"
                  )}
                >
                  <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
                </button>
                <span className="text-sm font-medium">{likeCount}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSpeech}
                  className={cn(
                    "p-3 rounded-full transition-all",
                    isSpeaking
                      ? "bg-primary/10 text-primary"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground"
                  )}
                  aria-label={isSpeaking ? t('home.pauseReading') : t('home.listenToArticle')}
                >
                  {isSpeaking ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </button>

                <button
                  onClick={handleShare}
                  className="p-3 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-all"
                  aria-label={t('home.shareArticle')}
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Swipe Indicators */}
          <div className="pb-4 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ChevronUp className="h-3 w-3 animate-bounce" />
              <span>{t('quickReads.swipeForMore')}</span>
            </div>
            {item.sourceArticle && (
              <Link
                href={articleUrl!}
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                {t('article.relatedArticles')} →
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default InshortCard;