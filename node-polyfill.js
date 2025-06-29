// node-polyfill.js
// This script adds web API polyfills required by Next.js when running on Node.js

// Check if we're running in a browser or Node.js environment
const isNode = typeof window === 'undefined';

if (isNode) {
  console.log('Polyfilling Web APIs for Next.js compatibility...');
  
  // Only define Request class if it doesn't exist or if it's safe to override
  if (!global.Request || !global.Request.prototype.hasOwnProperty('url')) {
    // Basic Request class
    global.Request = class Request {
      constructor(input, options = {}) {
        // Store URL internally to avoid issues with NextRequest getters
        this._url = typeof input === 'string' ? input : (input?.url || '');
        this.method = options.method || 'GET';
        this.headers = new Headers(options.headers || {});
        this.body = options.body || null;
        this.mode = options.mode || 'cors';
        this.credentials = options.credentials || 'same-origin';
      }
      
      // Add getter for url
      get url() {
        return this._url;
      }
    };
  }
  
  // Only define Response class if it doesn't exist
  if (!global.Response) {
    // Basic Response class
    global.Response = class Response {
      constructor(body, options = {}) {
        this.body = body || '';
        this.status = options.status || 200;
        this.statusText = options.statusText || '';
        this.headers = new Headers(options.headers || {});
        this.ok = this.status >= 200 && this.status < 300;
      }
      
      async json() {
        return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
      }
      
      async text() {
        return String(this.body);
      }
    };
  }
  
  // Only define Headers class if it doesn't exist
  if (!global.Headers) {
    // Headers implementation
    global.Headers = class Headers {
      constructor(init) {
        this.headers = {};
        if (init) {
          Object.entries(init).forEach(([key, value]) => {
            this.set(key, value);
          });
        }
      }
      
      append(name, value) {
        name = name.toLowerCase();
        if (this.has(name)) {
          this.headers[name] += `, ${value}`;
        } else {
          this.set(name, value);
        }
      }
      
      delete(name) {
        delete this.headers[name.toLowerCase()];
      }
      
      get(name) {
        return this.has(name) ? this.headers[name.toLowerCase()] : null;
      }
      
      has(name) {
        return Object.prototype.hasOwnProperty.call(this.headers, name.toLowerCase());
      }
      
      set(name, value) {
        this.headers[name.toLowerCase()] = value;
      }
      
      forEach(callback) {
        Object.entries(this.headers).forEach(([key, value]) => {
          callback(value, key, this);
        });
      }
    };
  }
  
  // Use dynamic import for node-fetch to avoid import issues
  (async () => {
    try {
      const nodeFetch = await import('node-fetch');
      global.fetch = nodeFetch.default;
      console.log('Added node-fetch');
    } catch (err) {
      console.warn('Could not load node-fetch, using basic fetch polyfill instead:', err.message);
      global.fetch = async (url, options = {}) => {
        return new Response('{}', { 
          status: 200, 
          headers: { 'Content-Type': 'application/json' } 
        });
      };
    }
  })();
}

// Export a single empty object
module.exports = {};
