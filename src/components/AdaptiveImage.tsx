import React from 'react';
import { resolveImageSrc } from '../utils/imageResolver';

interface AdaptiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  figmaAsset?: string;
  fallback?: string;
}

/**
 * AdaptiveImage Component
 * Figma Make serverida figma:asset dan, local'da public/images/ dan rasm oladi
 * 
 * Usage:
 *   <AdaptiveImage figmaAsset={importedImage} alt="..." />
 *   <AdaptiveImage src="/images/logo.png" alt="..." />
 */
export function AdaptiveImage({ figmaAsset, fallback, src, alt = '', ...props }: AdaptiveImageProps) {
  const resolvedSrc = figmaAsset ? resolveImageSrc(figmaAsset, fallback) : src;

  return (
    <img 
      src={resolvedSrc} 
      alt={alt}
      {...props}
    />
  );
}
