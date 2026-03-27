import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Link href="/" className="text-3xl font-bold text-brand-400 mb-10 inline-block">
          indlish
        </Link>
        <h1 className="text-8xl font-bold text-neutral-700 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-text-primary mb-3">Page not found</h2>
        <p className="text-text-secondary mb-8">
          Yeh page nahi mila. It may have been moved, deleted, or never existed.
        </p>
        <Link href="/" className="btn-primary inline-block px-8 py-3">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
