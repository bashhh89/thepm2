'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session check error:', error);
          return;
        }
        
        // If user already has a session, redirect to dashboard
        if (data.session) {
          console.log('User already has an active session, redirecting...');
          setRedirecting(true);
          // Using a timeout for smoother transition
          setTimeout(() => {
            router.push('/dashboard');
            router.refresh();
          }, 100);
        }
      } catch (err) {
        console.error('Unexpected error checking session:', err);
      }
    };
    
    checkSession();
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        console.log('Login successful, setting up session...');
        // Set redirecting state to prevent flickering
        setRedirecting(true);
        
        // Give the session a moment to be properly stored
        await new Promise(resolve => setTimeout(resolve, 300));
        
        try {
          // Force a session refresh before redirect
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) {
            console.error('Session refresh error after login:', refreshError);
          }
          
          // Redirect to dashboard
          console.log('Redirecting to dashboard...');
          router.push('/dashboard');
          router.refresh();
        } catch (refreshErr) {
          console.error('Error during post-login session handling:', refreshErr);
          setError('Login successful but encountered an issue. Please try refreshing the page.');
          setRedirecting(false);
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to login');
      setRedirecting(false);
    } finally {
      setLoading(false);
    }
  }

  // If we're redirecting, show a loading state
  if (redirecting) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-900">
        <div className="w-full max-w-md p-8 space-y-8 bg-zinc-800 rounded-xl border border-zinc-700">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">QanDu AI</h1>
            <p className="mt-2 text-zinc-400">Signing you in...</p>
          </div>
          <div className="flex justify-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-zinc-800 rounded-xl border border-zinc-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">QanDu AI</h1>
          <p className="mt-2 text-zinc-400">Sign in to your account</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500 text-red-500 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-zinc-700 bg-zinc-900 rounded-md text-white"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-zinc-700 bg-zinc-900 rounded-md text-white"
              placeholder="********"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="text-center text-sm">
          <a href="/signup" className="text-blue-500 hover:text-blue-400">
            Don't have an account? Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
