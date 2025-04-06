'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LogoutPage() {
  const router = useRouter();
  const { signOut } = useAuth();

  useEffect(() => {
    const performSignOut = async () => {
      try {
        // Call the signOut function from AuthContext
        await signOut();
        console.log('Successfully signed out');
        
        // Redirect to the home page after sign out
        router.push('/');
      } catch (error) {
        console.error('Error during sign out:', error);
        // Still redirect to home page even if there's an error
        router.push('/');
      }
    };

    performSignOut();
  }, [signOut, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900">
      <div className="text-center">
        <div className="mb-4 text-zinc-400">Signing you out...</div>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
} 