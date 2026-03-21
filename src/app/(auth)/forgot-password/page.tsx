'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      // Always show success to prevent user enumeration
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-400">indlish</h1>
          <p className="text-text-secondary mt-2">Reset your password</p>
        </div>

        <div className="card">
          {status === 'sent' ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-4">📬</div>
              <h2 className="text-lg font-semibold text-text-primary mb-2">Check your email</h2>
              <p className="text-text-secondary text-sm">
                If an account exists for <span className="text-brand-400">{email}</span>, we've sent a password reset link. Check your inbox (and spam folder).
              </p>
              <Link href="/login" className="btn-primary inline-block mt-6 text-sm">
                Back to login
              </Link>
            </div>
          ) : (
            <>
              <p className="text-text-secondary text-sm mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {status === 'error' && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 text-red-400 text-sm">
                  Something went wrong. Please try again.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field w-full"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <button type="submit" disabled={status === 'loading'} className="w-full btn-primary">
                  {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <p className="text-center text-text-muted text-sm mt-6">
                Remember your password?{' '}
                <Link href="/login" className="text-brand-400 hover:text-brand-300">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
