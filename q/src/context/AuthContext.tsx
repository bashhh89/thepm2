'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializationError, setInitializationError] = useState<Error | null>(null);

  const createUserProfile = async (userId: string, email: string) => {
    console.log('Creating user profile for:', { userId, email });
    
    try {
      // First check if profile already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error checking existing profile:', checkError);
        throw checkError;
      }

      if (existingProfile) {
        console.log('User profile already exists:', existingProfile);
        return;
      }

      // Create new profile if it doesn't exist
      const { data: newProfile, error: insertError } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: userId,
            role: 'user',
            full_name: email.split('@')[0],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user profile:', {
          code: insertError.code,
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint
        });
        throw insertError;
      }

      console.log('User profile created successfully:', newProfile);
    } catch (error: any) {
      console.error('Error in profile creation:', {
        name: error.name,
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      // Don't throw the error to avoid breaking the auth flow
      // Just log it and continue
    }
  };

  useEffect(() => {
    console.log("AuthProvider: Initializing auth state");
    
    // Add a safety timeout to prevent endless loading
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        console.log("AuthProvider: Safety timeout reached, forcing loading to false");
        setLoading(false);
      }
    }, 10000); // Increased timeout to 10 seconds
    
    let authStateSubscription: { data: { subscription: { unsubscribe: () => void } } } | null = null;
    
    // 1. Check for initial session
    const initializeAuth = async () => {
      try {
        // Trying to get existing session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error retrieving session:", sessionError);
          setInitializationError(sessionError);
          setLoading(false);
          return;
        }
        
        const currentSession = sessionData?.session;
        console.log("AuthProvider: Initial session check complete", !!currentSession);
        
        // Set the session and user state
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // If we have a user but for some reason their token is expired, try to refresh it
        if (currentSession?.user && currentSession.expires_at && (new Date(currentSession.expires_at * 1000) < new Date())) {
          console.log("Session token expired, attempting refresh");
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError) {
            console.error("Failed to refresh session:", refreshError);
          } else if (refreshData.session) {
            console.log("Session refreshed successfully");
            setSession(refreshData.session);
            setUser(refreshData.session.user);
          }
        }
        
        // 2. Set up the auth state change listener
        authStateSubscription = supabase.auth.onAuthStateChange(
          async (_event, newSession) => {
            console.log("Auth state changed:", _event, newSession?.user?.email);
            
            // Update the auth state in the context
            setSession(newSession);
            setUser(newSession?.user ?? null);
            
            // If this is a new signup or first login, create the user profile
            if ((_event === 'SIGNED_IN' || _event === 'TOKEN_REFRESHED') && newSession?.user) {
              try {
                await createUserProfile(newSession.user.id, newSession.user.email || '');
              } catch (error) {
                console.error('Failed to create/verify user profile:', error);
                // Continue with auth flow even if profile creation fails
              }
            }
          }
        );
        
      } catch (error) {
        console.error("Unexpected error during auth initialization:", error);
        setInitializationError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        // Finish loading regardless of outcome
        setLoading(false);
      }
    };
    
    // Start the initialization
    initializeAuth();
    
    // Setup a periodic session refresh (every 5 minutes)
    const refreshInterval = setInterval(async () => {
      if (session) {
        try {
          const { data, error } = await supabase.auth.refreshSession();
          if (error) {
            console.error("Failed to refresh session:", error);
          } else if (data.session) {
            console.log("Session refreshed via interval");
            setSession(data.session);
            setUser(data.session.user);
          }
        } catch (e) {
          console.error("Error during interval session refresh:", e);
        }
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    // Cleanup function for useEffect
    return () => {
      clearTimeout(safetyTimeout);
      clearInterval(refreshInterval);
      if (authStateSubscription) {
        authStateSubscription.data.subscription.unsubscribe();
      }
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};