import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found | indlish',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 text-center">
      <Link href="/" className="text-3xl font-bold text-brand-400 mb-8 block">indlish</Link>
      <p className="text-8xl font-bold text-neutral-800 mb-4">404</p>
      <h1 className="text-2xl font-bold mb-3">Yeh page nahi mila</h1>
      <p className="text-text-secondary mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/" className="btn-primary">Back to Home</Link>
        <Link href="/discover" className="btn-secondary">Discover Content</Link>
      </div>
    </div>
  );
}
