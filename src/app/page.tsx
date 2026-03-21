import Link from 'next/link';
import { PenLine, BookOpen, LayoutGrid, Sparkles, IndianRupee } from 'lucide-react';

export default function HomePage() {
  const features = [
    { icon: PenLine, title: 'Write', desc: 'Publish beautiful articles with a powerful rich text editor. Get discovered by readers across India.' },
    { icon: BookOpen, title: 'Organize', desc: 'Private notebooks for your ideas. Block-based editor, folders, quick notes — your digital brain.' },
    { icon: LayoutGrid, title: 'Curate', desc: 'Create visual boards. Pin articles, images, links. Share your taste with the world.' },
    { icon: IndianRupee, title: 'Earn', desc: 'Receive UPI tips from readers. Built-in earnings dashboard. Your content, your income.' },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <span className="text-2xl font-bold text-brand-400">indlish</span>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-ghost text-sm">Sign In</Link>
          <Link href="/register" className="btn-primary text-sm">Start Writing — It's Free</Link>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-500/10 text-brand-400 text-sm px-4 py-1.5 rounded-full mb-6">
          <Sparkles size={14} /> India ka apna creator platform
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
          Write. Organize. Curate.<br />
          <span className="text-brand-400">All in one place.</span>
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
          A Medium + Notion + Pinterest hybrid, built for Indian creators. Write articles, organize your thoughts, curate visual boards — and earn through UPI tips.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register" className="btn-primary text-lg px-8 py-3">Get Started Free</Link>
          <Link href="/discover" className="btn-secondary text-lg px-8 py-3">Explore Content</Link>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card hover:border-brand-500/30 transition-colors">
              <div className="w-10 h-10 bg-brand-500/10 rounded-lg flex items-center justify-center mb-4">
                <Icon className="text-brand-400" size={20} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-text-secondary text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Simple pricing, powerful features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center">
            <h3 className="text-lg font-semibold mb-2">Free</h3>
            <p className="text-3xl font-bold mb-4">₹0</p>
            <ul className="text-text-secondary text-sm space-y-2 mb-6">
              <li>5 articles/month</li><li>3 notebooks</li><li>2 boards</li><li>Basic profile</li>
            </ul>
            <Link href="/register" className="btn-secondary w-full block text-center">Get Started</Link>
          </div>
          <div className="card text-center border-brand-500/50 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-medium px-3 py-1 rounded-full">Popular</div>
            <h3 className="text-lg font-semibold mb-2">Pro</h3>
            <p className="text-3xl font-bold mb-4">₹99<span className="text-sm text-text-muted font-normal">/mo</span></p>
            <ul className="text-text-secondary text-sm space-y-2 mb-6">
              <li>Unlimited articles</li><li>Unlimited notebooks</li><li>Unlimited boards</li><li>UPI tipping</li><li>Custom profile</li>
            </ul>
            <Link href="/register" className="btn-primary w-full block text-center">Go Pro</Link>
          </div>
          <div className="card text-center">
            <h3 className="text-lg font-semibold mb-2">Pro+</h3>
            <p className="text-3xl font-bold mb-4">₹199<span className="text-sm text-text-muted font-normal">/mo</span></p>
            <ul className="text-text-secondary text-sm space-y-2 mb-6">
              <li>Everything in Pro</li><li>AI writing assistant</li><li>Advanced analytics</li><li>Priority support</li><li>Custom domain</li>
            </ul>
            <Link href="/register" className="btn-primary w-full block text-center">Go Pro+</Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-neutral-800 py-8 text-center text-text-muted text-sm">
        <p>Built with ❤️ by <a href="mailto:hello@int2root.com" className="text-brand-400">Int2Root</a></p>
        <p className="mt-1">© {new Date().getFullYear()} Int2Root. All rights reserved.</p>
      </footer>
    </div>
  );
}