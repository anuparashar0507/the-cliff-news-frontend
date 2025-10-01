export interface CloudinaryImageProps {
  src: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  crop?: 'fill' | 'fit' | 'scale' | 'thumb' | 'crop';
  gravity?: 'auto' | 'center' | 'face' | 'faces';
}

export const getCloudinaryUrl = ({
  src,
  width,
  height,
  quality = 'auto',
  format = 'auto',
  crop = 'fill',
  gravity = 'auto'
}: CloudinaryImageProps): string => {
  // If already a Cloudinary URL, extract the public ID
  if (src.includes('cloudinary')) {
    const parts = src.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex !== -1) {
      const publicId = parts.slice(uploadIndex + 2).join('/');
      const baseUrl = parts.slice(0, uploadIndex + 1).join('/');
      
      const transformations = [];
      if (width) transformations.push(`w_${width}`);
      if (height) transformations.push(`h_${height}`);
      transformations.push(`c_${crop}`);
      transformations.push(`g_${gravity}`);
      transformations.push(`q_${quality}`);
      transformations.push(`f_${format}`);
      
      return `${baseUrl}/${transformations.join(',')}/${publicId}`;
    }
  }
  
  // Return original URL if not Cloudinary
  return src;
};

// Preset transformations for different contexts
export const imageTransformations = {
  hero: { width: 1200, height: 675, crop: 'fill' as const },
  card: { width: 400, height: 300, crop: 'fill' as const },
  thumbnail: { width: 150, height: 150, crop: 'thumb' as const },
  ogImage: { width: 1200, height: 630, crop: 'fill' as const },
  mobile: { width: 360, height: 270, crop: 'fill' as const },
  tablet: { width: 768, height: 432, crop: 'fill' as const }
};