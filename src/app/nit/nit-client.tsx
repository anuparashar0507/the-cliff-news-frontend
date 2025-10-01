'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye, Heart, Share2 } from 'lucide-react';
import { useNIT } from '@/hooks';
import { NIT } from '@/services';

const NITClient = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { data: nitData, isLoading, error } = useNIT({
    limit: 20,
    category: selectedCategory === 'all' ? undefined : selectedCategory,
  });

  const nits = (nitData?.nits as NIT[]) || [];

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'breaking', name: 'Breaking' },
    { id: 'politics', name: 'Politics' },
    { id: 'business', name: 'Business' },
    { id: 'sports', name: 'Sports' },
    { id: 'entertainment', name: 'Entertainment' },
  ];

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-40 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="headline-large text-foreground mb-4">Unable to Load NIT</h1>
          <p className="body-large text-muted-foreground">
            Please try again later.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="headline-xl text-foreground mb-4">News In Time</h1>
            <p className="body-large text-muted-foreground">
              Real-time news updates and breaking stories as they happen
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="transition-all duration-200"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NIT Feed */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {nits.map((nit) => (
              <article
                key={nit.id}
                className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex flex-col md:flex-row">
                  {nit.image && (
                    <div className="md:w-48 h-48 md:h-32 bg-muted flex-shrink-0">
                      <img
                        src={nit.image}
                        alt={nit.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge
                        variant={nit.isBreaking ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {nit.isBreaking ? '🔴 BREAKING' : nit.category.name}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTimeAgo(nit.publishedAt)}
                      </div>
                    </div>

                    <h2 className="headline-small text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {nit.title}
                    </h2>

                    <p className="body-medium text-muted-foreground mb-4 line-clamp-2">
                      {nit.content}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {nit.viewCount.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {nit.likeCount}
                        </div>
                      </div>

                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
            
            {nits.length === 0 && (
              <div className="text-center py-12">
                <p className="body-large text-muted-foreground">
                  No news updates available at the moment.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NITClient;