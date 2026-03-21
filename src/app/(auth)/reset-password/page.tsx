'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to reset password');
        setStatus('error');
        return;
      }

      setStatus('success');
      setTimeout(() => router.push('/login'), 2000);
    } catch {
      setError('Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-4">
        <div className="text-4xl mb-4">✅</div>
        <h2 className="text-lg font-semibold text-text-primary mb-2">Password reset!</h2>
        <p className="text-text-secondary text-sm">Redirecting you to login...</p>
      </div>
    );
  }

  return (
    <>
      <p className="text-text-secondary text-sm mb-6">Enter your new password below.</p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field w-full"
            placeholder="Minimum 8 characters"
            minLength={8}
            required
            disabled={!token}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Confirm Password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="input-field w-full"
            placeholder="Repeat your password"
            required
            disabled={!token}
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading' || !token}
          className="w-full btn-primary"
        >
          {status === 'loading' ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      <p className="text-center text-text-muted text-sm mt-6">
        <Link href="/login" className="text-brand-400 hover:text-brand-300">
          Back to login
        </Link>
      </p>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-400">indlish</h1>
          <p className="text-text-secondary mt-2">Set a new password</p>
        </div>
        <div className="card">
          <Suspense fallback={<div className="text-text-muted text-sm text-center py-4">Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
