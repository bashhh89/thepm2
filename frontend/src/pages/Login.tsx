import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

function Login() {
  const { isSignedIn } = useUser();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  // Only redirect if user is signed in and we have a valid destination
  if (isSignedIn && from && from !== location.pathname) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-4">
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-primary hover:bg-primary/90',
              card: 'bg-background border shadow-lg',
              headerTitle: 'text-foreground',
              headerSubtitle: 'text-muted-foreground',
              socialButtonsBlockButton: 'border bg-background text-foreground hover:bg-accent',
              formFieldLabel: 'text-foreground',
              formFieldInput: 'bg-background border',
              dividerLine: 'bg-border',
              dividerText: 'text-muted-foreground',
              footer: 'text-muted-foreground'
            }
          }}
          fallbackRedirectUrl={from}
          routing="path"
          path="/login"
        />
      </div>
    </div>
  );
}

export default Login;
export { Login };
