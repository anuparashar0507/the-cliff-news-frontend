'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InfiniteVideoScroll from '@/components/InfiniteVideoScroll';

interface VideosClientProps {
  locale: string;
}

const VideosClient = ({ locale }: VideosClientProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'shorts'>('shorts');
  const [isDesktop, setIsDesktop] = useState(false);
  const router = useRouter();

  // Check if it's desktop on mount and window resize
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  const handleBackToHome = () => {
    // Navigate back to home with current locale
    router.push(`/${locale}`);
  };

  const handleLogoClick = () => {
    // Navigate to home with current locale
    router.push(`/${locale}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* No banner - just full-screen videos */}
      <InfiniteVideoScroll
        isDesktop={isDesktop}
        onNavigateHome={handleBackToHome}
        currentLocale={locale}
      />
    </div>
  );
};

export default VideosClient;