import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({ children, requireAuth = true, redirectTo = "/login" }: ProtectedRouteProps) {
  const location = useLocation();
  const token = localStorage.getItem('accessToken');
  const savedUser = localStorage.getItem('user');
  const isAuthenticated = !!(token && savedUser);

  if (requireAuth && !isAuthenticated) {
    // Redirect to login but save the attempted location
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    // If user is logged in and tries to access auth pages, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
