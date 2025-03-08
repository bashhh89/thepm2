import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './AppWrapper';
import './index.css';
import initializePuter from './lib/puter-init';

// Initialize Puter.js before rendering the app
initializePuter().then(() => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}).catch(error => {
  console.error('Failed to initialize Puter.js:', error);
  // Still render the app, components will handle Puter unavailability
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
