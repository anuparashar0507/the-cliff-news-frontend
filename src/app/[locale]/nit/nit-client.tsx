'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import MasonryImageGrid from '@/components/MasonryImageGrid';
import type { ImageItem } from '@/components/MasonryImageGrid';
import { NIT } from '@/services/nit';

const NITClient = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = params.locale as string || 'en';
  const page = parseInt(searchParams.get('page') || '1');

  const [nitItems, setNitItems] = useState<ImageItem[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNITItems = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/nit?page=${page}&limit=20`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch NIT items');
        }

        const data = await response.json();

        // Transform API data to ImageItem format
        const transformedNITs: ImageItem[] = (data.nits || []).map((nit: NIT) => ({
          id: nit.id,
          title: nit.title,
          imageUrl: `/api/placeholder/400/300`, // Default placeholder for NIT items
          caption: nit.description,
          category: nit.category,
          date: nit.createdAt,
          allowDownload: true, // NIT items are generally downloadable
          allowSharing: true,   // NIT items are generally shareable
          viewCount: 0,
          downloadCount: 0,
          shareCount: 0,
        }));

        setNitItems(transformedNITs);
        setPagination(data.pagination || {
          page: 1,
          limit: 20,
          total: transformedNITs.length,
          pages: 1
        });
      } catch (error) {
        console.error('Error fetching NIT items:', error);
        setError('Failed to load NIT items');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNITItems();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('page', newPage.toString());
    router.push(`/${locale}/nit?${searchParams.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-16 bg-blue-50 dark:bg-blue-900/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Notice Inviting Tenders</h1>
                  <div className="w-16 h-1 bg-blue-600 rounded-full mx-auto"></div>
                </div>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Official tender notices and procurement announcements from government and corporate organizations
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
        <section className="py-16 bg-blue-50 dark:bg-blue-900/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Notice Inviting Tenders</h1>
                  <div className="w-16 h-1 bg-blue-600 rounded-full mx-auto"></div>
                </div>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Official tender notices and procurement announcements from government and corporate organizations
              </p>
            </div>
          </div>
        </section>

        {/* Error State */}
        <section className="py-16 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4 text-center">
            <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-xl inline-block mb-6">
              <Clock className="h-16 w-16 text-orange-500 mx-auto" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Error loading NIT items</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
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
      <section className="py-16 bg-blue-50 dark:bg-blue-900/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Notice Inviting Tenders</h1>
                <div className="w-16 h-1 bg-blue-600 rounded-full mx-auto"></div>
              </div>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Official tender notices and procurement announcements from government and corporate organizations
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          {nitItems.length > 0 ? (
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
                      NIT Collection
                    </h2>
                    <div className="w-16 h-1 bg-blue-600 rounded-full"></div>
                    <p className="text-gray-600 dark:text-gray-300 mt-3">
                      {nitItems.length} tender notices and procurement announcements available
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <Clock className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium text-center">Official Tenders</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Masonry Grid */}
              <MasonryImageGrid
                images={nitItems}
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
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
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
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "border-blue-200 text-blue-600 hover:bg-blue-50"
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
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      Next
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl inline-block mb-6">
                <Clock className="h-16 w-16 text-blue-500 mx-auto" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">No NIT items found</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                There are no NIT items available at the moment. Please check back later.
              </p>
              <Button
                onClick={() => router.push(`/${locale}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
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

export default NITClient;