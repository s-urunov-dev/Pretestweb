import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ScrollToTop } from "./components/ScrollToTop";

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, any>) => void;
    dataLayer: any[];
  }
}

// Import landing page (critical for FCP/LCP)
import { LandingPage } from "./pages/LandingPage";

// Lazy load pages only (non-critical)
const LoginPage = lazy(() => import("./pages/LoginPage").then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import("./pages/RegisterPage").then(m => ({ default: m.RegisterPage })));
const VerificationPage = lazy(() => import("./pages/VerificationPage").then(m => ({ default: m.VerificationPage })));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage").then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage").then(m => ({ default: m.ResetPasswordPage })));
const DashboardPage = lazy(() => import("./pages/DashboardPage").then(m => ({ default: m.DashboardPage })));
const FeedbackPage = lazy(() => import("./pages/FeedbackPage").then(m => ({ default: m.FeedbackPage })));
const ProfilePage = lazy(() => import("./pages/ProfilePage").then(m => ({ default: m.ProfilePage })));
const TestResultDetailPage = lazy(() => import("./pages/TestResultDetailPage").then(m => ({ default: m.TestResultDetailPage })));

// Import loading fallback
import { LoadingFallback } from "./components/LoadingFallback";
// Import web vitals
import { initWebVitals } from "./utils/webVitals";
// Import service worker
import { registerServiceWorker } from "./utils/registerServiceWorker";
// Import production utilities
import { initProduction } from "./utils/production";

// 404 Not Found Page
function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl text-[#182966] mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <a href="/" className="text-[#182966] hover:underline">
          Go back to home
        </a>
      </div>
    </div>
  );
}

// Google Analytics Page Tracker Component
function GoogleAnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-0WZFE3PSMS', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
}

function AppContent() {
  useEffect(() => {
    // Initialize production mode
    initProduction();

    // Initialize Web Vitals monitoring (development only)
    const isDev = typeof import.meta !== 'undefined' && import.meta.env?.DEV;
    if (typeof window !== 'undefined' && isDev) {
      initWebVitals();
    }
    
    // Register service worker in production
    const isProd = typeof import.meta !== 'undefined' && import.meta.env?.PROD;
    if (typeof window !== 'undefined' && isProd) {
      registerServiceWorker();
    }
  }, []);

  return (
    <BrowserRouter>
      <GoogleAnalyticsTracker />
      <ScrollToTop />
      <div className="min-h-screen bg-white">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth Routes - Redirect to dashboard if already logged in */}
          <Route 
            path="/login" 
            element={
              <ProtectedRoute requireAuth={false}>
                <Suspense fallback={<LoadingFallback />}>
                  <LoginPage />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/register" 
            element={
              <ProtectedRoute requireAuth={false}>
                <Suspense fallback={<LoadingFallback />}>
                  <RegisterPage />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/verification" 
            element={
              <ProtectedRoute requireAuth={false}>
                <Suspense fallback={<LoadingFallback />}>
                  <VerificationPage />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forgot-password" 
            element={
              <ProtectedRoute requireAuth={false}>
                <Suspense fallback={<LoadingFallback />}>
                  <ForgotPasswordPage />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/reset-password" 
            element={
              <ProtectedRoute requireAuth={false}>
                <Suspense fallback={<LoadingFallback />}>
                  <ResetPasswordPage />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Routes - Require authentication */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <DashboardPage />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/feedback" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <FeedbackPage />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <ProfilePage />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/result/:resultId" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <TestResultDetailPage />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          
          {/* 404 Route */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}