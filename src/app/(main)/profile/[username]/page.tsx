'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-session';
import ArticleCard from '@/components/articles/ArticleCard';
import FollowButton from '@/components/articles/FollowButton';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { UserIcon, Users, FileText, IndianRupee } from 'lucide-react';
import { formatNumber, formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser } = useCurrentUser();
  const [profile, setProfile] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [boards, setBoards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tipAmount, setTipAmount] = useState(50);
  const [tipping, setTipping] = useState(false);

  useEffect(() => {
    fetch(`/api/search?q=${username}&type=users`).then((r) => r.json()).then(async (d) => {
      const foundUser = d.data?.users?.find((u: any) => u.username === username);
      if (foundUser) {
        setProfile(foundUser);
        const [articlesRes, boardsRes] = await Promise.all([
          fetch(`/api/articles?authorId=${foundUser.id}`).then((r) => r.json()),
          fetch(`/api/boards?userId=${foundUser.id}`).then((r) => r.json()),
        ]);
        setArticles(articlesRes.data?.articles || []);
        setBoards(boardsRes.data?.boards || []);
      }
      setLoading(false);
    });
  }, [username]);

  const handleTip = async () => {
    if (!profile) return;
    setTipping(true);
    const res = await fetch('/api/tips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: tipAmount, toUserId: profile.id }),
    });
    const data = await res.json();
    setTipping(false);
    if (data.success) toast.success(`Tipped ₹${tipAmount}! 🎉`);
    else toast.error(data.error);
  };

  if (loading) return <LoadingSpinner className="py-32" />;
  if (!profile) return <div className="text-center py-32 text-text-muted">Creator not found</div>;

  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="card mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="shrink-0">
            {profile.image ? (
              <img src={profile.image} alt="" className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-brand-500 flex items-center justify-center text-3xl font-bold text-white">
                {profile.name?.[0]}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-text-muted">@{profile.username}</p>
            {profile.bio && <p className="text-text-secondary mt-2 text-sm">{profile.bio}</p>}
            <div className="flex items-center gap-4 mt-3 text-text-muted text-sm">
              <span className="flex items-center gap-1.5">
                <FileText size={14} />{formatNumber(profile._count?.articles || 0)} articles
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={14} />{formatNumber(profile._count?.followers || 0)} followers
              </span>
            </div>
          </div>

          {!isOwnProfile && (
            <div className="flex flex-col gap-3">
              <FollowButton authorId={profile.id} />
              {currentUser && (
                <div className="flex items-center gap-1">
                  <select
                    value={tipAmount}
                    onChange={(e) => setTipAmount(Number(e.target.value))}
                    className="input-field text-sm py-1.5 flex-1"
                  >
                    <option value={10}>₹10</option>
                    <option value={50}>₹50</option>
                    <option value={100}>₹100</option>
                    <option value={500}>₹500</option>
                  </select>
                  <button
                    onClick={handleTip}
                    disabled={tipping}
                    className="btn-primary text-sm flex items-center gap-1 px-3 py-1.5"
                  >
                    <IndianRupee size={12} /> Tip
                  </button>
                </div>
              )}
            </div>
          )}

          {isOwnProfile && (
            <Link href="/settings" className="btn-secondary text-sm">Edit Profile</Link>
          )}
        </div>
      </div>

      {articles.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Articles</h2>
          <div className="space-y-4">
            {articles.map((a: any) => <ArticleCard key={a.id} article={a} />)}
          </div>
        </div>
      )}

      {boards.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Boards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {boards.map((b: any) => (
              <Link key={b.id} href={`/curate/${b.id}`} className="card hover:border-neutral-600 transition-colors">
                <h3 className="font-medium">{b.title}</h3>
                <p className="text-text-muted text-sm mt-1">{b._count?.pins || 0} pins</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {articles.length === 0 && boards.length === 0 && (
        <EmptyState
          icon={UserIcon}
          title="Nothing here yet"
          description="This creator hasn't published any content yet."
        />
      )}
    </div>
  );
}
