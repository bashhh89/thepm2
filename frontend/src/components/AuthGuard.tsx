import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

interface AuthGuardProps {
  requireAuth?: boolean;
  redirectTo?: string;
}

const AuthGuard = ({ requireAuth = true, redirectTo = '/sign-in', children }: AuthGuardProps & { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (requireAuth && !isSignedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!requireAuth && isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export { AuthGuard };
export default AuthGuard;
