import React from 'react';
import { Outlet } from 'react-router-dom';
import { NavigationHeader } from './NavigationHeader';
import { Footer } from './Footer';
import { useAuthStore } from '../utils/auth-store';

export function MainLayout() {
  const { isAuthenticated, logout, isAdmin } = useAuthStore();

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationHeader 
        isAuthenticated={isAuthenticated}
        onSignIn={() => window.location.href = '/sign-in'}
        onSignUp={() => window.location.href = '/sign-up'}
        onLogout={logout}
      />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout; 