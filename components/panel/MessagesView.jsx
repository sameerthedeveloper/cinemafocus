"use client";

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Mail, Reply, Check, CheckCheck, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { EmptyState } from '@/components/panel/ui';

const FILTERS = [['all', 'All'], ['unread', 'Unread'], ['read', 'Read']];

/** Inbox. Search, read/unread filter, and "Mark as read" per message or for everything at once. */
export default function MessagesView({ messages: initial }) {
  const router = useRouter();
  const [messages, setMessages] = useState(initial);
  const [pending, setPending] = useState(() => new Set());
  const [failed, setFailed] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('unread');

  const patch = async (id, status) => {
    const res = await fetch(`/api/portal/messages/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error();
  };

  const applyStatus = (ids, status) => {
    const set = new Set(ids);
    setMessages((all) => all.map((m) => (set.has(m.id) ? { ...m, status } : m)));
    window.dispatchEvent(new Event('portal:messages-changed'));
    router.refresh();
  };

  const setRead = async (message, read) => {
    const status = read ? 'read' : 'unread';
    setPending((p) => new Set(p).add(message.id));
    setFailed(null);
    try {
      await patch(message.id, status);
      applyStatus([message.id], status);
    } catch {
      setFailed(message.id);
    } finally {
      setPending((p) => { const n = new Set(p); n.delete(message.id); return n; });
    }
  };

  const markAllRead = async () => {
    const ids = messages.filter((m) => m.id && m.status !== 'read').map((m) => m.id);
    if (!ids.length) return;
    setMarkingAll(true);
    setFailed(null);
    const done = [];
    // a few at a time, so a long inbox does not flood the API
    for (let i = 0; i < ids.length; i += 5) {
      const batch = ids.slice(i, i + 5);
      const results = await Promise.allSettled(batch.map((id) => patch(id, 'read')));
      results.forEach((r, j) => { if (r.status === 'fulfilled') done.push(batch[j]); });
    }
    if (done.length) applyStatus(done, 'read');
    if (done.length < ids.length) setFailed('all');
    setMarkingAll(false);
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
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email or message"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-11 w-full rounded-full border border-transparent bg-secondary pl-11 pr-10 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground focus:bg-background"
          />
          {q && (
            <button onClick={() => setQ('')} className="absolute right-3.5 top-3.5 rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-accent" aria-label="Clear search">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              aria-pressed={filter === key}
              className={clsx('h-9 rounded-full px-4 text-xs font-medium tabular transition-colors', filter === key ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-accent')}
            >
              {label} <span className={filter === key ? 'opacity-70' : 'text-muted-foreground'}>{counts[key]}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={markAllRead}
            disabled={markingAll || counts.unread === 0}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-4 text-xs font-medium transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
          >
            {markingAll ? <Loader2 size={14} className="animate-spin" /> : <CheckCheck size={14} />}
            Mark all as read
          </button>
        </div>
      </div>
      {failed === 'all' && <p className="mb-4 text-sm text-danger" role="alert">Some messages could not be updated. Try again.</p>}

      <div className="space-y-3">
        {rows.map((message, i) => {
          const read = message.status === 'read';
          const busy = pending.has(message.id);
          const d = message.created_at ? new Date(message.created_at) : null;
          return (
            <article
              key={message.id ?? i}
              className={clsx('rounded-card border p-5 transition-colors md:p-6', read ? 'border-border' : 'border-foreground')}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {!read && <span className="h-2 w-2 shrink-0 rounded-full bg-signal" role="img" aria-label="Unread" />}
                    <h3 className={clsx('text-lg tracking-tight', read ? 'font-normal text-muted-foreground' : 'font-medium')}>{message.name}</h3>
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">{message.subject || 'New enquiry'}</span>
                  </div>
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                    <Mail size={14} /> <span className="break-all">{message.email}</span>
                    {d && <span aria-hidden="true">·</span>}
                    {d && <time dateTime={d.toISOString()}>{d.toLocaleString()}</time>}
                  </p>
                  <p className={clsx('whitespace-pre-wrap leading-relaxed', read ? 'text-muted-foreground' : 'text-foreground')}>{message.text}</p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2 md:flex-col md:items-stretch">
                  {message.id && (
                    <button
                      type="button"
                      onClick={() => setRead(message, !read)}
                      disabled={busy}
                      className={clsx(
                        'inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors disabled:opacity-50',
                        read ? 'border border-border text-muted-foreground hover:bg-secondary hover:text-foreground' : 'bg-primary text-primary-foreground hover:bg-primary/90'
                      )}
                    >
                      {busy ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                      {read ? 'Mark as unread' : 'Mark as read'}
                    </button>
                  )}
                  {message.email && (
                    <a
                      href={`mailto:${encodeURIComponent(message.email)}?subject=${encodeURIComponent(`Re: ${message.subject || 'Enquiry'} - Cinema Focus`)}`}
                      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-secondary px-4 text-sm font-medium transition-colors hover:bg-accent"
                    >
                      <Reply size={14} /> Reply
                    </a>
                  )}
                </div>
              </div>
              {failed === message.id && <p className="mt-3 text-sm text-danger" role="alert">Could not update this message. Try again.</p>}
            </article>
          );
        })}
        {rows.length === 0 && (
          <EmptyState
            title={messages.length ? (filter === 'unread' && !q ? 'You are all caught up.' : 'No messages match.') : 'No enquiries received yet.'}
            hint={filter === 'unread' && !q && messages.length ? 'Switch to All to see read messages.' : undefined}
          />
        )}
      </div>
    </div>
  );
}
