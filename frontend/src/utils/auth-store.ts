import React, { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  user: { email: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  adminLogin: (username: string, password: string) => void;
  logOut: () => void;
  setUser: (user: { email: string } | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => {
        set({ 
          user,
          isAuthenticated: !!user,
          isLoading: false,
        });
      },

      adminLogin: (username: string, password: string) => {
        // Hardcoded credentials for testing
        if (username === 'admin@qandu.co' && password === 'admin') {
          set({ 
            user: { email: username }, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } else {
          console.error('Invalid credentials');
        }
      },

      logOut: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// Hook to sync state with our auth store
export function useAuthSync() {
  const setUser = useAuthStore(state => state.setUser);

  useEffect(() => {
    // Simulate checking session
    const session = localStorage.getItem('session');
    if (session) {
      setUser({ email: 'admin@qandu.co' }); // Mock user object
    }
  }, [setUser]);
}
