import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../AppWrapper';

interface AuthStore {
  user: any | null;
  isInitialized: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  adminLogin: (username: string, password: string) => Promise<void>;
  adminLogout: () => void;
  updateUserProfile?: (displayName: string) => Promise<void>;
  logOut?: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isInitialized: false,
      isAuthenticated: false,
      isLoading: true,
      isAdmin: false,
      
      adminLogin: async (username: string, password: string) => {
        if (username === 'admin@qandu.co' || username === 'admin') {
          if (password === 'admin') {
            set({ 
              isAdmin: true, 
              isAuthenticated: true, 
              isLoading: false,
              user: { email: username, role: 'admin' }
            });
          } else {
            throw new Error('Invalid admin credentials');
          }
        } else {
          throw new Error('Invalid admin credentials');
        }
      },
      
      adminLogout: () => {
        set({ 
          isAdmin: false, 
          isAuthenticated: false, 
          user: null,
          isLoading: false
        });
      },
      
      updateUserProfile: async (displayName: string) => {
        const { data: { user }, error } = await supabase.auth.updateUser({
          data: { display_name: displayName }
        });
        
        if (error) throw error;
        
        set({ user });
      },
      
      logOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        set({ 
          user: null, 
          isAuthenticated: false,
          isLoading: false 
        });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        isAdmin: state.isAdmin,
        user: state.user 
      }),
    }
  )
);

// Hook to sync Supabase state with our auth store
export const useAuthSync = () => {
  React.useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentState = useAuthStore.getState();
      
      useAuthStore.setState({
        user: session?.user ?? null,
        isInitialized: true,
        isAuthenticated: currentState.isAdmin || !!session,
        isLoading: false,
        // Preserve admin state
        isAdmin: currentState.isAdmin
      });
    };

    initAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentState = useAuthStore.getState();
      useAuthStore.setState({
        user: session?.user ?? null,
        isAuthenticated: currentState.isAdmin || !!session,
        isLoading: false
      });
    });

    return () => subscription.unsubscribe();
  }, []);
};
