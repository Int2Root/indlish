import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Toaster } from 'sonner';
import AuthProvider from '@/components/layout/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'indlish — Write. Organize. Curate.', template: '%s | indlish' },
  description: 'India-native creator platform. Write articles, organize notes, curate boards. By Int2Root.',
  keywords: ['writing', 'blogging', 'notes', 'curation', 'India', 'creator platform'],
  authors: [{ name: 'Int2Root', url: 'https://int2root.com' }],
  openGraph: {
    title: 'indlish — Write. Organize. Curate.',
    description: 'India-native creator platform by Int2Root.',
    url: 'https://indlish.com',
    siteName: 'indlish',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster theme="dark" position="bottom-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}