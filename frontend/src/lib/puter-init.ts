// Initialize Puter.js configuration
const initializePuter = async () => {
  try {
    const apiKey = import.meta.env.VITE_PUTER_API_KEY;
    if (!apiKey) {
      throw new Error('Puter API key is not configured');
    }

    window.puter = window.puter || {};
    window.puter.config = {
      apiKey,
      apiHost: 'https://api.puter.com',
      debug: true,
      modules: ['ai'],
      onInit: async function() {
        try {
          // Attempt to authenticate and get token
          const response = await fetch('https://api.puter.com/v2/auth/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            }
          });

          if (!response.ok) {
            throw new Error(`Authentication failed: ${response.statusText}`);
          }

          const data = await response.json();
          if (data.token) {
            localStorage.setItem('puter_token', data.token);
          }

          console.log('Puter.js initialized and authenticated successfully');
          window.puter.isReady = true;
          window.dispatchEvent(new Event('puterready'));
        } catch (error) {
          console.error('Puter authentication error:', error);
          throw error;
        }
      },
      onError: function(error) {
        console.warn('Puter.js initialization error:', error);
        // Create fallback implementation for AI module
        window.puter = window.puter || {};
        window.puter.ai = window.puter.ai || {
          chat: async function(prompt: string | Array<{ role: string; content: string }>) {
            console.log('Using fallback AI implementation');
            return {
              message: {
                content: "I'm sorry, but I'm currently operating in fallback mode. Please try again later."
              }
            };
          }
        };
        window.puter.isReady = true;
        window.dispatchEvent(new Event('puterready'));
      }
    };
  } catch (error) {
    console.error('Puter initialization error:', error);
    throw error;
  }
};

export default initializePuter;