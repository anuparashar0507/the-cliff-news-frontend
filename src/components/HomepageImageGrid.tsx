"use client";

import { useState } from 'react';
import { ArrowRight, Images, Clock, Download, Share2, Eye } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ImageLightbox from '@/components/ImageLightbox';
import type { ImageItem } from '@/components/MasonryImageGrid';

interface HomepageImageGridProps {
  title: string;
  subtitle: string;
  items: any[];
  type: 'highlights' | 'nit';
  locale: string;
  icon?: React.ReactNode;
  bgColor?: string;
  linkColor?: string;
}

const HomepageImageGrid: React.FC<HomepageImageGridProps> = ({
  title,
  subtitle,
  items,
  type,
  locale,
  icon,
  bgColor = 'bg-primary/10',
  linkColor = 'bg-primary'
}) => {
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

  // Transform API data to ImageItem format
  const imageItems: ImageItem[] = items.map((item: any) => ({
    id: item.id,
    title: item.title,
    imageUrl: item.imageUrl,
    caption: item.caption,
    category: item.category,
    date: item.date || item.createdAt,
    allowDownload: item.allowDownload !== false,
    allowSharing: item.allowSharing !== false,
    viewCount: item.viewCount || 0,
    downloadCount: item.downloadCount || 0,
    shareCount: item.shareCount || 0,
  }));

  const handleImageClick = (image: ImageItem) => {
    setSelectedImage(image);
  };

  const handleDownload = async (image: ImageItem, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(image.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${image.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleShare = async (image: ImageItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: image.title,
      text: `Check out this image: ${image.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  if (!imageItems.length) return null;

  return (
    <>
      <section className={`py-16 ${bgColor}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-4 mb-4">
                {icon && (
                  <div className="p-3 bg-white/80 dark:bg-gray-800/80 rounded-lg">
                    {icon}
                  </div>
                )}
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {title}
                  </h2>
                  <div className="w-16 h-1 bg-current rounded-full opacity-60"></div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {subtitle}
              </p>
            </div>

            <Link href={`/${locale}/${type}`}>
              <Button className={`hidden md:inline-flex items-center ${linkColor} hover:opacity-90 text-white px-6 py-3 rounded-lg font-medium transition-colors group`}>
                View All {title}
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Pinterest-style Grid Display */}
          <div className="columns-2 md:columns-3 lg:columns-5 gap-4 space-y-4">
            {imageItems.slice(0, 5).map((image) => (
              <div
                key={image.id}
                className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer break-inside-avoid mb-4"
                onClick={() => handleImageClick(image)}
              >
                {/* Image Container - Pinterest style with natural aspect ratio */}
                <div className="relative overflow-hidden">
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-auto object-cover transition-all duration-300 group-hover:scale-105"
                    style={{
                      display: 'block',
                      width: '100%',
                      height: 'auto'
                    }}
                  />

                  {/* Date Badge - Top Left */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-black/80 text-white text-xs rounded-full backdrop-blur-sm">
                      {new Date(image.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Action Buttons - Top Right */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {image.allowDownload && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-black/80 hover:bg-black/90 text-white border-none backdrop-blur-sm w-7 h-7 p-0"
                        onClick={(e) => handleDownload(image, e)}
                        title="Download"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    )}

                    {image.allowSharing && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-black/80 hover:bg-black/90 text-white border-none backdrop-blur-sm w-7 h-7 p-0"
                        onClick={(e) => handleShare(image, e)}
                        title="Share"
                      >
                        <Share2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  {/* Hover Overlay for View Action */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white text-black border-none backdrop-blur-sm text-xs"
                        title="View Fullscreen"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile View All Button */}
          <div className="flex justify-center mt-8 md:hidden">
            <Link href={`/${locale}/${type}`}>
              <Button className={`inline-flex items-center ${linkColor} hover:opacity-90 text-white px-6 py-3 rounded-lg font-medium transition-colors group`}>
                View All {title}
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <ImageLightbox
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageSrc={selectedImage.imageUrl}
          imageAlt={selectedImage.title}
          title={selectedImage.title}
          allowDownload={selectedImage.allowDownload}
          allowSharing={selectedImage.allowSharing}
        />
      )}
    </>
  );
};

export default HomepageImageGrid;