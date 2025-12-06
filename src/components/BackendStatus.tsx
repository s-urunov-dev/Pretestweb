import { useState, useEffect } from 'react';
import { apiService } from '../services/api.service';

/**
 * BackendStatus Component
 * 
 * Quietly monitors backend connection in the background.
 * Only shows a subtle badge when backend is actually connected (not in mock mode).
 * This helps during development to know when you're using real vs mock data.
 */
export function BackendStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    checkBackend();
    
    // Check periodically (every 30 seconds)
    const interval = setInterval(checkBackend, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const checkBackend = async () => {
    try {
      const isHealthy = await apiService.checkHealth();
      if (isHealthy) {
        setIsConnected(true);
        setShowBadge(true);
      } else {
        setIsConnected(false);
        setShowBadge(true);
      }
    } catch (error) {
      setIsConnected(false);
      setShowBadge(true);
      // Silent fail - we're using mock data
    }
  };

  // Only show badge if backend is actually connected
  if (!showBadge) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs shadow-lg flex items-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        <span>Live Backend</span>
      </div>
    </div>
  );
}