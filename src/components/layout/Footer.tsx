import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-surface mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-brand-400 font-bold text-lg mb-4">indlish</h3>
            <p className="text-text-muted text-sm">India-native creator platform. Write, organize, curate — all in one place.</p>
            <p className="text-text-muted text-xs mt-2">By Int2Root</p>
          </div>
          <div>
            <h4 className="font-medium text-text-primary mb-3 text-sm">Platform</h4>
            <div className="space-y-2">
              <Link href="/discover" className="block text-text-muted text-sm hover:text-brand-400">Discover</Link>
              <Link href="/write" className="block text-text-muted text-sm hover:text-brand-400">Write</Link>
              <Link href="/curate" className="block text-text-muted text-sm hover:text-brand-400">Curate</Link>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-text-primary mb-3 text-sm">Pricing</h4>
            <div className="space-y-2">
              <p className="text-text-muted text-sm">Free — Get started</p>
              <p className="text-text-muted text-sm">Pro ₹99/mo</p>
              <p className="text-text-muted text-sm">Pro+ ₹199/mo</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-text-primary mb-3 text-sm">Contact</h4>
            <div className="space-y-2">
              <a href="mailto:hello@int2root.com" className="block text-text-muted text-sm hover:text-brand-400">hello@int2root.com</a>
              <a href="mailto:support@indlish.com" className="block text-text-muted text-sm hover:text-brand-400">support@indlish.com</a>
            </div>
          </div>
        </div>
        <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-text-muted text-xs">
          © {new Date().getFullYear()} Int2Root. All rights reserved.
        </div>
      </div>
    </footer>
  );
}