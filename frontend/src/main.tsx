import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { AppWrapper } from './AppWrapper';
import './index.css';

// Ensure Puter.js is available before rendering
const waitForPuter = () => {
  return new Promise<void>((resolve) => {
    if (window.puter) {
      resolve();
      return;
    }

    const checkPuter = () => {
      if (window.puter) {
        resolve();
      } else {
        setTimeout(checkPuter, 100);
      }
    };

    checkPuter();
  });
};

const root = document.getElementById('root') as HTMLElement;

waitForPuter().then(() => {
  ReactDOM.createRoot(root).render(
    <StrictMode>
      <AppWrapper />
    </StrictMode>
  );
});
