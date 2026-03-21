'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-session';
import { Plus, Trash2, ArrowLeft, ExternalLink, Users } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';

export default function BoardDetailPage() {
  const { boardId } = useParams();
  const router = useRouter();
  const { user } = useCurrentUser();
  const [board, setBoard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addingPin, setAddingPin] = useState(false);
  const [pinForm, setPinForm] = useState({ title: '', content: '', imageUrl: '', linkUrl: '' });

  useEffect(() => {
    fetch(`/api/boards/${boardId}`).then(r => r.json()).then(d => {
      if (d.success) setBoard(d.data);
      setLoading(false);
    });
  }, [boardId]);

  const addPin = async () => {
    const res = await fetch('/api/pins', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...pinForm, boardId }) });
    const data = await res.json();
    if (data.success) { setBoard({ ...board, pins: [data.data, ...board.pins] }); setPinForm({ title: '', content: '', imageUrl: '', linkUrl: '' }); setAddingPin(false); toast.success('Pin added!'); }
    else toast.error(data.error);
  };

  const deletePin = async (pinId: string) => {
    await fetch(`/api/pins/${pinId}`, { method: 'DELETE' });
    setBoard({ ...board, pins: board.pins.filter((p: any) => p.id !== pinId) });
    toast.success('Pin removed');
  };

  const toggleFollow = async () => {
    const res = await fetch(`/api/boards/${boardId}/follow`, { method: 'POST' });
    const data = await res.json();
    if (data.success) toast.success(data.data.followed ? 'Following board!' : 'Unfollowed');
  };

  if (loading) return <LoadingSpinner className="py-32" />;
  if (!board) return <div className="text-center py-32 text-text-muted">Board not found</div>;

  const isOwner = user?.id === board.userId;
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => router.push('/curate')} className="btn-ghost flex items-center gap-2 text-sm mb-6"><ArrowLeft size={16} />Back to Boards</button>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{board.title}</h1>
          {board.description && <p className="text-text-secondary mt-1">{board.description}</p>}
          <div className="flex items-center gap-3 mt-2 text-text-muted text-sm">
            <span>by {board.user?.name}</span>
            <span className="flex items-center gap-1"><Users size={14} />{board._count?.followers} followers</span>
          </div>
        </div>
        <div className="flex gap-2">
          {!isOwner && user && <button onClick={toggleFollow} className="btn-secondary text-sm">Follow</button>}
          {isOwner && <button onClick={() => setAddingPin(true)} className="btn-primary flex items-center gap-2 text-sm"><Plus size={14} />Add Pin</button>}
        </div>
      </div>

      {addingPin && (
        <div className="card mb-6 space-y-3">
          <input type="text" value={pinForm.title} onChange={(e) => setPinForm({ ...pinForm, title: e.target.value })} placeholder="Pin title..." className="input-field w-full" />
          <input type="text" value={pinForm.content} onChange={(e) => setPinForm({ ...pinForm, content: e.target.value })} placeholder="Description..." className="input-field w-full" />
          <input type="url" value={pinForm.imageUrl} onChange={(e) => setPinForm({ ...pinForm, imageUrl: e.target.value })} placeholder="Image URL..." className="input-field w-full" />
          <input type="url" value={pinForm.linkUrl} onChange={(e) => setPinForm({ ...pinForm, linkUrl: e.target.value })} placeholder="Link URL..." className="input-field w-full" />
          <div className="flex gap-2"><button onClick={addPin} className="btn-primary text-sm">Save Pin</button><button onClick={() => setAddingPin(false)} className="btn-ghost text-sm">Cancel</button></div>
        </div>
      )}

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {board.pins?.map((pin: any) => (
          <div key={pin.id} className="card break-inside-avoid">
            {pin.imageUrl && <img src={pin.imageUrl} alt={pin.title || ''} className="w-full rounded-lg mb-3" />}
            {pin.title && <h3 className="font-medium mb-1">{pin.title}</h3>}
            {pin.content && <p className="text-text-secondary text-sm">{pin.content}</p>}
            <div className="flex items-center justify-between mt-3">
              {pin.linkUrl && <a href={pin.linkUrl} target="_blank" rel="noopener noreferrer" className="text-brand-400 text-sm flex items-center gap-1"><ExternalLink size={12} />Visit</a>}
              {isOwner && <button onClick={() => deletePin(pin.id)} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}