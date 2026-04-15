import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import '@/styles/globals.css';
import { Toaster } from 'sonner';
import AuthProvider from '@/components/layout/AuthProvider';
import ServiceWorkerRegistrar from '@/components/layout/ServiceWorkerRegistrar';
import InstallPrompt from '@/components/layout/InstallPrompt';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'indlish — The Writing Platform for Indian English', template: '%s — indlish' },
  description: 'India ka apna creator platform. Write articles, organize notes, curate boards & earn UPI tips. Medium + Notion + Pinterest, built for India.',
  keywords: ['writing', 'blogging', 'notes', 'curation', 'India', 'creator platform', 'UPI tips', 'Hindi', 'indlish'],
  authors: [{ name: 'Int2Root', url: 'https://int2root.com' }],
  metadataBase: new URL('https://indlish.com'),
  alternates: { canonical: 'https://indlish.com' },
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'indlish' },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
  openGraph: {
    title: 'indlish — The Writing Platform for Indian English',
    description: 'India ka apna creator platform. Write, organize & curate — earn UPI tips from readers.',
    url: 'https://indlish.com',
    siteName: 'indlish',
    type: 'website',
    locale: 'en_IN',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'indlish — The Writing Platform for Indian English' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'indlish — The Writing Platform for Indian English',
    description: 'India ka apna creator platform. Write, organize & curate — earn UPI tips from readers.',
    images: ['/api/og'],
    site: '@indlish',
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'indlish',
  url: 'https://indlish.com',
  description: 'India ka apna creator platform. Write articles, organize notes, curate boards & earn UPI tips.',
  publisher: {
    '@type': 'Organization',
    name: 'Int2Root',
    url: 'https://int2root.com',
    logo: { '@type': 'ImageObject', url: 'https://indlish.com/icon-512.png' },
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: 'https://indlish.com/search?q={search_term_string}' },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-DD5FSEKC4W"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DD5FSEKC4W');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ServiceWorkerRegistrar />
          <InstallPrompt />
          {children}
          <Toaster theme="dark" position="bottom-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
