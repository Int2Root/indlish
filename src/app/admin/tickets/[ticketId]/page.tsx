'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, Shield } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';
import { toast } from 'sonner';

const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH'];
const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    LOW: 'bg-neutral-700/60 text-neutral-400',
    MEDIUM: 'bg-yellow-500/20 text-yellow-400',
    HIGH: 'bg-red-500/20 text-red-400',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[priority] ?? styles.MEDIUM}`}>
      {priority.charAt(0) + priority.slice(1).toLowerCase()}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    OPEN: 'bg-blue-500/20 text-blue-400',
    IN_PROGRESS: 'bg-orange-500/20 text-orange-400',
    RESOLVED: 'bg-green-500/20 text-green-400',
  };
  const labels: Record<string, string> = {
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    RESOLVED: 'Resolved',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] ?? styles.OPEN}`}>
      {labels[status] ?? status}
    </span>
  );
}

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.ticketId as string;

  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [updating, setUpdating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/admin/tickets/${ticketId}`)
      .then((r) => r.json())
      .then((d) => {
        setTicket(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [ticketId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.messages]);

  async function updateTicket(patch: Record<string, string>) {
    setUpdating(true);
    const res = await fetch(`/api/admin/tickets/${ticketId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    const data = await res.json();
    if (data.success) {
      setTicket(data.data);
      toast.success('Ticket updated');
    } else {
      toast.error('Failed to update ticket');
    }
    setUpdating(false);
  }

  async function sendReply() {
    if (!reply.trim()) return;
    setSending(true);
    const res = await fetch(`/api/admin/tickets/${ticketId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: reply }),
    });
    const data = await res.json();
    if (data.success) {
      setTicket(data.data);
      setReply('');
      toast.success('Reply sent');
    } else {
      toast.error('Failed to send reply');
    }
    setSending(false);
  }

  if (loading) return <LoadingSpinner className="py-20" />;
  if (!ticket) {
    return (
      <div className="text-center py-20">
        <p className="text-neutral-500">Ticket not found</p>
        <Link href="/admin/tickets" className="text-orange-400 text-sm mt-2 inline-block">
          ← Back to tickets
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/tickets"
            className="p-2 rounded-lg bg-[#1a1a1a] border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={15} />
          </Link>
          <div>
            <h1 className="text-xl font-bold">{ticket.subject}</h1>
            <p className="text-neutral-400 text-sm mt-0.5">
              from {ticket.user?.name || ticket.email} · {formatDate(ticket.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message Thread */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Messages */}
          <div className="bg-[#1a1a1a] border border-neutral-800 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-800">
              <span className="text-sm font-medium">
                Thread ({ticket.messages?.length ?? 0} messages)
              </span>
            </div>
            <div className="p-5 space-y-4 max-h-[500px] overflow-y-auto">
              {ticket.messages?.map((msg: any) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.isAdmin ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      msg.isAdmin
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'bg-neutral-700 text-neutral-300'
                    }`}
                  >
                    {msg.isAdmin ? <Shield size={13} /> : (ticket.user?.name || ticket.email)[0].toUpperCase()}
                  </div>
                  <div
                    className={`flex-1 max-w-[80%] ${msg.isAdmin ? 'items-end' : 'items-start'} flex flex-col`}
                  >
                    <div
                      className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${
                        msg.isAdmin
                          ? 'bg-orange-500/15 border border-orange-500/20 text-white'
                          : 'bg-[#242424] border border-neutral-700/50 text-neutral-200'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-neutral-600 text-xs mt-1 px-1">
                      {msg.isAdmin ? 'Admin' : ticket.user?.name || ticket.email} ·{' '}
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Reply Form */}
          <div className="bg-[#1a1a1a] border border-neutral-800 rounded-xl p-5">
            <p className="text-sm font-medium mb-3">Reply as Admin</p>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your reply..."
              rows={4}
              className="w-full bg-[#111111] border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-orange-500/50 resize-none"
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={sendReply}
                disabled={sending || !reply.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={14} />
                {sending ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar: Ticket Details */}
        <div className="space-y-4">
          <div className="bg-[#1a1a1a] border border-neutral-800 rounded-xl p-5">
            <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-4">
              Ticket Details
            </p>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-neutral-500 text-xs mb-1">Email</p>
                <p className="text-white">{ticket.email}</p>
              </div>
              {ticket.user && (
                <div>
                  <p className="text-neutral-500 text-xs mb-1">User</p>
                  <p className="text-white">{ticket.user.name}</p>
                </div>
              )}
              <div>
                <p className="text-neutral-500 text-xs mb-1">Created</p>
                <p className="text-neutral-300">{formatDate(ticket.createdAt)}</p>
              </div>
              <div>
                <p className="text-neutral-500 text-xs mb-1">Last Updated</p>
                <p className="text-neutral-300">{formatDate(ticket.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div className="bg-[#1a1a1a] border border-neutral-800 rounded-xl p-5">
            <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-4">
              Update Status
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-neutral-400 mb-1.5 block">Status</label>
                <select
                  value={ticket.status}
                  onChange={(e) => updateTicket({ status: e.target.value })}
                  disabled={updating}
                  className="w-full bg-[#111111] border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50 cursor-pointer disabled:opacity-50"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s === 'IN_PROGRESS' ? 'In Progress' : s.charAt(0) + s.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-neutral-400 mb-1.5 block">Priority</label>
                <select
                  value={ticket.priority}
                  onChange={(e) => updateTicket({ priority: e.target.value })}
                  disabled={updating}
                  className="w-full bg-[#111111] border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50 cursor-pointer disabled:opacity-50"
                >
                  {PRIORITY_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0) + p.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
