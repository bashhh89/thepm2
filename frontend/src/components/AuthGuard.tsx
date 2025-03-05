import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../utils/auth-store';

interface AuthGuardProps {
  children: React.ReactNode;
  publicOnly?: boolean;
  requireAdmin?: boolean;
}

export default function AuthGuard({ children, publicOnly = false, requireAdmin = false }: AuthGuardProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // For public-only routes (like login), redirect to dashboard if already authenticated
  if (publicOnly && isAuthenticated) {
    // If admin, redirect to admin dashboard
    if (isAdmin) {
      return <Navigate to="/admin" replace />;
    }
    // Otherwise redirect to user dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // For protected routes, redirect to login if not authenticated
  if (!publicOnly && !isAuthenticated) {
    // Save the attempted URL to redirect back after login
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />;
  }

  // For admin routes, redirect if not admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export { AuthGuard };
