import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { supabase } from '../AppWrapper';
import AuthGuard from '../components/AuthGuard';
import { useAuthStore } from '../utils/auth-store';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { adminLogin, getRedirectUrl } = useAuthStore();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Try admin login first
      if (email === 'admin@qandu.co' || email === 'admin') {
        await adminLogin(email, password);
        navigate('/admin', { replace: true });
        return;
      }

      // Regular user login
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Use the redirect helper to determine where to send the user
      navigate(getRedirectUrl(location), { replace: true });
    } catch (error: any) {
      console.error('Sign in error:', error);
      setError(error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard publicOnly>
      <div className="min-h-screen bg-background">
        <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <Card className="p-6">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Welcome back
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your credentials to sign in to your account
                </p>
              </div>

              <div className="grid gap-6 pt-6">
                {error && (
                  <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSignIn}>
                  <div className="grid gap-4">
                    <div className="grid gap-1">
                      <label htmlFor="email" className="text-sm font-medium leading-none">
                        Email
                      </label>
                      <Input
                        id="email"
                        placeholder="name@example.com"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-1">
                      <label htmlFor="password" className="text-sm font-medium leading-none">
                        Password
                      </label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Signing in...' : 'Sign in'}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
            <p className="px-8 text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link 
                to="/sign-up" 
                className="text-primary hover:text-primary/90"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}