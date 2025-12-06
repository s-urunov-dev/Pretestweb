/**
 * Web Vitals monitoring utility
 * Tracks Core Web Vitals (LCP, FID, CLS, FCP, TTFB)
 */

interface Metric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

/**
 * Report Web Vitals to console (in development)
 * In production, send to analytics
 */
export function reportWebVitals(metric: Metric) {
  // Log in development only
  const isDev = typeof import.meta !== 'undefined' && import.meta.env?.DEV;
  if (isDev) {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating
    });
  }
  
  // In production, send to analytics service
  const isProd = typeof import.meta !== 'undefined' && import.meta.env?.PROD;
  if (isProd) {
    // Example: analytics.track('web-vital', metric);
    // Add your analytics service here
  }
}

/**
 * Observe Largest Contentful Paint (LCP)
 * Good: < 2.5s, Needs Improvement: 2.5s - 4s, Poor: > 4s
 */
export function observeLCP(callback: (metric: Metric) => void) {
  if (typeof window === 'undefined') return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
      
      const value = lastEntry.renderTime || lastEntry.loadTime || 0;
      const rating = value < 2500 ? 'good' : value < 4000 ? 'needs-improvement' : 'poor';
      
      callback({ name: 'LCP', value, rating });
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    // PerformanceObserver not supported
  }
}

/**
 * Observe First Input Delay (FID)
 * Good: < 100ms, Needs Improvement: 100ms - 300ms, Poor: > 300ms
 */
export function observeFID(callback: (metric: Metric) => void) {
  if (typeof window === 'undefined') return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        const value = entry.processingStart - entry.startTime;
        const rating = value < 100 ? 'good' : value < 300 ? 'needs-improvement' : 'poor';
        
        callback({ name: 'FID', value, rating });
      });
    });
    
    observer.observe({ entryTypes: ['first-input'] });
  } catch (e) {
    // PerformanceObserver not supported
  }
}

/**
 * Observe Cumulative Layout Shift (CLS)
 * Good: < 0.1, Needs Improvement: 0.1 - 0.25, Poor: > 0.25
 */
export function observeCLS(callback: (metric: Metric) => void) {
  if (typeof window === 'undefined') return;

  try {
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      const rating = clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor';
      callback({ name: 'CLS', value: clsValue, rating });
    });
    
    observer.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    // PerformanceObserver not supported
  }
}

/**
 * Observe First Contentful Paint (FCP)
 * Good: < 1.8s, Needs Improvement: 1.8s - 3s, Poor: > 3s
 */
export function observeFCP(callback: (metric: Metric) => void) {
  if (typeof window === 'undefined') return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const value = entry.startTime;
        const rating = value < 1800 ? 'good' : value < 3000 ? 'needs-improvement' : 'poor';
        
        callback({ name: 'FCP', value, rating });
      });
    });
    
    observer.observe({ entryTypes: ['paint'] });
  } catch (e) {
    // PerformanceObserver not supported
  }
}

/**
 * Initialize all Web Vitals observers
 */
export function initWebVitals() {
  observeLCP(reportWebVitals);
  observeFID(reportWebVitals);
  observeCLS(reportWebVitals);
  observeFCP(reportWebVitals);
}
