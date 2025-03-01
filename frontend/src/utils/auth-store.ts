import { create } from 'zustand';
import { useUser } from '@clerk/clerk-react';
import React from 'react';
import { persist } from 'zustand/middleware';

interface AuthStore {
  user: any | null;
  isInitialized: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  adminLogin: (username: string, password: string) => Promise<void>;
  adminLogout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isInitialized: false,
      isAuthenticated: false,
      isLoading: true,
      isAdmin: false,
      adminLogin: async (username: string, password: string) => {
        if (username === 'admin' && password === 'admin') {
          console.log('Admin login successful');
          set({ isAdmin: true, isAuthenticated: true });
          console.log('State after admin login:', get());
        } else {
          throw new Error('Invalid admin credentials');
        }
      },
      adminLogout: () => {
        console.log('Admin logout');
        set({ isAdmin: false, isAuthenticated: false });
        console.log('State after admin logout:', get());
      }
    }),
    {
      name: 'admin-auth-storage',
      partialize: (state) => ({ isAdmin: state.isAdmin }),
    }
  )
);

// Hook to sync Clerk state with our auth store
export const useAuthSync = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  
  React.useEffect(() => {
    const currentState = useAuthStore.getState();
    console.log('Syncing auth state:', { user, isLoaded, isSignedIn, currentState });
    
    useAuthStore.setState({
      user,
      isInitialized: isLoaded,
      isAuthenticated: currentState.isAdmin || isSignedIn || false,
      isLoading: !isLoaded,
      // Preserve admin state
      isAdmin: currentState.isAdmin
    });
  }, [user, isLoaded, isSignedIn]);
};
