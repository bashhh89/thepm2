import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: any | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: any | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getRedirectUrl: (location: any) => string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAdmin: false,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user: any | null) => {
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
          isAdmin: user?.app_metadata?.roles?.includes('admin') || false, // Check for admin role in app_metadata
        });
      },

      login: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        set({
          user: data.user,
          isAuthenticated: !!data.user,
          isLoading: false,
          isAdmin: data.user?.app_metadata?.roles?.includes('admin') || false,
        });
      },

      logout: async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
          throw error;
        }

        set({
          user: null,
          isAdmin: false,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      getRedirectUrl: (location: any) => {
        const state = location.state as { from?: string };
        return state?.from || '/dashboard';
      },
    }),
    {
      name: 'auth-storage',
      serialize: (state: { state: AuthState }) => JSON.stringify({
        user: state.state.user,
        isAdmin: state.state.isAdmin,
        isAuthenticated: state.state.isAuthenticated,
      }),
      deserialize: (str: string) => JSON.parse(str),
    }
  )
);

// Hook to sync state with Supabase auth state
export function useAuthSync() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setUser]);
}
