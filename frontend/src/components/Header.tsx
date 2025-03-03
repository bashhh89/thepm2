import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { MainNav } from './MainNav';
import { useAuthStore } from '../utils/auth-store';
import { supabase } from '../AppWrapper';

const Header: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const { isAdmin, adminLogout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Don't show navigation on admin login page
  if (location.pathname === '/admin/login') {
    return null;
  }

  const handleLogout = async () => {
    if (isAdmin) {
      adminLogout();
      navigate('/');
    } else {
      await supabase.auth.signOut();
      navigate('/');
    }
  };

  if (isAdmin) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link to="/admin" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">QanDu Admin</span>
          </Link>
          <MainNav />
          <div className="flex flex-1 items-center space-x-2 justify-end">
            <Button variant="outline" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">QanDu</span>
        </Link>
        <MainNav />
        <div className="flex flex-1 items-center space-x-2 justify-end">
          {user ? (
            <>
              <Button variant="outline" onClick={handleLogout}>
                Log out
              </Button>
              <Button onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/sign-in')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/sign-up')}>
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export { Header };
export default Header;
