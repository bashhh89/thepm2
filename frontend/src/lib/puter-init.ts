// Initialize Puter.js configuration
const initializePuter = () => {
  window.puter = window.puter || {};
  window.puter.config = {
    apiKey: import.meta.env.VITE_PUTER_API_KEY,
    apiHost: 'https://api.puter.com',
    debug: true,
    modules: ['ai'],
    onInit: function() {
      console.log('Puter.js initialized successfully');
      window.puter.isReady = true;
      window.dispatchEvent(new Event('puterready'));
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
};

export default initializePuter; 