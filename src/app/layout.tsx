import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Toaster } from 'sonner';
import AuthProvider from '@/components/layout/AuthProvider';
import ServiceWorkerRegistrar from '@/components/layout/ServiceWorkerRegistrar';
import InstallPrompt from '@/components/layout/InstallPrompt';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'indlish — Write. Organize. Curate.', template: '%s — indlish' },
  description: 'India-native creator platform. Write articles, organize notes, curate boards. By Int2Root.',
  keywords: ['writing', 'blogging', 'notes', 'curation', 'India', 'creator platform'],
  authors: [{ name: 'Int2Root', url: 'https://int2root.com' }],
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'indlish' },
  openGraph: {
    title: 'indlish — Write. Organize. Curate.',
    description: 'India-native creator platform by Int2Root.',
    url: 'https://indlish.com',
    siteName: 'indlish',
    type: 'website',
    images: [{ url: 'https://indlish.com/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'indlish — Write. Organize. Curate.',
    description: 'India-native creator platform by Int2Root.',
    images: ['https://indlish.com/og-default.png'],
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