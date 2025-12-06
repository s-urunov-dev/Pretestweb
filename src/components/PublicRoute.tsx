import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
  restricted?: boolean; // If true, authenticated users can't access
}

export function PublicRoute({ children, restricted = false }: PublicRouteProps) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated && restricted) {
    // If user is logged in and trying to access login/register, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
