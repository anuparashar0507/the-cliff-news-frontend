import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ScrollingTicker from "./ScrollingTicker";
import EnhancedHeroSection from "./EnhancedHeroSection";
import NewsCard from "./NewsCard";
import QuickReadsSection from "./QuickReadsSection";
import DynamicCategorySections from "./DynamicCategorySections";
import HorizontalVideoScroll from "./HorizontalVideoScroll";
import HomepageImageGrid from "./HomepageImageGrid";
import HoroscopeSection from "./HoroscopeSection";
import { Images, Clock } from "lucide-react";
import {
  getArticles,
  getTopStories,
  getBreakingNews,
  getQuickReads,
  getHighlights,
  getYouTubeShorts,
  getNit,
} from "@/lib/api";
import { Article } from "@/services/articles";

const Homepage = async ({ locale = 'en' }: { locale?: string }) => {
  // Convert locale to backend language format
  const language = locale === 'hi' ? 'HINDI' : 'ENGLISH';

  // Fetch critical data first
  const articlesData = await getArticles(10, language);
  const topStoriesData = await getTopStories(4, language);

  // Then fetch less critical data with error fallbacks
  const settledResults = await Promise.allSettled([
    getQuickReads(5, language),
    getBreakingNews(3, language),
    getHighlights(5),
    getNit(5),
    getYouTubeShorts(10)
  ]);

  const quickReadsData = settledResults[0].status === 'fulfilled' ? settledResults[0].value : null;
  const breakingNewsData = settledResults[1].status === 'fulfilled' ? settledResults[1].value : null;
  const highlightsData = settledResults[2].status === 'fulfilled' ? settledResults[2].value : null;
  const nitData = settledResults[3].status === 'fulfilled' ? settledResults[3].value : null;
  const videoBytesData = settledResults[4].status === 'fulfilled' ? settledResults[4].value : null;

  console.log('Current locale:', locale, 'Language:', language);

  // Filter articles by category for hero section
  const articles: Article[] = articlesData?.articles || [];


  return (
    <div className="min-h-screen bg-background">
      {/* Live Market Ticker */}
      <ScrollingTicker />

      {/* Enhanced Hero Section */}
      <EnhancedHeroSection featuredArticles={articles} />

      {/* Top Stories - Full Width */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Top Stories
              </h2>
              <div className="w-16 h-1 bg-blue-600 rounded-full"></div>
              <p className="text-gray-600 dark:text-gray-300 mt-3">
                The most important news happening right now
              </p>
            </div>
          </div>

          {/* Enhanced Top Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {(topStoriesData?.topStories || []).map((article, index) => (
              <div key={article.id} className={`${index < 2 ? 'xl:col-span-2' : ''}`}>
                <NewsCard article={article} variant="featured" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Breaking News Banner */}
      {breakingNewsData?.articles && breakingNewsData.articles.length > 0 && (
        <section className="py-8 bg-gradient-to-r from-red-600 to-red-700">
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <span className="bg-white text-red-600 px-3 py-1 rounded-full text-sm font-bold mr-4 animate-pulse">
                  🚨 BREAKING
                </span>
                <h2 className="text-white text-xl font-bold">Latest Breaking News</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(breakingNewsData?.articles || []).slice(0, 3).map((article: Article) => (
                <div key={article.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="text-white font-semibold text-sm leading-tight mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <Link
                    href={`/${locale}/article/${article.slug}`}
                    className="text-white/80 hover:text-white text-xs inline-flex items-center"
                  >
                    Read more <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick Reads Section */}
      <QuickReadsSection locale={locale} />

      {/* Dynamic Category Sections - All Categories */}
      <DynamicCategorySections
        language={language}
        excludeCategories={[]} // Show all categories
      />

      {/* Video Bytes Section */}
      <HorizontalVideoScroll
        videos={videoBytesData?.shorts || []}
        title="Video Bytes"
        subtitle="News in motion - quick video updates"
      />

      {/* News Highlights Section */}
      {highlightsData?.highlights && highlightsData.highlights.length > 0 && (
        <HomepageImageGrid
          title="News Highlights"
          subtitle="Visual highlights and important stories from The Cliff News"
          items={highlightsData.highlights}
          type="highlights"
          locale={locale}
          icon={<Images className="h-8 w-8 text-orange-500" />}
          bgColor="bg-orange-50 dark:bg-orange-900/10"
          linkColor="bg-orange-500 hover:bg-orange-600"
        />
      )}

      {/* Notice Inviting Tenders (NIT) Section */}
      {nitData?.nits && nitData.nits.length > 0 && (
        <HomepageImageGrid
          title="Notice Inviting Tenders (NIT)"
          subtitle="Official tender notices and procurement announcements"
          items={nitData.nits}
          type="nit"
          locale={locale}
          icon={<Clock className="h-8 w-8 text-blue-500" />}
          bgColor="bg-blue-50 dark:bg-blue-900/10"
          linkColor="bg-blue-500 hover:bg-blue-600"
        />
      )}

      {/* Horoscope Section */}
      <HoroscopeSection />
    </div>
  );
};

export default Homepage;