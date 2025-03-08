// Initialize Puter.js configuration
const initializePuter = async () => {
  const maxRetries = 3;
  let retries = 0;

  const tryInitialize = async (): Promise<void> => {
    try {
      if (!window.puter?.ai?.chat) {
        console.log('Waiting for Puter.js to load...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        throw new Error('Puter.js not loaded yet');
      }

      console.log('Puter.js loaded successfully');
      window.puter.config = {
        debug: true,
        modules: ['ai'],
        onError: function(error) {
          console.warn('Puter.js error:', error);
          window.dispatchEvent(new CustomEvent('putererror', { detail: error }));
        }
      };

      // Mark as ready
      window.puter.isReady = true;
      window.dispatchEvent(new Event('puterready'));
    } catch (error) {
      console.warn(`Puter.js initialization attempt ${retries + 1} failed:`, error);
      if (retries < maxRetries) {
        retries++;
        await tryInitialize();
      } else {
        console.error('Failed to initialize Puter.js after', maxRetries, 'attempts');
        window.dispatchEvent(new CustomEvent('putererror', { 
          detail: 'Failed to initialize Puter.js. Please refresh the page and try again.' 
        }));
      }
    }
  };

  await tryInitialize();
};

export default initializePuter;