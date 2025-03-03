import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { router } from './router';
import './index.css';
import { ThemeProvider } from './internal-components/ThemeProvider';
import { PipelineProvider } from './contexts/PipelineContext';
import { FloatingChatButton } from './components/FloatingChatButton';

// Extend the window.puter type definition
declare global {
  interface Window {
    puter: {
      config?: { apiKey?: string };
      isReady?: boolean;
    };
  }
}

// Initialize debug logging
const debugLog = (...args: any[]) => {
  console.log('[QanDu Debug]:', ...args);
};

// Get environment variables safely with environment check
const getEnvVar = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

// Get required environment variables
const CLERK_PUBLISHABLE_KEY = getEnvVar('VITE_CLERK_PUBLISHABLE_KEY');
const CLERK_SIGN_IN_URL = getEnvVar('VITE_CLERK_SIGN_IN_URL');
const CLERK_SIGN_UP_URL = getEnvVar('VITE_CLERK_SIGN_UP_URL');
const CLERK_AFTER_SIGN_IN_URL = getEnvVar('VITE_CLERK_AFTER_SIGN_IN_URL');
const CLERK_AFTER_SIGN_UP_URL = getEnvVar('VITE_CLERK_AFTER_SIGN_UP_URL');
const PUTER_API_KEY = getEnvVar('VITE_PUTER_API_KEY');

// Load Puter.js script
const loadPuterScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.puter) {
      debugLog('Puter.js already loaded');
      return resolve();
    }

    const script = document.createElement('script');
    script.src = 'https://js.puter.com/v2/';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      debugLog('Puter.js script loaded successfully');
      if (PUTER_API_KEY && window.puter) {
        window.puter.config = {
          ...window.puter.config,
          apiKey: PUTER_API_KEY
        };
        debugLog('Puter.js API key configured');
      }
      resolve();
    };
    script.onerror = (error) => {
      debugLog('Failed to load Puter.js script:', error);
      reject(new Error('Failed to load Puter.js script. Please check your network connection.'));
    };
    document.head.appendChild(script);
  });
};

// Initialize the application with improved error handling
const init = async () => {
  try {
    // Load Puter.js for AI functionality
    await loadPuterScript();

    // Render the app with proper Clerk configuration
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <ThemeProvider defaultTheme="dark">
          <ClerkProvider 
            publishableKey={CLERK_PUBLISHABLE_KEY}
            fallbackRedirectUrl={CLERK_AFTER_SIGN_IN_URL}
            signInUrl={CLERK_SIGN_IN_URL}
            signUpUrl={CLERK_SIGN_UP_URL}
            redirectUrl={CLERK_AFTER_SIGN_IN_URL}
          >
            <PipelineProvider>
              <RouterProvider router={router} />
              <FloatingChatButton />
            </PipelineProvider>
          </ClerkProvider>
        </ThemeProvider>
      </React.StrictMode>
    );
  } catch (error) {
    debugLog('Fatal error during initialization:', error instanceof Error ? error.message : 'Unknown error');
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Initialization Error</h1>
        <p className="text-muted-foreground mb-4">
          Unable to initialize the application. Please try refreshing the page.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Refresh Page
        </button>
      </div>
    );
  }
};

// Start the application
init().catch(error => {
  debugLog('Application initialization failed:', error instanceof Error ? error.message : 'Unknown error');
});
