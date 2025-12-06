import { useState, useEffect, useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  priority?: boolean;
}

/**
 * Optimized image component with lazy loading and intersection observer
 */
export function OptimizedImage({ 
  src, 
  alt, 
  priority = false, 
  className,
  ...props 
}: OptimizedImageProps) {
  const [isVisible, setIsVisible] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) return; // Skip lazy loading for priority images

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  if (!isVisible) {
    // Show placeholder until image is in viewport
    return (
      <div
        ref={imgRef as any}
        className={`bg-gray-200 animate-pulse ${className || ''}`}
        style={{ minHeight: '200px', ...props.style }}
      />
    );
  }

  return (
    <ImageWithFallback
      ref={imgRef as any}
      src={src}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      {...props}
    />
  );
}
