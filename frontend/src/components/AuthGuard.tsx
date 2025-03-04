import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../utils/auth-store';

interface AuthGuardProps {
  children: React.ReactNode;
  publicOnly?: boolean;
  requireAdmin?: boolean;
}

export default function AuthGuard({ children, publicOnly = false, requireAdmin = false }: AuthGuardProps) {
  const { isAuthenticated, isAdmin } = useAuthStore();

  // For public-only routes (like login), redirect to dashboard if already authenticated
  if (publicOnly && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // For protected routes, redirect to login if not authenticated
  if (!publicOnly && !isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  // For admin routes, redirect to dashboard if not an admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export { AuthGuard };
