import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/discover', '/articles/', '/profile/', '/pricing', '/pricing/'],
        disallow: [
          '/dashboard',
          '/settings',
          '/billing',
          '/support',
          '/write',
          '/organize',
          '/feed',
          '/admin/',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://indlish.com/sitemap.xml',
    host: 'https://indlish.com',
  };
}
