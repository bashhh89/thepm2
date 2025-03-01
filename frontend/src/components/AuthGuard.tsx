import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useAuthStore } from '../utils/auth-store';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAdmin = false }) => {
  const location = useLocation();
  const { isSignedIn, isLoaded } = useUser();
  const { isAdmin } = useAuthStore();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // For admin routes, only check admin status
  if (requireAdmin) {
    return isAdmin ? <>{children}</> : <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // For non-admin routes, check regular user authentication
  if (!requireAdmin && !isSignedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
