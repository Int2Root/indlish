'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  PenLine, BookOpen, LayoutGrid, Sparkles, IndianRupee,
  Menu, X, Compass, Trophy, CheckCircle, ArrowRight, Star,
} from 'lucide-react';
import Footer from '@/components/layout/Footer';

const features = [
  { icon: PenLine, title: 'Write', desc: 'Publish beautiful long-form articles with our rich text editor. Reach readers who love Indian English prose.' },
  { icon: Compass, title: 'Discover', desc: 'Explore curated content from creators across India — from Dilli ki galiyaan to Chennai coffee houses.' },
  { icon: LayoutGrid, title: 'Curate', desc: 'Create visual Pinterest-style boards. Pin articles, images, links. Show the world your taste.' },
  { icon: BookOpen, title: 'Organize', desc: 'Private notebooks for your thoughts. Block editor, folders, quick capture — your digital second brain.' },
  { icon: Trophy, title: 'Challenges', desc: 'Join weekly writing challenges. Get featured, win recognition, and build a loyal audience.' },
  { icon: IndianRupee, title: 'Earn', desc: 'Receive UPI tips directly from readers. Built-in earnings dashboard. Your words, your income.' },
];

const testimonials = [
  {
    quote: 'Finally a platform that understands how we Indians write. The Hinglish support and UPI tipping are exactly what we needed.',
    name: 'Priya Sharma',
    role: 'Food blogger, Delhi',
    initials: 'PS',
  },
  {
    quote: 'Moved my whole writing from Medium to indlish. Cleaner editor, warmer community, and ₹99/month is an absolute steal.',
    name: 'Rahul Mehta',
    role: 'Tech writer, Bengaluru',
    initials: 'RM',
  },
  {
    quote: 'Weekly challenges got me writing consistently again. My readership doubled in two months.',
    name: 'Anika Singh',
    role: 'Literature enthusiast, Mumbai',
    initials: 'AS',
  },
];

const mockArticles = [
  { title: 'Dilli Ki Chai: More Than Just a Cup', tag: 'Food & Culture', mins: '4', hearts: 47, badge: 'Trending', badgeClass: 'text-red-400 bg-red-500/10' },
  { title: "Why India's Tech Scene Writes Differently", tag: 'Technology', mins: '6', hearts: 61, badge: 'Featured', badgeClass: 'text-blue-400 bg-blue-500/10' },
  { title: 'Monsoon Poetry: Writing in Hinglish', tag: 'Poetry', mins: '3', hearts: 38, badge: 'Challenge', badgeClass: 'text-brand-400 bg-brand-500/10' },
];

const exampleChallenges = [
  "✍️ Write about your city's midnight magic",
  '🍛 Explain your favourite sabzi to a foreigner',
  '💌 A letter to your 18-year-old self',
];

const pricingPlans = [
  {
    name: 'Free',
    subtitle: 'For curious writers',
    price: '₹0',
    period: '/forever',
    planFeatures: ['5 articles/month', '3 notebooks', '2 boards', 'Join challenges', 'Basic profile'],
    cta: 'Get Started Free',
    ctaClass: 'btn-secondary',
    highlight: false,
  },
  {
    name: 'Pro',
    subtitle: 'For serious creators',
    price: '₹99',
    period: '/month',
    planFeatures: ['Unlimited articles', 'Unlimited notebooks', 'Unlimited boards', 'UPI tipping enabled', 'Custom profile URL', 'Priority in discovery'],
    cta: 'Start Pro Trial',
    ctaClass: 'btn-primary',
    highlight: true,
  },
  {
    name: 'Pro+',
    subtitle: 'For power creators',
    price: '₹199',
    period: '/month',
    planFeatures: ['Everything in Pro', 'AI writing assistant', 'Advanced analytics', 'Custom domain', 'Priority support', 'Early feature access'],
    cta: 'Start Pro+ Trial',
    ctaClass: 'btn-secondary',
    highlight: false,
  },
];

const trustItems = ['No credit card required', 'Free plan forever', 'UPI-native tipping', 'Hinglish-friendly'];

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface flex flex-col">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-neutral-800">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 h-16">
          <Link href="/" className="text-2xl font-bold text-brand-400">indlish</Link>
          <div className="hidden sm:flex items-center gap-3">
            <Link href="/discover" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Discover</Link>
            <Link href="/challenges" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Challenges</Link>
            <Link href="/pricing" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Pricing</Link>
            <Link href="/login" className="btn-ghost text-sm py-1.5 px-4">Sign In</Link>
            <Link href="/register" className="btn-primary text-sm py-1.5 px-4">Start Writing — It&apos;s Free</Link>
          </div>
          <button className="sm:hidden p-2 text-text-secondary" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {mobileOpen && (
          <div className="sm:hidden border-t border-neutral-800 bg-surface px-4 pb-4">
            <Link href="/discover" className="block py-3 text-text-secondary border-b border-neutral-800" onClick={() => setMobileOpen(false)}>Discover</Link>
            <Link href="/challenges" className="block py-3 text-text-secondary border-b border-neutral-800" onClick={() => setMobileOpen(false)}>Challenges</Link>
            <Link href="/pricing" className="block py-3 text-text-secondary border-b border-neutral-800" onClick={() => setMobileOpen(false)}>Pricing</Link>
            <div className="flex gap-2 mt-3">
              <Link href="/login" className="btn-ghost text-sm flex-1 text-center py-2">Sign In</Link>
              <Link href="/register" className="btn-primary text-sm flex-1 text-center py-2">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── Product Hunt Launch Banner ── */}
      <div className="bg-brand-500/10 border-b border-brand-500/20">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-x-3 gap-y-1 flex-wrap text-sm">
          <span className="text-brand-400 font-semibold">🚀 Launching on Product Hunt — April 7, 2026</span>
          <span className="text-text-muted hidden sm:inline">·</span>
          <span className="text-text-muted hidden sm:inline">Support us on launch day!</span>
          <Link href="/register" className="text-brand-400 hover:text-brand-300 font-medium underline underline-offset-2 transition-colors">
            Join free now →
          </Link>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="relative isolate">
        {/* Decorative clip container – keeps dot grid & glow inside hero without overflow-hidden on the section (which causes a Chrome compositing bug that blocks paint of all subsequent sections) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #ed8936 1px, transparent 0)', backgroundSize: '28px 28px' }}
          />
          {/* Radial glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px]"
            style={{ background: 'radial-gradient(ellipse at center top, rgba(221,107,32,0.1) 0%, transparent 65%)' }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm px-4 py-1.5 rounded-full mb-8">
            <Sparkles size={14} />
            India ka apna creator platform
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
            Write, Discover &amp;<br />
            <span className="text-brand-400">Celebrate Indian English</span>
          </h1>

          <p className="text-text-secondary text-xl sm:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed">
            The first creator platform built for the Indian voice — long-form writing, visual curation, private notebooks, and weekly challenges.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/register" className="btn-primary text-base px-8 py-3 w-full sm:w-auto inline-flex items-center justify-center gap-2">
              Start Writing — It&apos;s Free <ArrowRight size={18} />
            </Link>
            <Link href="/discover" className="btn-secondary text-base px-8 py-3 w-full sm:w-auto text-center block">
              Explore Content
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-text-muted">
            {trustItems.map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle size={13} className="text-brand-400 flex-shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ── Browser Mockup ── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
          <div
            className="rounded-2xl border border-neutral-800 bg-surface-light overflow-hidden"
            style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)' }}
          >
            {/* Browser chrome */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-800 bg-surface">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-neutral-700" />
                <div className="w-3 h-3 rounded-full bg-neutral-700" />
                <div className="w-3 h-3 rounded-full bg-neutral-700" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-surface-lighter rounded px-3 py-1 text-xs text-text-muted w-48 text-center">
                  indlish.com/discover
                </div>
              </div>
              <div className="w-12" />
            </div>
            {/* Article cards */}
            <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {mockArticles.map((article, i) => (
                <div key={i} className="bg-surface rounded-xl border border-neutral-800 p-4 hover:border-brand-500/30 transition-colors cursor-default">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-brand-400 font-medium">{article.tag}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${article.badgeClass}`}>{article.badge}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-text-primary mb-3 leading-snug">{article.title}</h4>
                  <div className="h-1.5 bg-surface-lighter rounded-full mb-2 w-full" />
                  <div className="h-1.5 bg-surface-lighter rounded-full mb-4 w-2/3" />
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-brand-500/20 flex items-center justify-center text-[9px] text-brand-400 font-bold">A</div>
                      <span>{article.mins} min read</span>
                    </div>
                    <span>♥ {article.hearts}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything a creator needs</h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Six powerful tools, one seamless platform — built for Indian creators and readers.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card hover:border-brand-500/30 transition-all group">
              <div className="w-11 h-11 bg-brand-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-500/15 transition-colors">
                <Icon className="text-brand-400" size={22} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-surface-light border-y border-neutral-800 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Up and running in minutes</h2>
            <p className="text-text-secondary text-lg">Three simple steps to your first published piece.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { num: '01', title: 'Sign up free', desc: 'Google login in 10 seconds. No credit card. Free plan forever. Your profile is ready instantly.' },
              { num: '02', title: 'Write & publish', desc: 'Use our distraction-free editor. Add tags and a cover image. Set it live — readers find you the same day.' },
              { num: '03', title: 'Build & earn', desc: 'Grow your following, accept UPI tips from readers, join challenges, and get featured.' },
            ].map(({ num, title, desc }) => (
              <div key={num} className="flex flex-col items-center text-center md:items-start md:text-left">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 font-bold text-xl mb-4">
                  {num}
                </div>
                <h3 className="font-semibold text-xl mb-2">{title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Challenges Highlight ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="rounded-2xl border border-brand-500/20 bg-brand-500/5 p-8 sm:p-12">
          <div className="flex flex-col lg:flex-row lg:items-start gap-10">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-brand-500/15 rounded-xl flex items-center justify-center">
                  <Trophy className="text-brand-400" size={20} />
                </div>
                <span className="text-brand-400 font-semibold text-sm uppercase tracking-wider">Weekly Challenges</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Write with purpose.<br />Win recognition.
              </h2>
              <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                Every week, a new prompt drops. Write, submit, and get featured on the home page. Build a loyal readership by showing up consistently.
              </p>
              <Link href="/challenges" className="btn-primary inline-flex items-center gap-2 text-base px-6 py-2.5">
                Browse All Challenges <ArrowRight size={18} />
              </Link>
            </div>
            <div className="lg:w-72 space-y-3">
              <p className="text-xs text-text-muted uppercase tracking-wider font-medium mb-4">Recent prompts</p>
              {exampleChallenges.map((c, i) => (
                <div key={i} className="bg-surface rounded-xl border border-neutral-800 px-4 py-3.5 text-sm text-text-secondary hover:border-brand-500/30 hover:text-text-primary transition-all cursor-default">
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Social Proof ── */}
      <section className="bg-surface-light border-y border-neutral-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={22} fill="currentColor" className="text-brand-400" />
              ))}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Creators love indlish</h2>
            <p className="text-text-secondary text-lg">
              Join 500+ early creators writing for India&apos;s newest platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            {testimonials.map(({ quote, name, role, initials }) => (
              <div key={name} className="card flex flex-col">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" className="text-brand-400" />
                  ))}
                </div>
                <p className="text-text-secondary text-sm leading-relaxed mb-6 flex-1">
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 text-sm font-bold flex-shrink-0">
                    {initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text-primary">{name}</div>
                    <div className="text-xs text-text-muted">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16">
            {[
              { value: '500+', label: 'Early creators' },
              { value: '2,000+', label: 'Articles published' },
              { value: '₹0', label: 'To get started' },
              { value: '4.9★', label: 'Average rating' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold text-text-primary mb-1">{value}</div>
                <div className="text-sm text-text-muted">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, honest pricing</h2>
          <p className="text-text-secondary text-lg">
            Start free, upgrade when you&apos;re ready.{' '}
            <Link href="/pricing" className="text-brand-400 hover:underline">See full details →</Link>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPlans.map(({ name, subtitle, price, period, planFeatures, cta, ctaClass, highlight }) => (
            <div key={name} className={`card flex flex-col ${highlight ? 'border-brand-500/40 relative' : ''}`}>
              {highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1">{name}</h3>
                <p className="text-text-muted text-sm mb-4">{subtitle}</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold">{price}</span>
                  <span className="text-text-muted text-sm mb-1">{period}</span>
                </div>
              </div>
              <ul className="space-y-2.5 flex-1 mb-6">
                {planFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                    <CheckCircle size={14} className="text-brand-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className={`${ctaClass} w-full text-center block`}>
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative overflow-hidden border-t border-neutral-800 py-24">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(221,107,32,0.07) 0%, transparent 65%)' }}
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm px-4 py-1.5 rounded-full mb-6">
            <Sparkles size={14} />
            Launching on Product Hunt — April 7, 2026
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            Your voice deserves<br />
            <span className="text-brand-400">a platform that gets it.</span>
          </h2>
          <p className="text-text-secondary text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            Join thousands of Indian creators writing, discovering, and building audiences on indlish.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="btn-primary text-lg px-10 py-4 w-full sm:w-auto inline-flex items-center justify-center gap-2">
              Start Writing for Free <ArrowRight size={20} />
            </Link>
            <Link href="/discover" className="btn-secondary text-lg px-10 py-4 w-full sm:w-auto text-center block">
              Explore Content First
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
