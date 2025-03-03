const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

export interface APIOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  credentials?: RequestCredentials;
  isPuter?: boolean;
  retry?: boolean;
}

export async function apiRequest(endpoint: string, options: APIOptions = {}) {
  const {
    method = 'GET',
    headers = {},
    body,
    credentials = 'include',
    isPuter = false,
    retry = true
  } = options;

  const requestHeaders = {
    ...DEFAULT_HEADERS,
    ...headers,
  };

  // Add Puter specific headers if needed
  if (isPuter) {
    const token = window.puter?.token || localStorage.getItem('puter_token');
    if (!token) {
      throw new Error('No Puter token available');
    }
    requestHeaders['X-Puter-Token'] = token;
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
    credentials,
  };

  if (body) {
    if (body instanceof FormData) {
      delete requestHeaders['Content-Type'];
      requestOptions.body = body;
    } else {
      requestOptions.body = JSON.stringify(body);
    }
  }

  try {
    const response = await fetch(endpoint, requestOptions);
    
    if (!response.ok) {
      if (isPuter) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        const error = new Error(errorData.error || `Puter API error: ${response.status}`);
        
        // Handle authentication errors
        if (response.status === 401 && retry) {
          console.log('Token invalid, retrying with new token...');
          localStorage.removeItem('puter_token');
          // Try to reinitialize Puter
          const initializePuter = (window as any).initializePuter;
          if (initializePuter) {
            await initializePuter();
            // Retry the request once
            return apiRequest(endpoint, { ...options, retry: false });
          }
        }
        
        throw error;
      }
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return await response.text();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Helper function for Puter API requests
export async function puterRequest(path: string, options: Omit<APIOptions, 'isPuter'> = {}) {
  const baseUrl = '/api/puter';
  return apiRequest(`${baseUrl}${path}`, {
    ...options,
    isPuter: true,
    credentials: 'include'
  });
}

// Initialize Puter document storage with retries
export async function initializePuterStorage() {
  try {
    if (!window.puter?.token) {
      throw new Error('Puter.js not initialized');
    }

    // Verify token is valid
    try {
      await puterRequest('/whoami', { method: 'GET' });
    } catch (error: any) {
      if (error.message?.includes('401')) {
        localStorage.removeItem('puter_token');
        const initializePuter = (window as any).initializePuter;
        if (initializePuter) {
          await initializePuter();
        }
      }
    }

    // Create directories with proper error handling
    try {
      await puterRequest('/mkdir', {
        method: 'POST',
        body: {
          path: '/documents',
          recursive: true
        }
      });
    } catch (error: any) {
      if (!error.message?.includes('already exists')) {
        throw error;
      }
    }

    return true;
  } catch (error) {
    console.error('Failed to initialize documents directory:', error);
    return false;
  }
}

// Save document to Puter storage with proper error handling
export async function saveDocumentToPuter(documentId: string, content: any) {
  try {
    const isStorageReady = await initializePuterStorage();
    if (!isStorageReady) {
      throw new Error('Failed to initialize document storage');
    }

    // Clean content before saving
    const cleanContent = JSON.parse(JSON.stringify(content, (key, value) => {
      if (value && typeof value === 'object') {
        // Remove any circular references or DOM elements
        const seen = new Set();
        return JSON.parse(JSON.stringify(value, (k, v) => {
          if (v && typeof v === 'object') {
            if (seen.has(v)) return '[Circular]';
            seen.add(v);
          }
          return v;
        }));
      }
      return value;
    }));

    await puterRequest('/write', {
      method: 'POST',
      body: {
        path: `/documents/${documentId}.json`,
        content: JSON.stringify(cleanContent, null, 2)
      }
    });

    return true;
  } catch (error) {
    console.error('Failed to save document:', error);
    throw error;
  }
}