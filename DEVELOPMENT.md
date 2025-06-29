# Motive Mentor - Daily Quotes App

A modern Next.js application that provides daily motivational quotes, goal tracking, and personalized motivation.

## Development Setup

This project uses Next.js 14.1.0 with React 18.2.0 and requires specific environment setup to work properly with Node.js 20+.

### Prerequisites

- Node.js 18+ (Node.js 20+ requires the polyfills configured in this project)
- npm 8+

### Installing Dependencies

```bash
npm install
```

If you encounter peer dependency issues, you can use:

```bash
npm install --legacy-peer-deps
```

### Starting the Development Server

We provide multiple methods to start the development server to ensure compatibility across different environments:

#### Method 1: Using PowerShell Script (Recommended for Windows PowerShell users)

```powershell
.\run-dev.ps1
```

#### Method 2: Using Batch File (Recommended for Windows CMD users)

```cmd
run-dev-safe.bat
```

#### Method 3: Using npm Script

```bash
npm run dev
```

### Running the App

There are several ways to run the development server:

1. **Standard Development Server**
   ```
   npm run dev
   ```

2. **Safe Development Mode (Recommended)**
   This method bypasses polyfills and avoids common errors:
   ```
   .\run-dev-safe.bat
   ```

3. **Clean Restart (For troubleshooting)**
   This clears all caches and reinstalls dependencies:
   ```
   .\clean-restart-dev.bat
   ```

### Troubleshooting

If you encounter SWC compilation errors related to Next.js, we provide cleanup scripts:

- For PowerShell:
  ```powershell
  .\clean-swc.ps1
  ```

- For Windows Command Prompt:
  ```cmd
  cleanup.bat
  ```

These scripts will:
1. Clean the Next.js cache
2. Remove problematic SWC binaries
3. Set up the environment to use Babel instead of SWC for compilation

### UI Styling Troubleshooting

If you encounter issues with the UI appearing unstyled (like plain HTML):

1. Check that Tailwind CSS is properly configured in `globals.css` with the proper directives:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

2. Ensure `tailwind.config.js` contains the correct content paths:
   ```js
   content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx}"]
   ```

3. Verify that your `postcss.config.mjs` has the correct plugins:
   ```js
   const config = {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     },
   };
   ```

4. If you're seeing AbortError with Google Fonts, use system fonts instead by modifying:
   - `app/fonts.js` - Use local font definitions
   - `tailwind.config.js` - Configure font fallbacks

5. Clear the `.next` cache directory before restarting the server
   ```
   npm run clean
   ```
   
6. If you're still having issues, try running the app without the polyfill:
   ```
   .\run-dev-safe.bat
   ```

### Node.js Compatibility

This project includes polyfills for Node.js 20+ compatibility with Next.js 14:

- Web API polyfills via `node-polyfill.js`
- Fetch API polyfill via node-fetch

## Additional Scripts

- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run clean` - Clean the Next.js cache

## Environment Variables

The development scripts automatically set the following environment variables:
- `NODE_OPTIONS=--no-experimental-fetch --require=./node-polyfill.js`
- `NEXT_DISABLE_SWC=1` (when using the compatibility scripts)
