'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InfiniteVideoScroll from '@/components/InfiniteVideoScroll';

const VideosClient = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="headline-xl text-foreground mb-4">Video Bytes</h1>
            <p className="body-large text-muted-foreground">
              Watch the latest news videos and breaking stories
            </p>
          </div>
        </div>
      </section>

      {/* Video Feed */}
      <section className="py-12">
        <InfiniteVideoScroll />
      </section>

      <Footer />
    </div>
  );
};

export default VideosClient;