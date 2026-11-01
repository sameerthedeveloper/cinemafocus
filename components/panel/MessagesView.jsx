"use client";

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Mail, Reply, CheckCircle, Circle } from 'lucide-react';
import clsx from 'clsx';
import { EmptyState } from '@/components/panel/ui';

const FILTERS = [['all', 'All'], ['unread', 'Unread'], ['read', 'Read']];

/** Inbox. Cards match the admin Messages page; adds search, a read/unread filter and mark as seen/unseen. */
export default function MessagesView({ messages: initial }) {
  const router = useRouter();
  const [messages, setMessages] = useState(initial);
  const [pending, setPending] = useState(null);
  const [failed, setFailed] = useState(null);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');

  const setSeen = async (message, seen) => {
    const status = seen ? 'read' : 'unread';
    setPending(message.id);
    setFailed(null);
    try {
      const res = await fetch(`/api/portal/messages/${encodeURIComponent(message.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      setMessages((all) => all.map((m) => (m.id === message.id ? { ...m, status } : m)));
      window.dispatchEvent(new Event('portal:messages-changed'));
      router.refresh();
    } catch {
      setFailed(message.id);
    } finally {
      setPending(null);
    }
  };

  const counts = useMemo(() => {
    const unread = messages.filter((m) => m.status !== 'read').length;
    return { all: messages.length, unread, read: messages.length - unread };
  }, [messages]);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return messages.filter((m) => {
      if (filter === 'unread' && m.status === 'read') return false;
      if (filter === 'read' && m.status !== 'read') return false;
      return !needle || [m.name, m.email, m.subject, m.text].some((v) => String(v || '').toLowerCase().includes(needle));
    });
  }, [messages, q, filter]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6">
        <div className="max-w-md w-full relative">
          <Search className="absolute left-3.5 top-3 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name, email or message..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-border/80 bg-background/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
          {q && (
            <button onClick={() => setQ('')} className="absolute right-3 top-3 p-0.5 rounded-full hover:bg-secondary/85 text-muted-foreground transition-colors" title="Clear search">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {FILTERS.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={clsx("px-4 py-2 rounded-full text-xs font-semibold transition-colors tabular", filter === key ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80 text-foreground")}
            >
              {label} <span className={filter === key ? "opacity-70" : "text-muted-foreground"}>{counts[key]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {rows.map((message, i) => {
          const read = message.status === 'read';
          const d = message.created_at ? new Date(message.created_at) : null;
          return (
            <div
              key={message.id ?? i}
              className={clsx(
                "bg-background p-6 rounded-2xl border transition-all group",
                read ? "border-border opacity-75" : "border-primary/50 shadow-sm bg-primary/5"
              )}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={clsx("font-medium text-lg", !read && "text-primary")}>{message.name}</span>
                    <span className="text-sm text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{message.subject || 'New Inquiry'}</span>
                    {!read && <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>}
                  </div>

                  <p className="text-muted-foreground text-sm flex items-center gap-2">
                    <Mail size={14} /> {message.email} • {d ? d.toLocaleString() : ''}
                  </p>

                  <p className="text-foreground mt-2 leading-relaxed whitespace-pre-wrap">{message.text}</p>
                </div>

                <div className="flex flex-col gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  {message.email && (
                    <a
                      href={`mailto:${encodeURIComponent(message.email)}?subject=${encodeURIComponent(`Re: ${message.subject || 'Inquiry'} - Cinema Focus`)}`}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors border border-transparent hover:border-primary/20 flex items-center justify-center"
                      title="Reply by email"
                    >
                      <Reply size={18} />
                    </a>
                  )}
                  {message.id && (
                    <button
                      type="button"
                      onClick={() => setSeen(message, !read)}
                      disabled={pending === message.id}
                      aria-label={read ? 'Mark as unseen' : 'Mark as seen'}
                      title={failed === message.id ? 'Could not update. Try again.' : read ? 'Mark as unseen' : 'Mark as seen'}
                      className={clsx(
                        "p-2 rounded-lg transition-colors border disabled:opacity-50 flex items-center justify-center",
                        failed === message.id ? "text-red-500 border-red-500/30"
                          : read ? "text-green-500 border-transparent hover:bg-secondary"
                          : "text-muted-foreground border-transparent hover:text-green-500 hover:bg-green-500/10 hover:border-green-500/20"
                      )}
                    >
                      {read ? <CheckCircle size={18} /> : <Circle size={18} />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {rows.length === 0 && (
          <EmptyState title={messages.length ? 'No messages match your search.' : 'No inquiries received yet.'} />
        )}
      </div>
    </div>
  );
}
