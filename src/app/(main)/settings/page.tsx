'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-session';
import { toast } from 'sonner';
import { Save, User } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function SettingsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useCurrentUser();
  const router = useRouter();
  const [profile, setProfile] = useState({ name: '', username: '', bio: '', image: '', socialLinks: { twitter: '', github: '', website: '', linkedin: '' } });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) { router.push('/login'); return; }
    if (user) {
      fetch('/api/users').then(r => r.json()).then(d => {
        if (d.success) {
          const u = d.data;
          setProfile({
            name: u.name || '',
            username: u.username || '',
            bio: u.bio || '',
            image: u.image || '',
            socialLinks: u.socialLinks || { twitter: '', github: '', website: '', linkedin: '' },
          });
        }
        setLoading(false);
      });
    }
  }, [user, authLoading, isAuthenticated, router]);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch('/api/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) });
    const data = await res.json();
    setSaving(false);
    if (data.success) toast.success('Profile updated!');
    else toast.error(data.error || 'Update failed');
  };

  if (loading || authLoading) return <LoadingSpinner className="py-32" />;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      <div className="card space-y-6">
        <div className="flex items-center gap-4">
          {profile.image ? <img src={profile.image} alt="" className="w-16 h-16 rounded-full" /> : <div className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center text-2xl font-bold">{profile.name?.[0] || <User size={24} />}</div>}
          <div>
            <h2 className="font-semibold">{profile.name || 'Your Name'}</h2>
            <p className="text-text-muted text-sm">@{profile.username || 'username'}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Name</label>
            <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Username</label>
            <input type="text" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} className="input-field w-full" placeholder="lowercase-only" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Bio</label>
            <textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} className="input-field w-full" rows={3} placeholder="Tell us about yourself..." maxLength={300} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Profile Image URL</label>
            <input type="url" value={profile.image} onChange={(e) => setProfile({ ...profile, image: e.target.value })} className="input-field w-full" placeholder="https://..." />
          </div>

          <div className="border-t border-neutral-700 pt-4">
            <h3 className="font-medium mb-3">Social Links</h3>
            <div className="space-y-3">
              <input type="text" value={profile.socialLinks.twitter} onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, twitter: e.target.value } })} className="input-field w-full" placeholder="Twitter/X handle" />
              <input type="text" value={profile.socialLinks.github} onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, github: e.target.value } })} className="input-field w-full" placeholder="GitHub username" />
              <input type="url" value={profile.socialLinks.website} onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, website: e.target.value } })} className="input-field w-full" placeholder="Personal website URL" />
              <input type="text" value={profile.socialLinks.linkedin} onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, linkedin: e.target.value } })} className="input-field w-full" placeholder="LinkedIn profile" />
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          <Save size={16} />{saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}