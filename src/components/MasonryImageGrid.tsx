"use client";

import { useState, useEffect } from 'react';
import { Download, Share2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageLightbox from '@/components/ImageLightbox';
import { cn } from '@/lib/utils';

export interface ImageItem {
  id: string;
  title: string;
  imageUrl: string;
  caption?: string;
  category?: string;
  date: string;
  allowDownload?: boolean;
  allowSharing?: boolean;
  viewCount?: number;
  downloadCount?: number;
  shareCount?: number;
}

interface MasonryImageGridProps {
  images: ImageItem[];
  columns?: number;
  className?: string;
  showMetadata?: boolean;
  onImageClick?: (image: ImageItem) => void;
}

const MasonryImageGrid: React.FC<MasonryImageGridProps> = ({
  images,
  columns = 4,
  className = '',
  showMetadata = true,
  onImageClick
}) => {
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [imageHeights, setImageHeights] = useState<{ [key: string]: number }>({});
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleImageLoad = (imageId: string, height: number) => {
    setImageHeights(prev => ({
      ...prev,
      [imageId]: height
    }));
    setLoadedImages(prev => new Set(prev).add(imageId));
  };

  const handleImageClick = (image: ImageItem) => {
    setSelectedImage(image);
    if (onImageClick) {
      onImageClick(image);
    }
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

  // Pinterest-style masonry layout using CSS Grid
  const getColumnStyle = () => {
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: '1rem',
      gridAutoRows: 'masonry', // Modern browsers with masonry support
    };
  };

  // Fallback: Calculate column assignment for browsers without masonry support
  const getColumnAssignments = () => {
    if (!images.length) return {};

    const columnHeights = new Array(columns).fill(0);
    const assignments: { [key: string]: number } = {};

    images.forEach(image => {
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      assignments[image.id] = shortestColumnIndex;

      // Use actual image height if available, otherwise estimate
      const actualHeight = imageHeights[image.id];
      const estimatedHeight = actualHeight || 300; // Default estimate
      columnHeights[shortestColumnIndex] += estimatedHeight + 24; // 24px for gap
    });

    return assignments;
  };

  const columnAssignments = getColumnAssignments();

  // Group images by column for fallback layout
  const imagesByColumn = new Array(columns).fill(null).map(() => [] as ImageItem[]);
  images.forEach(image => {
    const columnIndex = columnAssignments[image.id];
    if (columnIndex !== undefined) {
      imagesByColumn[columnIndex].push(image);
    }
  });

  return (
    <>
      <div className={cn("w-full", className)}>
        {/* Pinterest-style masonry layout */}
        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
          {images.map((image) => (
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
                  className={cn(
                    "w-full h-auto object-cover transition-all duration-300 group-hover:scale-105",
                    !loadedImages.has(image.id) && "opacity-0"
                  )}
                  onLoad={(e) => {
                    const target = e.target as HTMLImageElement;
                    handleImageLoad(image.id, target.offsetHeight);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: 'auto'
                  }}
                />

                {/* Loading placeholder */}
                {!loadedImages.has(image.id) && (
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center min-h-[200px]">
                    <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                {/* Date Badge - Top Left */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-black/80 text-white text-xs rounded-full backdrop-blur-sm">
                    {new Date(image.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                {/* Action Buttons - Top Right */}
                <div className="absolute top-3 right-3 flex gap-2">
                  {image.allowDownload !== false && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-black/80 hover:bg-black/90 text-white border-none backdrop-blur-sm w-8 h-8 p-0"
                      onClick={(e) => handleDownload(image, e)}
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}

                  {image.allowSharing !== false && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-black/80 hover:bg-black/90 text-white border-none backdrop-blur-sm w-8 h-8 p-0"
                      onClick={(e) => handleShare(image, e)}
                      title="Share"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Hover Overlay for View Action */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/90 hover:bg-white text-black border-none backdrop-blur-sm"
                      title="View Fullscreen"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              {showMetadata && (
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {image.title}
                  </h3>

                  {image.caption && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {image.caption}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>
                      {new Date(image.date).toLocaleDateString()}
                    </span>

                    {(image.viewCount !== undefined || image.downloadCount !== undefined) && (
                      <div className="flex items-center gap-3">
                        {image.viewCount !== undefined && (
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {image.viewCount}
                          </span>
                        )}
                        {image.downloadCount !== undefined && (
                          <span className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            {image.downloadCount}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <ImageLightbox
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageSrc={selectedImage.imageUrl}
          imageAlt={selectedImage.title}
          title={selectedImage.title}
          allowDownload={selectedImage.allowDownload !== false}
          allowSharing={selectedImage.allowSharing !== false}
        />
      )}
    </>
  );
};

export default MasonryImageGrid;