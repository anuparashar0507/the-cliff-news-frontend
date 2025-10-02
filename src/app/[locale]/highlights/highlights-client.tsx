'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Images } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import MasonryImageGrid from '@/components/MasonryImageGrid';
import type { ImageItem } from '@/components/MasonryImageGrid';

interface HighlightData {
  id: string;
  title: string;
  image: string;
  link: string;
}

const HighlightsClient = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = params.locale as string || 'en';
  const page = parseInt(searchParams.get('page') || '1');

  const [highlights, setHighlights] = useState<ImageItem[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/highlights?page=${page}&limit=20`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch highlights');
        }

        const data = await response.json();

        // Transform API data to ImageItem format
        const transformedHighlights: ImageItem[] = (data.highlights || []).map((highlight: HighlightData) => ({
          id: highlight.id,
          title: highlight.title,
          imageUrl: highlight.imageUrl,
          caption: highlight.caption,
          category: highlight.category,
          date: highlight.date || highlight.createdAt,
          allowDownload: highlight.allowDownload !== false,
          allowSharing: highlight.allowSharing !== false,
          viewCount: highlight.viewCount || 0,
          downloadCount: highlight.downloadCount || 0,
          shareCount: highlight.shareCount || 0,
        }));

        setHighlights(transformedHighlights);
        setPagination(data.pagination || {
          page: 1,
          limit: 20,
          total: transformedHighlights.length,
          pages: 1
        });
      } catch (error) {
        console.error('Error fetching highlights:', error);
        setError('Failed to load highlights');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHighlights();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', newPage.toString());
    router.push(url.pathname + url.search);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-16 bg-orange-50 dark:bg-orange-900/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <Images className="h-8 w-8 text-orange-500" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">News Highlights</h1>
                  <div className="w-16 h-1 bg-orange-600 rounded-full mx-auto"></div>
                </div>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Discover the most important stories through compelling visuals and curated content
              </p>
            </div>
          </div>
        </section>

        {/* Loading Grid */}
        <section className="py-16 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl break-inside-avoid mb-4">
                  <div className={`aspect-[${Math.random() > 0.5 ? '3/4' : '4/5'}] rounded-xl`}></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-16 bg-orange-50 dark:bg-orange-900/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <Images className="h-8 w-8 text-orange-500" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">News Highlights</h1>
                  <div className="w-16 h-1 bg-orange-600 rounded-full mx-auto"></div>
                </div>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Discover the most important stories through compelling visuals and curated content
              </p>
            </div>
          </div>
        </section>

        {/* Error State */}
        <section className="py-16 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4 text-center">
            <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-xl inline-block mb-6">
              <Images className="h-16 w-16 text-orange-500 mx-auto" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Error loading highlights</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Try Again
            </Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 bg-orange-50 dark:bg-orange-900/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <Images className="h-8 w-8 text-orange-500" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">News Highlights</h1>
                <div className="w-16 h-1 bg-orange-600 rounded-full mx-auto"></div>
              </div>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Discover the most important stories through compelling visuals and curated content
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          {highlights.length > 0 ? (
            <>
              {/* Back Button */}
              <div className="mb-8">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/${locale}`)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </div>

              {/* Page Header */}
              <div className="mb-12">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                      Highlights Collection
                    </h2>
                    <div className="w-16 h-1 bg-orange-600 rounded-full"></div>
                    <p className="text-gray-600 dark:text-gray-300 mt-3">
                      {highlights.length} visual highlights and curated stories available
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                      <Images className="h-12 w-12 text-orange-500 mx-auto mb-2" />
                      <p className="text-sm text-orange-600 dark:text-orange-400 font-medium text-center">Visual Stories</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Masonry Grid */}
              <MasonryImageGrid
                images={highlights}
                columns={4}
                className="mb-12"
                showMetadata={false}
              />

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  {/* Previous Page */}
                  {pagination.page > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      className="border-orange-200 text-orange-600 hover:bg-orange-50"
                    >
                      Previous
                    </Button>
                  )}

                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    const pageNum = Math.max(1, pagination.page - 2) + i;
                    if (pageNum > pagination.pages) return null;

                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === pagination.page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className={pageNum === pagination.page
                          ? "bg-orange-600 hover:bg-orange-700 text-white"
                          : "border-orange-200 text-orange-600 hover:bg-orange-50"
                        }
                      >
                        {pageNum}
                      </Button>
                    );
                  })}

                  {/* Next Page */}
                  {pagination.page < pagination.pages && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      className="border-orange-200 text-orange-600 hover:bg-orange-50"
                    >
                      Next
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-xl inline-block mb-6">
                <Images className="h-16 w-16 text-orange-500 mx-auto" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">No highlights found</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                There are no highlights available at the moment. Please check back later.
              </p>
              <Button
                onClick={() => router.push(`/${locale}`)}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Browse Latest News
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HighlightsClient;