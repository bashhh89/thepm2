import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../utils/auth-store';
import { supabase } from '../AppWrapper';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  publicOnly?: boolean;
}

export default function AuthGuard({ 
  children, 
  requireAdmin = false,
  publicOnly = false 
}: AuthGuardProps) {
  const location = useLocation();
  const { isAdmin } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setIsLoading(false);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Public only routes (like sign-in) should not be accessible when authenticated
  if (publicOnly && (isAdmin || user)) {
    const targetPath = isAdmin ? '/admin' : '/dashboard';
    return <Navigate to={targetPath} state={{ from: location }} replace />;
  }

  // Admin routes
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Protected routes for non-admin users
  if (!publicOnly && !isAdmin && !user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
