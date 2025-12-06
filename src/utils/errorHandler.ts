/**
 * Global error handler utility
 * Helper functions for error handling
 */

// Store original console.error
const originalConsoleError = console.error;

// Export utility functions
export const errorHandler = {
  /**
   * Check if error is a network error
   */
  isNetworkError(error: any): boolean {
    return (
      error?.code === 'ERR_NETWORK' ||
      error?.code === 'NETWORK_ERROR' ||
      error?.message?.includes('Network Error') ||
      error?.message?.includes('Cannot connect to server')
    );
  },

  /**
   * Log error only if it's not a network error
   */
  logIfNotNetwork(error: any, context?: string): void {
    if (!this.isNetworkError(error)) {
      if (context) {
        originalConsoleError(`[${context}]`, error);
      } else {
        originalConsoleError(error);
      }
    }
  },
};
