'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  ArrowLeft,
  Shield,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Users', href: '/admin/users', icon: Users, exact: false },
  { label: 'Articles', href: '/admin/articles', icon: FileText, exact: false },
  { label: 'Tickets', href: '/admin/tickets', icon: MessageSquare, exact: false },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 min-h-screen bg-[#111111] border-r border-neutral-800 flex flex-col sticky top-0 shrink-0">
      {/* Brand */}
      <div className="p-4 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shrink-0">
            <Shield size={15} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white leading-none">indlish</p>
            <p className="text-xs text-orange-400 leading-none mt-1">admin panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-orange-500/15 text-orange-400 font-medium'
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-white/5'
              }`}
            >
              <Icon size={15} className={isActive ? 'text-orange-400' : ''} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-neutral-800">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-500 hover:text-neutral-300 hover:bg-white/5 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to site
        </Link>
      </div>
    </aside>
  );
}
