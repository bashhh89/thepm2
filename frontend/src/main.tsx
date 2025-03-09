import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './AppWrapper';
import './index.css';
import initializePuter from './lib/puter-init';

// Initialize Puter.js before rendering the app
initializePuter();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
