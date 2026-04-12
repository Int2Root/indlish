'use client';

import { useState } from 'react';
import { Send, Mail, MessageSquare, User } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong');
      }
      setSubmitted(true);
      setName(''); setEmail(''); setMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-24 text-center">
        <div className="card">
          <div className="w-14 h-14 bg-brand-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Send className="text-brand-400" size={24} />
          </div>
          <h1 className="text-2xl font-bold mb-3">Message sent!</h1>
          <p className="text-text-secondary text-sm mb-6 leading-relaxed">
            Thanks for reaching out. We&apos;ll get back to you within 24 hours at the email you provided.
          </p>
          <button onClick={() => setSubmitted(false)} className="btn-secondary text-sm">
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Get in touch</h1>
        <p className="text-text-secondary text-lg max-w-xl mx-auto">
          Have a question, feedback, or just want to say hello? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: Mail, label: 'Email us', value: 'hello@int2root.com', href: 'mailto:hello@int2root.com' },
          { icon: MessageSquare, label: 'Support', value: 'support@indlish.com', href: 'mailto:support@indlish.com' },
          { icon: Send, label: 'Response time', value: 'Within 24 hours', href: null },
        ].map(({ icon: Icon, label, value, href }) => (
          <div key={label} className="card text-center">
            <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Icon className="text-brand-400" size={18} />
            </div>
            <p className="text-text-muted text-xs uppercase tracking-wider font-medium mb-1">{label}</p>
            {href ? (
              <a href={href} className="text-brand-400 hover:underline text-sm">{value}</a>
            ) : (
              <p className="text-text-secondary text-sm">{value}</p>
            )}
          </div>
        ))}
      </div>
      <div className="card max-w-xl mx-auto">
        <h2 className="text-lg font-semibold mb-6">Send us a message</h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1.5">
              Name
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full bg-surface-lighter border border-neutral-700 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-surface-lighter border border-neutral-700 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1.5">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what's on your mind..."
              required
              rows={5}
              className="w-full bg-surface-lighter border border-neutral-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500 resize-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 disabled:opacity-50"
          >
            {submitting ? (
              'Sending...'
            ) : (
              <>
                Send Message <Send size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
