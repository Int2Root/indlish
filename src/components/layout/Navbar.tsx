'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-session';
import { signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import { PenLine, BookOpen, LayoutGrid, Search, Menu, X, LogOut, Settings, BarChart3, User, Trophy, Gift, HeadphonesIcon, Zap, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const { user, isAuthenticated } = useCurrentUser();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const navItems = [
    { href: '/feed', label: 'Feed', icon: LayoutGrid },
    { href: '/discover', label: 'Discover', icon: Search },
    { href: '/challenges', label: 'Challenges', icon: Trophy },
    ...(isAuthenticated ? [
      { href: '/write', label: 'Write', icon: PenLine },
      { href: '/organize', label: 'Organize', icon: BookOpen },
      { href: '/curate', label: 'Curate', icon: LayoutGrid },
    ] : []),
  ];

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      router.push(`/discover?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-brand-400 shrink-0">indlish</Link>
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className={cn('flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors', pathname === href ? 'bg-brand-500/10 text-brand-400' : 'text-text-secondary hover:text-text-primary hover:bg-surface-lighter')}>
                  <Icon size={16} />{label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {/* Search bar */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={15} />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles..."
                    className="bg-surface-lighter border border-neutral-700 rounded-lg pl-9 pr-3 py-1.5 text-sm w-52 focus:outline-none focus:border-brand-500"
                    onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                    onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
                  />
                </div>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-lighter rounded-lg transition-colors" aria-label="Search">
                <Search size={18} />
              </button>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 p-1 rounded-full hover:bg-surface-lighter">
                  {user?.image ? (
                    <img src={user.image} alt="" className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-sm font-medium">{user?.name?.[0] || 'U'}</div>
                  )}
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface-light border border-neutral-700 rounded-lg shadow-xl py-1">
                    <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-surface-lighter" onClick={() => setProfileOpen(false)}><BarChart3 size={14} />Dashboard</Link>
                    <Link href={user?.username ? `/profile/${user.username}` : '/settings'} className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-surface-lighter" onClick={() => setProfileOpen(false)}><User size={14} />Profile</Link>
                    <Link href="/referral" className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-surface-lighter" onClick={() => setProfileOpen(false)}><Gift size={14} />Invite Friends</Link>
                    <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-surface-lighter" onClick={() => setProfileOpen(false)}><Settings size={14} />Settings</Link>
                    <hr className="my-1 border-neutral-700" />
                    <Link href="/upgrade" className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-surface-lighter" onClick={() => setProfileOpen(false)}><Zap size={14} />Upgrade</Link>
                    <Link href="/billing" className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-surface-lighter" onClick={() => setProfileOpen(false)}><Receipt size={14} />Billing</Link>
                    <Link href="/support" className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-surface-lighter" onClick={() => setProfileOpen(false)}><HeadphonesIcon size={14} />Support</Link>
                    <hr className="my-1 border-neutral-700" />
                    <button onClick={() => signOut()} className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-surface-lighter w-full"><LogOut size={14} />Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="btn-ghost text-sm">Sign In</Link>
                <Link href="/register" className="btn-primary text-sm">Get Started</Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-surface px-4 pb-4 pt-2">
          {/* Mobile search */}
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={15} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="bg-surface-lighter border border-neutral-700 rounded-lg pl-9 pr-3 py-2 text-sm w-full focus:outline-none focus:border-brand-500"
              />
            </div>
          </form>

          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={cn('flex items-center gap-2 px-3 py-3 rounded-lg text-sm', pathname === href ? 'text-brand-400' : 'text-text-secondary')} onClick={() => setMobileOpen(false)}>
              <Icon size={16} />{label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <hr className="my-2 border-neutral-800" />
              <Link href="/dashboard" className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-text-secondary" onClick={() => setMobileOpen(false)}><BarChart3 size={16} />Dashboard</Link>
              <Link href={user?.username ? `/profile/${user.username}` : '/settings'} className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-text-secondary" onClick={() => setMobileOpen(false)}><User size={16} />Profile</Link>
              <Link href="/referral" className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-text-secondary" onClick={() => setMobileOpen(false)}><Gift size={16} />Invite Friends</Link>
              <Link href="/settings" className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-text-secondary" onClick={() => setMobileOpen(false)}><Settings size={16} />Settings</Link>
              <Link href="/upgrade" className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-text-secondary" onClick={() => setMobileOpen(false)}><Zap size={16} />Upgrade</Link>
              <Link href="/billing" className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-text-secondary" onClick={() => setMobileOpen(false)}><Receipt size={16} />Billing</Link>
              <Link href="/support" className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-text-secondary" onClick={() => setMobileOpen(false)}><HeadphonesIcon size={16} />Support</Link>
              <button onClick={() => { signOut(); setMobileOpen(false); }} className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-red-400 w-full"><LogOut size={16} />Sign Out</button>
            </>
          ) : (
            <div className="flex gap-2 mt-3">
              <Link href="/login" className="btn-ghost text-sm flex-1 text-center" onClick={() => setMobileOpen(false)}>Sign In</Link>
              <Link href="/register" className="btn-primary text-sm flex-1 text-center" onClick={() => setMobileOpen(false)}>Get Started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
