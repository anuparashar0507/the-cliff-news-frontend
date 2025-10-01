'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MasonryHighlights from '@/components/MasonryHighlights';

const HighlightsClient = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="headline-xl text-foreground mb-4">News Highlights</h1>
            <p className="body-large text-muted-foreground">
              Discover the most important stories through compelling visuals and curated content
            </p>
          </div>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="py-12">
        <MasonryHighlights />
      </section>

      <Footer />
    </div>
  );
};

export default HighlightsClient;