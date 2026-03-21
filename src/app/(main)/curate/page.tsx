'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks/use-session';
import { LayoutGrid, Plus, Pin, Users } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { toast } from 'sonner';

export default function CuratePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useCurrentUser();
  const router = useRouter();
  const [boards, setBoards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) { router.push('/login'); return; }
    if (user) {
      fetch(`/api/boards?userId=${user.id}`).then(r => r.json()).then(d => { setBoards(d.data?.boards || []); setLoading(false); });
    }
  }, [user, authLoading, isAuthenticated, router]);

  const createBoard = async () => {
    if (!newTitle.trim()) return;
    const res = await fetch('/api/boards', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: newTitle }) });
    const data = await res.json();
    if (data.success) { setBoards([data.data, ...boards]); setNewTitle(''); setCreating(false); toast.success('Board created!'); }
    else toast.error(data.error);
  };

  if (loading || authLoading) return <LoadingSpinner className="py-32" />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Your Boards</h1>
        <button onClick={() => setCreating(true)} className="btn-primary flex items-center gap-2"><Plus size={16} />New Board</button>
      </div>

      {creating && (
        <div className="card mb-6 flex items-center gap-3">
          <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Board title..." className="input-field flex-1" autoFocus onKeyDown={(e) => e.key === 'Enter' && createBoard()} />
          <button onClick={createBoard} className="btn-primary text-sm">Create</button>
          <button onClick={() => setCreating(false)} className="btn-ghost text-sm">Cancel</button>
        </div>
      )}

      {boards.length === 0 ? (
        <EmptyState icon={LayoutGrid} title="No boards yet" description="Create a board to start curating content — pin images, links, articles, and more." action={<button onClick={() => setCreating(true)} className="btn-primary">Create Board</button>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board: any) => (
            <Link key={board.id} href={`/curate/${board.id}`} className="card hover:border-neutral-600 transition-colors group">
              {board.coverImage ? (
                <div className="h-32 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-xl">
                  <img src={board.coverImage} alt={board.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
              ) : board.pins?.length > 0 ? (
                <div className="grid grid-cols-2 gap-1 -mx-6 -mt-6 mb-4 h-32 overflow-hidden rounded-t-xl">
                  {board.pins.slice(0, 4).map((pin: any, i: number) => (
                    <div key={i} className="bg-surface-lighter">{pin.imageUrl && <img src={pin.imageUrl} alt="" className="w-full h-full object-cover" />}</div>
                  ))}
                </div>
              ) : null}
              <h3 className="font-medium mb-1">{board.title}</h3>
              <div className="flex items-center gap-3 text-text-muted text-sm">
                <span className="flex items-center gap-1"><Pin size={12} />{board._count?.pins || 0}</span>
                <span className="flex items-center gap-1"><Users size={12} />{board._count?.followers || 0}</span>
                <span className={board.visibility === 'PRIVATE' ? 'text-yellow-400' : 'text-green-400'}>{board.visibility}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}