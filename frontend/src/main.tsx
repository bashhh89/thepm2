import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppWrapper } from './AppWrapper';
import './index.css';

// Initialize debug logging
const debugLog = (...args: any[]) => {
  console.log('[QanDu Debug]:', ...args);
};

// Function to wait for Puter.js to be ready
const waitForPuter = (maxAttempts = 30, interval = 1000): Promise<void> => {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const checkPuter = () => {
      attempts++;
      // Check if puter object exists and has required properties
      if (window.puter && 'fs' in window.puter) {
        resolve();
      } else if (attempts >= maxAttempts) {
        reject(new Error('Puter.js initialization timeout'));
      } else {
        setTimeout(checkPuter, interval);
      }
    };

    // Start checking after a brief delay
    setTimeout(checkPuter, 500);
  });
};

// Initialize storage with proper error handling
const initializeStorage = async () => {
  try {
    debugLog('Waiting for Puter.js to initialize...');
    await waitForPuter();
    debugLog('Puter.js initialized successfully');
    
    if (!window.puter?.fs?.exists) {
      throw new Error('Puter.js filesystem not available');
    }

    const hasStorage = await window.puter.fs.exists('/blog-posts');
    if (!hasStorage) {
      await window.puter.fs.mkdir('/blog-posts');
      debugLog('Blog storage directory created');
    }
    
    return true;
  } catch (error) {
    debugLog('Storage initialization failed:', error);
    return false;
  }
};

// Initialize the application
const init = async () => {
  try {
    // Initialize Puter.js if API key is available
    const PUTER_API_KEY = import.meta.env.VITE_PUTER_API_KEY;
    if (PUTER_API_KEY && window.puter) {
      // Use type assertion to handle the config property
      (window.puter as any).config = {
        ...(window.puter as any).config,
        apiKey: PUTER_API_KEY
      };
    }

    // Render the app
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <AppWrapper />
      </React.StrictMode>
    );

    // Initialize storage in the background
    initializeStorage().catch(error => {
      debugLog('Background storage initialization failed:', error);
      // The app will still work, but blog features will be disabled
    });
  } catch (error) {
    debugLog('Fatal error during initialization:', error);
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
init().catch(console.error);
