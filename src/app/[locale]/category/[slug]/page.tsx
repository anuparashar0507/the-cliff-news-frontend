import { notFound } from 'next/navigation';
import { getNewsByCategory } from '@/lib/api';
import NewsCard from '@/components/NewsCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Filter } from 'lucide-react';
import Link from 'next/link';

interface CategoryPageProps {
  params: {
    locale: string;
    slug: string;
  };
  searchParams: {
    page?: string;
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { locale, slug } = params;
  const page = parseInt(searchParams.page || '1');
  const limit = 12;

  try {
    // Fetch category articles
    const language = locale === 'hi' ? 'HINDI' : 'ENGLISH';
    const response = await getNewsByCategory(slug, page, limit, language);

    if (!response?.articles || response.articles.length === 0) {
      notFound();
    }

    const { articles, totalPages, currentPage } = response;

    // Get category name from first article or capitalize slug
    const categoryName = articles[0]?.category?.name ||
                        slug.charAt(0).toUpperCase() + slug.slice(1);

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
              <Link href={`/${locale}`}>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">{categoryName}</h1>
                <p className="text-muted-foreground">
                  Showing {articles.length} articles
                </p>
              </div>

              <div className="hidden md:flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {articles.map((article: any) => (
              <NewsCard
                key={article.id}
                article={article}
                variant="default"
              />
            ))}
          </div>

          {/* Empty state */}
          {articles.length === 0 && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">No articles found</h2>
              <p className="text-muted-foreground mb-6">
                There are no articles in this category yet.
              </p>
              <Link href={`/${locale}`}>
                <Button>Browse All News</Button>
              </Link>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-12">
              {/* Previous Page */}
              {currentPage > 1 && (
                <Link href={`/${locale}/category/${slug}?page=${currentPage - 1}`}>
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                </Link>
              )}

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, currentPage - 2) + i;
                if (pageNum > totalPages) return null;

                return (
                  <Link key={pageNum} href={`/${locale}/category/${slug}?page=${pageNum}`}>
                    <Button
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                    >
                      {pageNum}
                    </Button>
                  </Link>
                );
              })}

              {/* Next Page */}
              {currentPage < totalPages && (
                <Link href={`/${locale}/category/${slug}?page=${currentPage + 1}`}>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching category articles:', error);
    notFound();
  }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = params;
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  return {
    title: `${categoryName} - The Cliff News`,
    description: `Latest ${categoryName.toLowerCase()} news and updates from The Cliff News`,
  };
}