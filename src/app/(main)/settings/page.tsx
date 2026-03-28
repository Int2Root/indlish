'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-session';
import { toast } from 'sonner';
import { Save, User, IndianRupee, Wifi, WifiOff, Gift } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useLowDataMode } from '@/hooks/use-low-data-mode';
import Link from 'next/link';

export default function SettingsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useCurrentUser();
  const router = useRouter();
  const { lowDataMode, toggle: toggleLowData } = useLowDataMode();
  const [profile, setProfile] = useState({
    name: '', username: '', bio: '', image: '',
    upiId: '',
    socialLinks: { twitter: '', github: '', website: '', linkedin: '' },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) { router.push('/login'); return; }
    if (user) {
      fetch('/api/users').then(r => r.json()).then(d => {
        if (d.success) {
          const u = d.data;
          // Auto-suggest a username if the user doesn't have one yet
          let suggestedUsername = u.username || '';
          if (!suggestedUsername && u.name) {
            suggestedUsername = u.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-+|-+$/g, '').slice(0, 20);
          }
          setProfile({
            name: u.name || '',
            username: suggestedUsername,
            bio: u.bio || '',
            image: u.image || '',
            upiId: u.upiId || '',
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

      {/* Profile */}
      <div className="card space-y-6 mb-6">
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
            <label className="block text-sm font-medium text-text-secondary mb-1">Profile Photo</label>
            <div className="flex items-center gap-3">
              {profile.image ? (
                <img src={profile.image} alt="Avatar preview" className="w-12 h-12 rounded-full object-cover shrink-0 border border-neutral-700" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-brand-500 flex items-center justify-center text-lg font-bold shrink-0">
                  {profile.name?.[0] || <User size={18} />}
                </div>
              )}
              <input type="url" value={profile.image} onChange={(e) => setProfile({ ...profile, image: e.target.value })} className="input-field flex-1" placeholder="Paste image URL (https://...)" />
            </div>
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

      {/* UPI / Monetization */}
      <div className="card mb-6">
        <h2 className="font-semibold mb-1 flex items-center gap-2"><IndianRupee size={16} className="text-brand-400" />UPI for Tips</h2>
        <p className="text-text-secondary text-sm mb-4">Add your UPI ID so readers can tip you directly. Paytm, PhonePe, GPay — sab chalega!</p>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">UPI ID</label>
          <input
            type="text"
            value={profile.upiId}
            onChange={(e) => setProfile({ ...profile, upiId: e.target.value })}
            className="input-field w-full"
            placeholder="yourname@upi or 9999999999@paytm"
          />
          <p className="text-text-muted text-xs mt-1.5">Format: name@bank or phone@paytm / phone@ybl</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary mt-4 flex items-center gap-2">
          <Save size={16} />{saving ? 'Saving...' : 'Save UPI ID'}
        </button>
      </div>

      {/* Low Data Mode */}
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            {lowDataMode ? <WifiOff className="text-yellow-400 shrink-0 mt-0.5" size={18} /> : <Wifi className="text-brand-400 shrink-0 mt-0.5" size={18} />}
            <div>
              <h2 className="font-semibold">Low Data Mode</h2>
              <p className="text-text-secondary text-sm mt-0.5">
                {lowDataMode ? 'Saving data — images lazy-loaded, animations reduced.' : 'Full quality mode. Toggle to save data on slow connections.'}
              </p>
            </div>
          </div>
          <button
            onClick={toggleLowData}
            className={`relative w-12 h-6 rounded-full transition-colors ${lowDataMode ? 'bg-yellow-500' : 'bg-brand-500'}`}
            aria-label="Toggle low data mode"
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${lowDataMode ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {/* Referral */}
      <div className="card bg-gradient-to-r from-brand-500/10 to-transparent border-brand-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold flex items-center gap-2"><Gift size={15} className="text-brand-400" />Invite Friends</h3>
            <p className="text-text-secondary text-sm mt-1">Share your referral link. Earn Pro for every friend who joins!</p>
          </div>
          <Link href="/referral" className="btn-primary text-sm">Invite</Link>
        </div>
      </div>
    </div>
  );
}
