/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com', 
      'firebasestorage.googleapis.com',
      'avatars.githubusercontent.com',
      'graph.facebook.com',
      'platform-lookaside.fbsbx.com'
    ],
    unoptimized: true,
  },
  // Enable static optimization where possible
  reactStrictMode: true,
  // Disable SWC to avoid binary loading issues
  swcMinify: false,
  // Disable experimental features for stability
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
    swcTraceProfiling: false,
    // Disable experimental features that may cause issues
    appDocumentPreloading: false,
  },
};

export default nextConfig;
