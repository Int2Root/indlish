'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PenLine, BookOpen, LayoutGrid, Sparkles, IndianRupee, Menu, X } from 'lucide-react';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const features = [
    { icon: PenLine, title: 'Write', desc: 'Publish beautiful articles with a powerful rich text editor. Get discovered by readers across India.' },
    { icon: BookOpen, title: 'Organize', desc: 'Private notebooks for your ideas. Block-based editor, folders, quick notes — your digital brain.' },
    { icon: LayoutGrid, title: 'Curate', desc: 'Create visual boards. Pin articles, images, links. Share your taste with the world.' },
    { icon: IndianRupee, title: 'Earn', desc: 'Receive UPI tips from readers. Built-in earnings dashboard. Your content, your income.' },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-neutral-800">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 h-16">
          <Link href="/" className="text-2xl font-bold text-brand-400">indlish</Link>
          <div className="hidden sm:flex items-center gap-3">
            <Link href="/discover" className="text-sm text-text-secondary hover:text-text-primary">Discover</Link>
            <Link href="/pricing" className="text-sm text-text-secondary hover:text-text-primary">Pricing</Link>
            <Link href="/login" className="btn-ghost text-sm">Sign In</Link>
            <Link href="/register" className="btn-primary text-sm">Start Writing — It's Free</Link>
          </div>
          <button className="sm:hidden p-2 text-text-secondary" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {mobileOpen && (
          <div className="sm:hidden border-t border-neutral-800 bg-surface px-4 pb-4">
            <Link href="/discover" className="block py-3 text-text-secondary border-b border-neutral-800" onClick={() => setMobileOpen(false)}>Discover</Link>
            <Link href="/pricing" className="block py-3 text-text-secondary border-b border-neutral-800" onClick={() => setMobileOpen(false)}>Pricing</Link>
            <div className="flex gap-2 mt-3">
              <Link href="/login" className="btn-ghost text-sm flex-1 text-center">Sign In</Link>
              <Link href="/register" className="btn-primary text-sm flex-1 text-center">Get Started</Link>
            </div>
          </div>
        )}
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
        <h2 className="text-3xl font-bold text-center mb-4">Simple pricing, powerful features</h2>
        <p className="text-text-secondary text-center mb-12"><Link href="/pricing" className="text-brand-400 hover:underline">See full pricing details →</Link></p>
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

      <Footer />
    </div>
  );
}