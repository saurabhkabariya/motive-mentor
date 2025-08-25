// node-polyfill.js
// This script adds web API polyfills required by Next.js when running on Node.js

// Check if we're running in a browser or Node.js environment
const isNode = typeof window === 'undefined';

if (isNode) {
  console.log('Polyfilling Web APIs for Next.js compatibility...');
  
  // Simple fetch polyfill using node-fetch
  (async () => {
    try {
      if (!global.fetch) {
        const nodeFetch = await import('node-fetch');
        global.fetch = nodeFetch.default;
        // Also import Request and Response from node-fetch if needed
        if (!global.Request) {
          global.Request = nodeFetch.Request;
        }
        if (!global.Response) {
          global.Response = nodeFetch.Response;
        }
        if (!global.Headers) {
          global.Headers = nodeFetch.Headers;
        }
        console.log('Added node-fetch polyfills');
      }
    } catch (err) {
      console.warn('Could not load node-fetch:', err.message);
      
      // Basic fallback if node-fetch fails
      if (!global.fetch) {
        global.fetch = async (url, options = {}) => {
          return {
            ok: true,
            status: 200,
            statusText: 'OK',
            headers: new Map(),
            json: async () => ({}),
            text: async () => '{}',
            body: null
          };
        };
      }
    }
  })();
}

// Export a single empty object
module.exports = {};
