'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-session';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { PenLine, BookOpen, LayoutGrid, Search, Menu, X, LogOut, Settings, BarChart3, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const { user, isAuthenticated } = useCurrentUser();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navItems = [
    { href: '/feed', label: 'Feed', icon: LayoutGrid },
    { href: '/discover', label: 'Discover', icon: Search },
    ...(isAuthenticated ? [
      { href: '/write', label: 'Write', icon: PenLine },
      { href: '/organize', label: 'Organize', icon: BookOpen },
      { href: '/curate', label: 'Curate', icon: LayoutGrid },
    ] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-brand-400">indlish</Link>
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className={cn('flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors', pathname === href ? 'bg-brand-500/10 text-brand-400' : 'text-text-secondary hover:text-text-primary hover:bg-surface-lighter')}>
                  <Icon size={16} />{label}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
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
                    <Link href={`/profile/${user?.username}`} className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-surface-lighter" onClick={() => setProfileOpen(false)}><User size={14} />Profile</Link>
                    <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-surface-lighter" onClick={() => setProfileOpen(false)}><Settings size={14} />Settings</Link>
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
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={cn('flex items-center gap-2 px-3 py-3 rounded-lg text-sm', pathname === href ? 'text-brand-400' : 'text-text-secondary')} onClick={() => setMobileOpen(false)}>
              <Icon size={16} />{label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <hr className="my-2 border-neutral-800" />
              <Link href="/dashboard" className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-text-secondary" onClick={() => setMobileOpen(false)}><BarChart3 size={16} />Dashboard</Link>
              <Link href={`/profile/${user?.username}`} className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-text-secondary" onClick={() => setMobileOpen(false)}><User size={16} />Profile</Link>
              <Link href="/settings" className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-text-secondary" onClick={() => setMobileOpen(false)}><Settings size={16} />Settings</Link>
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