'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-session';
import { toast } from 'sonner';
import { Plus, X, ChevronLeft, Ticket, Clock, MessageCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH';

interface TicketMessage {
  id: string;
  content: string;
  isStaff: boolean;
  createdAt: string;
  user: { id: string; name: string | null; image: string | null };
}

interface SupportTicket {
  id: string;
  subject: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  messages?: TicketMessage[];
  _count?: { messages: number };
}

const statusColors: Record<TicketStatus, string> = {
  OPEN: 'bg-blue-500/20 text-blue-400',
  IN_PROGRESS: 'bg-yellow-500/20 text-yellow-400',
  RESOLVED: 'bg-green-500/20 text-green-400',
  CLOSED: 'bg-neutral-500/20 text-neutral-400',
};

const priorityColors: Record<TicketPriority, string> = {
  LOW: 'bg-neutral-500/20 text-neutral-400',
  MEDIUM: 'bg-brand-500/20 text-brand-400',
  HIGH: 'bg-red-500/20 text-red-400',
};

export default function SupportPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useCurrentUser();
  const router = useRouter();

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [threadLoading, setThreadLoading] = useState(false);

  // New ticket form state
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('MEDIUM');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Reply state
  const [replyContent, setReplyContent] = useState('');
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) { router.push('/login'); return; }
    if (user) fetchTickets();
  }, [user, authLoading, isAuthenticated, router]);

  async function fetchTickets() {
    setLoading(true);
    const res = await fetch('/api/support/tickets');
    const data = await res.json();
    setTickets(data.data || []);
    setLoading(false);
  }

  async function openTicket(ticket: SupportTicket) {
    setThreadLoading(true);
    setSelectedTicket(ticket);
    const res = await fetch(`/api/support/tickets/${ticket.id}`);
    const data = await res.json();
    setSelectedTicket(data.data || ticket);
    setThreadLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, priority, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      toast.success('Ticket raised! We\'ll get back to you soon.');
      setShowForm(false);
      setSubject(''); setPriority('MEDIUM'); setMessage('');
      fetchTickets();
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyContent.trim() || !selectedTicket) return;
    setReplying(true);
    try {
      const res = await fetch(`/api/support/tickets/${selectedTicket.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyContent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setReplyContent('');
      // Append new message to thread
      setSelectedTicket((prev) => prev ? {
        ...prev,
        messages: [...(prev.messages || []), data.data],
      } : prev);
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reply');
    } finally {
      setReplying(false);
    }
  }

  if (loading || authLoading) return <LoadingSpinner className="py-32" />;

  // Thread view
  if (selectedTicket) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => setSelectedTicket(null)}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm mb-6 transition-colors"
        >
          <ChevronLeft size={16} /> Back to tickets
        </button>

        <div className="card mb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold">{selectedTicket.subject}</h1>
              <p className="text-text-muted text-sm mt-1">Opened {formatDate(selectedTicket.createdAt)}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${priorityColors[selectedTicket.priority]}`}>
                {selectedTicket.priority}
              </span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[selectedTicket.status]}`}>
                {selectedTicket.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {threadLoading ? (
          <LoadingSpinner className="py-16" />
        ) : (
          <div className="space-y-3 mb-6">
            {(selectedTicket.messages || []).map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.isStaff ? 'flex-row-reverse' : ''}`}
              >
                {msg.user.image ? (
                  <img src={msg.user.image} alt="" className="w-8 h-8 rounded-full shrink-0 mt-1" />
                ) : (
                  <div className={`w-8 h-8 rounded-full shrink-0 mt-1 flex items-center justify-center text-sm font-bold ${msg.isStaff ? 'bg-purple-500' : 'bg-brand-500'}`}>
                    {msg.isStaff ? 'S' : (msg.user.name?.[0] || 'U')}
                  </div>
                )}
                <div className={`flex-1 max-w-[85%] ${msg.isStaff ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className={`rounded-xl px-4 py-3 text-sm ${msg.isStaff ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-surface-light border border-neutral-800'}`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <span className="text-text-muted text-xs mt-1 px-1">
                    {msg.isStaff ? 'indlish Support' : msg.user.name} · {formatDate(msg.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedTicket.status !== 'CLOSED' && (
          <form onSubmit={handleReply} className="card">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Type your reply..."
              rows={3}
              className="w-full bg-surface-lighter border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500 resize-none mb-3"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={replying || !replyContent.trim()}
                className="btn-primary text-sm disabled:opacity-50"
              >
                {replying ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Support</h1>
          <p className="text-text-secondary mt-1 text-sm">We&apos;re here to help. Raise a ticket and we&apos;ll respond ASAP.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> New Ticket
        </button>
      </div>

      {/* New Ticket Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-surface-light border border-neutral-700 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
              <h2 className="font-semibold text-lg">New Support Ticket</h2>
              <button onClick={() => setShowForm(false)} className="text-text-muted hover:text-text-primary">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief description of your issue"
                  required
                  className="w-full bg-surface-lighter border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TicketPriority)}
                  className="w-full bg-surface-lighter border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                >
                  <option value="LOW">Low — General question</option>
                  <option value="MEDIUM">Medium — Something&apos;s not working</option>
                  <option value="HIGH">High — Urgent issue</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  required
                  rows={5}
                  className="w-full bg-surface-lighter border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500 resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-primary text-sm disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket list */}
      {tickets.length === 0 ? (
        <div className="card text-center py-16">
          <Ticket size={40} className="text-text-muted mx-auto mb-4" />
          <h2 className="font-semibold text-lg mb-2">No tickets yet</h2>
          <p className="text-text-secondary text-sm mb-6">
            If you need help, we&apos;re just a ticket away!
          </p>
          <button onClick={() => setShowForm(true)} className="btn-primary inline-flex items-center gap-2">
            <Plus size={16} /> New Ticket
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => openTicket(ticket)}
              className="w-full card text-left hover:border-neutral-700 transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium group-hover:text-brand-400 transition-colors truncate">
                    {ticket.subject}
                  </h3>
                  <div className="flex items-center gap-3 mt-2 text-text-muted text-xs">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {formatDate(ticket.createdAt)}
                    </span>
                    {ticket._count && (
                      <span className="flex items-center gap-1">
                        <MessageCircle size={11} />
                        {ticket._count.messages} message{ticket._count.messages !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${priorityColors[ticket.priority]}`}>
                    {ticket.priority}
                  </span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[ticket.status]}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
