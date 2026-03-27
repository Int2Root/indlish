import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = {
  title: 'Admin — indlish',
  robots: 'noindex, nofollow',
};

const ADMIN_EMAIL = 'mukherjee.siddhartha@gmail.com';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-auto">
        <header className="sticky top-0 z-10 bg-[#0f0f0f]/90 backdrop-blur-sm border-b border-neutral-800 px-6 py-3.5 flex items-center justify-between">
          <span className="text-neutral-500 text-xs font-medium uppercase tracking-wider">
            Admin Panel
          </span>
          <span className="text-xs text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full font-medium">
            ● Live
          </span>
        </header>
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
