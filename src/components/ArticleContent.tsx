"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Share2, Volume2, VolumeX, Clock, Eye, Calendar, User } from 'lucide-react';
import { FeaturedImage } from '@/components/FeaturedImage';
import { useTranslations } from 'next-intl';
import { formatDistanceToNow, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ArticleSkeleton } from '@/components/skeletons/CardSkeleton';
import { Button } from '@/components/ui/button';
import { SafeHtmlRenderer } from '@/components/SafeHtmlRenderer';

interface ArticleContentProps {
  slug: string;
  locale: string;
  isFromInshorts?: boolean;
  inshortsIndex?: string;
}

export default function ArticleContent({
  slug,
  locale,
  isFromInshorts = false,
  inshortsIndex
}: ArticleContentProps) {
  const t = useTranslations();
  const router = useRouter();
  const [article, setArticle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const language = locale === 'hi' ? 'HINDI' : 'ENGLISH';
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/articles/slug/${slug}?language=${language}`
        );
        const data = await response.json();
        setArticle(data);
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [slug, locale]);

  const handleBack = () => {
    if (isFromInshorts) {
      // Navigate back to InShorts with specific index
      const inshortsUrl = `/${locale}/inshorts${inshortsIndex ? `?index=${inshortsIndex}` : ''}`;
      router.push(inshortsUrl);
    } else {
      router.back();
    }
  };

  const toggleSpeech = () => {
    if ('speechSynthesis' in window && article) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        // Clean HTML content for speech
        const textContent = article.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        const text = `${article.title}. ${textContent}`;
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = locale === 'hi' ? 'hi-IN' : 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt || article.title,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share failed:', err);
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

  if (isLoading) {
    return <ArticleSkeleton />;
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">{t('common.error')}</h1>
          <p className="text-muted-foreground mb-4">Article not found</p>
          <Button onClick={handleBack}>{t('common.goBack')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Back Button */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {isFromInshorts ? t('quickReads.title') : t('common.back')}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSpeech}
                className={cn(
                  "flex items-center gap-2",
                  isSpeaking && "bg-primary/10 text-primary"
                )}
              >
                {isSpeaking ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {isSpeaking ? t('home.pauseReading') : t('home.listenToArticle')}
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">{t('home.shareArticle')}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Category & Breaking Badge */}
        <div className="flex items-center gap-3 mb-4">
          {article.category && (
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {article.category.name}
            </span>
          )}
          {article.isBreaking && (
            <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-sm font-medium animate-pulse">
              {t('home.breakingNews')}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
          {article.title}
        </h1>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-xl text-muted-foreground leading-relaxed mb-6">
            {article.excerpt}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b">
          {article.author && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{t('article.author', { author: article.author.name })}</span>
            </div>
          )}
          
          {article.publishedAt && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(article.publishedAt), 'PPP')}</span>
            </div>
          )}

          {article.readTime && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{t('article.minRead', { minutes: article.readTime })}</span>
            </div>
          )}

          {article.viewCount && (
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{article.viewCount.toLocaleString()} views</span>
            </div>
          )}
        </div>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="mb-8">
            <FeaturedImage
              src={article.featuredImage}
              alt={article.title}
              variant="hero"
              className="w-full rounded-2xl"
              priority
            />
          </div>
        )}

        {/* Article Content */}
        <SafeHtmlRenderer
          html={article.content}
          className="max-w-none"
        />

        {/* Tags */}
        {article.tags && (
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.split(',').map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}