import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

export default function Register() {
  const { isSignedIn } = useUser();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  if (isSignedIn) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-4">
        <SignUp 
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
          redirectUrl={from}
          routing="path"
          path="/register"
        />
      </div>
    </div>
  );
}
