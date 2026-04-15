import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/discover',
          '/articles/',
          '/profile/',
          '/pricing',
          '/upgrade',
          '/challenges',
          '/curate',
          '/tags/',
          '/contact',
          '/legal/',
        ],
        disallow: [
          '/dashboard',
          '/settings',
          '/billing',
          '/support',
          '/write',
          '/organize',
          '/feed',
          '/search',
          '/referral',
          '/admin/',
          '/api/',
          '/invite',
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
          '/offline',
        ],
      },
    ],
    sitemap: 'https://indlish.com/sitemap.xml',
    host: 'https://indlish.com',
  };
}
