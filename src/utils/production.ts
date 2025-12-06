/**
 * Production utilities
 * Disables console logs in production
 */

export function initProduction() {
  const isProd = typeof import.meta !== 'undefined' && import.meta.env?.PROD;
  if (isProd) {
    // Disable console logs in production
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
    
    // Keep warnings and errors for monitoring
    // console.warn and console.error remain active
  }
}

/**
 * Check if running in production
 */
export const isProduction = () => typeof import.meta !== 'undefined' && import.meta.env?.PROD;

/**
 * Check if running in development
 */
export const isDevelopment = () => typeof import.meta !== 'undefined' && import.meta.env?.DEV;

/**
 * Get API base URL based on environment
 */
export const getApiBaseUrl = () => {
  const apiUrl = typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL;
  return apiUrl || 'https://api.pre-test.uz/api/v1';
};
