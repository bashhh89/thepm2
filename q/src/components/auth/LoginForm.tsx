"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/authUtils";
import { EyeIcon, EyeOffIcon, LogInIcon, KeyIcon, MailIcon } from "lucide-react";
import { GoogleIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

/**
 * LoginForm Component
 * 
 * A form for user login using email and password
 */

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { data, error: signInError } = await signIn(email, password);
      
      if (signInError) {
        setError(signInError.message || 'Login failed');
        toast.error('Login failed', {
          description: signInError.message || 'Please check your credentials and try again',
        });
        return;
      }

      if (data && data.user) {
        toast.success('Login successful', {
          description: 'Redirecting to dashboard...',
        });
        
        // Ensure session is properly saved before redirecting
        setTimeout(() => {
          // Force refresh to ensure session is loaded
          window.location.href = '/dashboard';
        }, 500);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      toast.error('Login error', {
        description: err.message || 'Please try again later',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add event listener for auth state changes
  if (typeof window !== 'undefined') {
    window.addEventListener('authStateChange', (e: any) => {
      if (e.detail?.user && e.detail?.session) {
        router.push('/dashboard');
      }
    });
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-gray-500 dark:text-gray-400">Enter your credentials to sign in</p>
      </div>
      <div className="grid gap-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="text-sm text-red-500 dark:text-red-400">{error}</div>}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon className="h-5 w-5 text-zinc-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyIcon className="h-5 w-5 text-zinc-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-zinc-400 hover:text-zinc-300" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-zinc-400 hover:text-zinc-300" />
                )}
              </button>
            </div>
            <div className="flex justify-end">
              <a href="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-zinc-800 disabled:opacity-50 transition-all duration-200"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              <>
                <LogInIcon className="h-4 w-4" />
                Sign in
              </>
            )}
          </button>
        </form>

        <div className="relative py-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-700"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-zinc-800 text-xs text-zinc-400">Or continue with</span>
          </div>
        </div>

        {/* Restore social login buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex items-center justify-center py-2.5 px-4 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"> 
               <path
                fill="#EA4335"
                d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
              />
              <path
                fill="#34A853"
                d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
              />
              <path
                fill="#4A90E2"
                d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5818182 23.1272727,9.90909091 L12,9.90909091 L12,14.7272727 L18.4363636,14.7272727 C18.1187732,16.0145455 17.2662994,17.2700927 16.0407269,18.0125889 L19.834192,20.9995801 Z"
              />
              <path
                fill="#FBBC05"
                d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
              />
            </svg>
            Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center py-2.5 px-4 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors"
          >
             <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
               <path
                fill="currentColor"
                d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"
              />
             </svg>
            Facebook
          </button>
        </div>

        <div className="text-center text-sm mt-4">
          <span className="text-zinc-400">Don't have an account? </span>
          <a href="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
}