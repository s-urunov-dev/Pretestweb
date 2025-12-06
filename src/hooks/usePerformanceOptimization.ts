import { useEffect, useState } from 'react';

/**
 * Performance optimization hook
 * - Prefetch critical resources
 * - Optimize animations based on user preferences
 * - Add resource hints
 */
export function usePerformanceOptimization() {
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    }

    // Preconnect to API
    const preconnectLink = document.createElement('link');
    preconnectLink.rel = 'preconnect';
    preconnectLink.href = 'https://api.pre-test.uz';
    document.head.appendChild(preconnectLink);

    // DNS prefetch for external resources
    const dnsPrefetch = document.createElement('link');
    dnsPrefetch.rel = 'dns-prefetch';
    dnsPrefetch.href = 'https://api.pre-test.uz';
    document.head.appendChild(dnsPrefetch);

    // Add resource hints for critical assets
    const addResourceHint = (href: string, as: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = as;
      link.href = href;
      document.head.appendChild(link);
    };

    // Cleanup
    return () => {
      // Remove added elements if needed
    };
  }, []);
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver(
  element: HTMLElement | null,
  callback: () => void,
  options?: IntersectionObserverInit
) {
  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
        }
      });
    }, options);

    observer.observe(element);

    return () => observer.disconnect();
  }, [element, callback, options]);
}

/**
 * Debounce hook for performance
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
