import React, { useState, useEffect } from 'react';
import { resolveImageSrc, getUnsplashFallback } from '../utils/imageResolver';

interface AdaptiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  figmaAsset?: string;
  fallback?: string;
  filename?: string; // e.g., 'hero-image.png' for Unsplash fallback
  useUnsplashFallback?: boolean;
}

/**
 * AdaptiveImage Component
 * Automatically handles image loading with fallbacks:
 * 1. Figma CDN (figma:asset) - Figma Make platformasida
 * 2. Local public/images/ - Development
 * 3. Unsplash placeholder - Agar rasm topilmasa
 * 
 * Usage:
 *   <AdaptiveImage figmaAsset={importedImage} fallback="/images/hero.png" filename="hero-image.png" alt="..." />
 *   <AdaptiveImage src="/images/logo.png" alt="..." />
 */
export function AdaptiveImage({ 
  figmaAsset, 
  fallback, 
  filename,
  src, 
  alt = '', 
  useUnsplashFallback = true,
  ...props 
}: AdaptiveImageProps) {
  const initialSrc = figmaAsset ? resolveImageSrc(figmaAsset, fallback) : (src || fallback);
  const [imageSrc, setImageSrc] = useState<string>(initialSrc || '');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImageSrc(initialSrc || '');
    setHasError(false);
  }, [initialSrc]);

  const handleError = () => {
    if (!hasError && useUnsplashFallback && filename) {
      console.log('[AdaptiveImage] Image failed to load, using Unsplash fallback');
      setImageSrc(getUnsplashFallback(filename));
      setHasError(true);
    }
  };

  if (!imageSrc) {
    return null;
  }

  return (
    <img 
      src={imageSrc} 
      alt={alt}
      onError={handleError}
      {...props}
    />
  );
}