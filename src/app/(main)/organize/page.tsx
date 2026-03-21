'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-session';
import { BookOpen, Plus, FileText } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function OrganizePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useCurrentUser();
  const router = useRouter();
  const [notebooks, setNotebooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) { router.push('/login'); return; }
    if (user) {
      fetch('/api/notebooks').then(r => r.json()).then(d => { setNotebooks(d.data || []); setLoading(false); });
    }
  }, [user, authLoading, isAuthenticated, router]);

  const createNotebook = async () => {
    if (!newTitle.trim()) return;
    const res = await fetch('/api/notebooks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: newTitle }) });
    const data = await res.json();
    if (data.success) { setNotebooks([data.data, ...notebooks]); setNewTitle(''); setCreating(false); toast.success('Notebook created!'); }
    else toast.error(data.error);
  };

  if (loading || authLoading) return <LoadingSpinner className="py-32" />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Your Notebooks</h1>
        <button onClick={() => setCreating(true)} className="btn-primary flex items-center gap-2"><Plus size={16} />New Notebook</button>
      </div>

      {creating && (
        <div className="card mb-6 flex items-center gap-3">
          <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Notebook title..." className="input-field flex-1" autoFocus onKeyDown={(e) => e.key === 'Enter' && createNotebook()} />
          <button onClick={createNotebook} className="btn-primary text-sm">Create</button>
          <button onClick={() => setCreating(false)} className="btn-ghost text-sm">Cancel</button>
        </div>
      )}

      {notebooks.length === 0 ? (
        <EmptyState icon={BookOpen} title="No notebooks yet" description="Create a notebook to start organizing your thoughts and ideas." action={<button onClick={() => setCreating(true)} className="btn-primary">Create Notebook</button>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notebooks.map((nb: any) => (
            <div key={nb.id} className="card hover:border-neutral-600 transition-colors cursor-pointer" onClick={() => router.push(`/organize?notebook=${nb.id}`)}>
              <div className="text-3xl mb-3">{nb.emoji || '📓'}</div>
              <h3 className="font-medium mb-1">{nb.title}</h3>
              <div className="flex items-center gap-2 text-text-muted text-sm">
                <FileText size={14} /><span>{nb._count?.notes || 0} notes</span>
                <span>·</span><span>{formatDate(nb.updatedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}