import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
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