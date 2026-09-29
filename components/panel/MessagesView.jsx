"use client";

import React, { useMemo, useState } from 'react';
import { Search, Mail, ChevronDown, Reply } from 'lucide-react';
import clsx from 'clsx';
import { Badge, EmptyState } from '@/components/panel/ui';

const FILTERS = [['all', 'All'], ['unread', 'Unread'], ['read', 'Read']];
const when = (m) => (m.created_at ? new Date(m.created_at) : null);

/** Read-only inbox for the owner portal: search, filter, expand a message, reply by email. */
export default function MessagesView({ messages }) {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(null);

  const counts = useMemo(() => {
    const unread = messages.filter((m) => m.status !== 'read').length;
    return { all: messages.length, unread, read: messages.length - unread };
  }, [messages]);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return messages.filter((m) => {
      if (filter === 'unread' && m.status === 'read') return false;
      if (filter === 'read' && m.status !== 'read') return false;
      if (!needle) return true;
      return [m.name, m.email, m.subject, m.text].some((v) => String(v || '').toLowerCase().includes(needle));
    });
  }, [messages, q, filter]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
        <div className="relative sm:max-w-sm w-full">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--admin-muted)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email or message"
            className="w-full h-10 pl-10 pr-4 rounded-full border border-transparent bg-black/[0.05] hover:bg-black/[0.07] focus:bg-white text-sm outline-none focus:border-[var(--admin-accent)] focus:shadow-[0_0_0_3px_var(--admin-accent-soft)]"
          />
        </div>
        <div className="segmented self-start">
          {FILTERS.map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)} className={clsx("tabular", filter === key && "is-active")}>
              {label} <span className="text-[var(--admin-muted)]">{counts[key]}</span>
            </button>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState title={messages.length ? 'No messages match' : 'No messages yet'} hint={messages.length ? 'Try a different search or filter.' : 'Contact-form messages will appear here.'} />
      ) : (
        <ul className="space-y-3">
          {rows.map((m) => {
            const isOpen = open === m.id;
            const d = when(m);
            const unread = m.status !== 'read';
            const reply = `mailto:${encodeURIComponent(m.email || '')}?subject=${encodeURIComponent(`Re: ${m.subject || 'Your enquiry'} — Cinema Focus`)}`;
            return (
              <li key={m.id} className={clsx("bg-white border rounded-[20px] shadow-sm transition-colors", unread ? "border-[#e8d7b0]" : "border-[var(--admin-border)]")}>
                <button onClick={() => setOpen(isOpen ? null : m.id)} className="w-full text-left px-5 py-4 flex items-start gap-4" aria-expanded={isOpen}>
                  <span className={clsx("mt-2 w-2 h-2 rounded-full shrink-0", unread ? "bg-[var(--admin-accent)]" : "bg-transparent")} />
                  <span className="flex-1 min-w-0">
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className={clsx("text-sm", unread ? "font-semibold" : "font-medium")}>{m.name || 'Unknown sender'}</span>
                      <span className="text-xs text-[var(--admin-muted)] bg-black/[0.045] rounded-full px-2 py-0.5">{m.subject || 'New Inquiry'}</span>
                    </span>
                    <span className={clsx("mt-1 block text-[13px] text-[var(--admin-muted)]", !isOpen && "line-clamp-1")}>{m.text}</span>
                  </span>
                  <span className="hidden sm:flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-xs text-[var(--admin-muted)] tabular">{d ? d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</span>
                    <Badge tone={unread ? 'warning' : 'success'}>{unread ? 'Unread' : 'Read'}</Badge>
                  </span>
                  <ChevronDown size={16} className={clsx("mt-1 text-[var(--admin-muted)] shrink-0 transition-transform", isOpen && "rotate-180")} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pl-[3.25rem] border-t border-[var(--admin-hairline)] pt-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--admin-muted)] mb-3">
                      <span className="inline-flex items-center gap-1.5"><Mail size={13} /> {m.email || 'no email'}</span>
                      {d && <span className="tabular">{d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>}
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
                    {m.email && (
                      <a href={reply} className="press mt-4 inline-flex items-center gap-2 h-9 px-4 rounded-full bg-[#1d1d1f] text-white text-xs font-medium hover:bg-black transition-all duration-300">
                        <Reply size={14} /> Reply by email
                      </a>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
