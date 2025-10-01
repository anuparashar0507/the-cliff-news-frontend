import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Header from "./Header";
import StockTicker from "./StockTicker";
import EnhancedHeroSection from "./EnhancedHeroSection";
import NewsCard from "./NewsCard";
import QuickReadCard from "./QuickReadCard";
import EnhancedCategorySection from "./EnhancedCategorySection";
import CombinedCategorySection from "./CombinedCategorySection";
import HorizontalVideoScroll from "./HorizontalVideoScroll";
import HighlightsSection from "./HighlightsSection";
import HoroscopeSection from "./HoroscopeSection";
import Footer from "./Footer";
import {
  getArticles,
  getTopStories,
  getBreakingNews,
  getQuickReads,
  getHighlights,
  getYouTubeShorts,
} from "@/lib/api";

const Homepage = async ({ locale = 'en' }: { locale?: string }) => {
  // Convert locale to backend language format
  const language = locale === 'hi' ? 'HINDI' : 'ENGLISH';

  // Fetch data server-side for SEO with language filtering
  const articlesData = await getArticles(10, language);
  const quickReadsData = await getQuickReads(5, language);
  const breakingNewsData = await getBreakingNews(3, language);
  const topStoriesData = await getTopStories(4, language);
  const highlightsData = await getHighlights(6);
  const videoBytesData = await getYouTubeShorts(10);

  console.log('Current locale:', locale, 'Language:', language);

  // Filter articles by category
  const articles = (articlesData?.articles as any[]) || [];

  // Individual category sections
  const nationalNews = articles.filter(
    (article) => article.category?.name === "National"
  );
  const worldNews = articles.filter(
    (article) => article.category?.name === "World" || article.category?.name === "International"
  );
  const entertainmentNews = articles.filter(
    (article) => article.category?.name === "Entertainment"
  );
  const politicsNews = articles.filter(
    (article) => article.category?.name === "Politics"
  );

  // Combined sections
  const scienceTechNews = articles.filter(
    (article) =>
      article.category?.name === "Science" ||
      article.category?.name === "Technology" ||
      article.category?.name === "Tech"
  );
  const lifestyleTravelNews = articles.filter(
    (article) =>
      article.category?.name === "Lifestyle" ||
      article.category?.name === "Travel"
  );
  const sportsBusinessNews = articles.filter(
    (article) =>
      article.category?.name === "Sports" ||
      article.category?.name === "Business" ||
      article.category?.name === "Finance"
  );


  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Stock Market Ticker */}
      <StockTicker />

      {/* Enhanced Hero Section */}
      <EnhancedHeroSection featuredArticles={articles} />

      {/* Top Stories - Full Width */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="headline-medium text-brand-navy mb-2">
                Top Stories
              </h2>
              <div className="w-12 h-1 bg-primary rounded-full"></div>
            </div>
          </div>

          {/* Full Width Top Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {((topStoriesData?.topStories as any[]) || []).map((article) => (
              <NewsCard key={article.id} article={article} variant="featured" />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Reads Preview */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="headline-medium text-foreground mb-2">
                Quick Reads
              </h2>
              <div className="w-12 h-1 bg-primary rounded-full"></div>
              <p className="body-medium text-muted-foreground mt-2">
                Stay informed with bite-sized news updates
              </p>
            </div>

            <Link
              href="/inshorts"
              className="inline-flex items-center border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors group"
            >
              View All Quick Reads
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {((quickReadsData?.inshorts as any[]) || []).map((item) => (
              <QuickReadCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>


      {/* National News Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="headline-medium text-brand-navy mb-2">
                National News
              </h2>
              <div className="w-12 h-1 bg-primary rounded-full"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nationalNews.map((article) => (
              <NewsCard key={article.id} article={article} variant="default" />
            ))}
          </div>
        </div>
      </section>

      {/* World News Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="headline-medium text-foreground mb-2">
                World News
              </h2>
              <div className="w-12 h-1 bg-primary rounded-full"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {worldNews.map((article) => (
              <NewsCard key={article.id} article={article} variant="default" />
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Category Sections */}
      <EnhancedCategorySection
        title="Politics"
        articles={politicsNews}
        layout="hero"
        backgroundColor="muted"
        categorySlug="politics"
      />

      <EnhancedCategorySection
        title="Entertainment"
        articles={entertainmentNews}
        layout="featured"
        backgroundColor="default"
        categorySlug="entertainment"
      />

      {/* Breaking News Section */}
      <section className="py-12 bg-red-50 dark:bg-red-950/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="headline-medium text-red-700 dark:text-red-400 mb-2">
                🚨 Breaking News
              </h2>
              <div className="w-12 h-1 bg-red-500 rounded-full"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {((breakingNewsData?.articles as any[]) || []).map((article) => (
              <NewsCard key={article.id} article={article} variant="breaking" />
            ))}
          </div>
        </div>
      </section>

      {/* Combined Category Section */}
      <CombinedCategorySection
        title="Science & Technology + Lifestyle"
        subtitle="Explore the latest in tech innovations and lifestyle trends"
        backgroundColor="accent"
        categories={[
          { name: "Science & Technology", articles: scienceTechNews, color: "bg-blue-500" },
          { name: "Lifestyle & Travel", articles: lifestyleTravelNews, color: "bg-green-500" },
          { name: "Sports & Business", articles: sportsBusinessNews, color: "bg-orange-500" }
        ]}
      />

      {/* Video Bytes Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="headline-medium text-brand-navy mb-2">
                Video Bytes
              </h2>
              <div className="w-12 h-1 bg-primary rounded-full"></div>
              <p className="body-medium text-muted-foreground mt-2">
                Quick video updates from around the world
              </p>
            </div>
          </div>
          <HorizontalVideoScroll videos={videoBytesData?.shorts || []} maxVideos={10} />
        </div>
      </section>

      {/* Highlights Section */}
      <HighlightsSection highlights={highlightsData?.highlights || []} />

      {/* Horoscope Section */}
      <HoroscopeSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Homepage;