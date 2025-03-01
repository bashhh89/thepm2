import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { MainNav } from './MainNav';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';
import { useAuthStore } from '../utils/auth-store';

const Header: React.FC = () => {
  const { isSignedIn } = useUser();
  const { isAdmin, adminLogout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Don't show navigation on admin login page
  if (location.pathname === '/admin/login') {
    return null;
  }

  if (isAdmin) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link to="/admin" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">QanDu Admin</span>
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <Button variant="ghost" onClick={() => {
              adminLogout();
              navigate('/admin/login');
            }}>Logout</Button>
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
        <div className="flex flex-1 items-center justify-end space-x-4">
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal" afterSignInUrl="/dashboard">
                <Button variant="ghost">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal" afterSignUpUrl="/dashboard">
                <Button>Get Started</Button>
              </SignUpButton>
            </>
          ) : (
            <>
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
                afterSignOutUrl="/"
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
