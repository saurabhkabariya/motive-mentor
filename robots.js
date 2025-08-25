import { siteConfig } from './app/seo';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/backend/',
        '/_next/',
        '/admin/',
        '/private/',
        '*.json',
        '/dashboard/private/',
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
