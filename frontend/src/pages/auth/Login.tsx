import { useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Login } from '../Login';

export default function AuthLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const redirect = searchParams.get('redirect');
  const from = location.state?.from?.pathname || redirect || '/dashboard';

  useEffect(() => {
    // Only navigate if we have a redirect parameter and we're on the auth/login page
    if (window.location.pathname === '/auth/login') {
      navigate('/login', { 
        state: { 
          from: { pathname: from },
          referrer: location.pathname
        }, 
        replace: true 
      });
    }
  }, [from, navigate, location]); // Include all dependencies

  return <Login />;
}