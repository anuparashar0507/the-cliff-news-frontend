'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CompactEPaperSection from '@/components/CompactEPaperSection';

const EpaperClient = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CompactEPaperSection />
      <Footer />
    </div>
  );
};

export default EpaperClient;