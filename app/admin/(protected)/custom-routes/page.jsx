"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { revalidateData } from '@/lib/actions';
import {
  Loader2, Save, Timer, ExternalLink, ToggleLeft, ToggleRight,
  Plus, Trash2, AlertCircle, CheckCircle2, Clock, Info, Globe,
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

const SETTINGS_ID = 'custom_routes';

const newRoute = (slug = '') => ({
  slug,
  label: '',
  enabled: false,
  product_name: '',
  widgets: [{ type: 'countdown', launch_date: '' }],
});

export default function CustomRoutesPage() {
  const supabase = createClient();

  // config: { [slug]: routeConfig }
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [newSlugInput, setNewSlugInput] = useState('');
  const [addingRoute, setAddingRoute] = useState(false);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('data')
          .eq('id', SETTINGS_ID)
          .single();
        if (data?.data && typeof data.data === 'object') {
          setConfig(data.data);
        }
      } catch (_) {}
      setLoading(false);
    };
    load();
  }, []);

  const updateRoute = useCallback((slug, patch) => {
    setConfig((prev) => ({
      ...prev,
      [slug]: { ...prev[slug], ...patch },
    }));
  }, []);

  const updateWidget = useCallback((slug, widgetType, patch) => {
    setConfig((prev) => {
      const route = prev[slug] ?? {};
      const widgets = (route.widgets ?? []).map((w) =>
        w.type === widgetType ? { ...w, ...patch } : w
      );
      return { ...prev, [slug]: { ...route, widgets } };
    });
  }, []);

  const addRoute = () => {
    const slug = newSlugInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (!slug) return;
    if (config[slug]) {
      showToast('error', `Route "${slug}" already exists.`);
      return;
    }
    setConfig((prev) => ({ ...prev, [slug]: newRoute(slug) }));
    setNewSlugInput('');
    setAddingRoute(false);
  };

  const deleteRoute = (slug) => {
    setConfig((prev) => {
      const next = { ...prev };
      delete next[slug];
      return next;
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('site_settings').upsert({
        id: SETTINGS_ID,
        data: config,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      await revalidateData('custom-routes');
      showToast('success', 'Saved. Changes live on site.');
    } catch (e) {
      showToast('error', e.message ?? 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-muted-foreground" size={28} />
      </div>
    );
  }

  const slugs = Object.keys(config);

  return (
    <div className="max-w-3xl mx-auto pb-20 md:pb-8 animate-fade-in">
      {/* header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Custom Routes</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Special public pages with countdown timers. Each route is accessible at its slug URL.
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 shrink-0"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          Save All
        </button>
      </div>

      {toast && (
        <div
          className={clsx(
            'flex items-center gap-2 px-4 py-3 rounded-lg text-sm mb-6 border',
            toast.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          )}
        >
          {toast.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
          {toast.msg}
        </div>
      )}

      {/* route cards */}
      <div className="space-y-4">
        {slugs.length === 0 && !addingRoute && (
          <div className="border border-dashed border-border rounded-xl p-12 text-center text-muted-foreground text-sm">
            <Globe size={24} className="mx-auto mb-3 opacity-40" />
            No custom routes yet. Add one below.
          </div>
        )}

        {slugs.map((slug) => {
          const route = config[slug];
          const countdown = route.widgets?.find((w) => w.type === 'countdown');
          const isSoon = slug === 'soon';
          const href = isSoon ? '/soon' : `/launch/${slug}`;

          return (
            <div key={slug} className="border border-border rounded-xl bg-background overflow-hidden">
              {/* route header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-secondary/20">
                <div className="flex items-center gap-3 min-w-0">
                  <Timer size={17} className="text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{route.label || slug}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">{href}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground"
                    title="Preview"
                  >
                    <ExternalLink size={14} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => updateRoute(slug, { enabled: !route.enabled })}
                    className={clsx(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                      route.enabled
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                    )}
                  >
                    {route.enabled ? <><ToggleRight size={14} /> Enabled</> : <><ToggleLeft size={14} /> Disabled</>}
                  </button>
                  {!isSoon && (
                    <button
                      type="button"
                      onClick={() => deleteRoute(slug)}
                      className="p-1.5 rounded-md hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
                      title="Delete route"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* route body */}
              <div className="p-5 space-y-4">
                {/* label */}
                <Field label="Route Label" hint="Display name (admin only)">
                  <input
                    type="text"
                    value={route.label ?? ''}
                    onChange={(e) => updateRoute(slug, { label: e.target.value })}
                    placeholder={slug}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors"
                  />
                </Field>

                {/* product name */}
                <Field label="Product Name" hint="Shown on the page under logo">
                  <input
                    type="text"
                    value={route.product_name ?? ''}
                    onChange={(e) => updateRoute(slug, { product_name: e.target.value })}
                    placeholder="e.g. HiFi ROSE RW800"
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors"
                  />
                </Field>

                {/* countdown widget */}
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-secondary/30 border-b border-border">
                    <Clock size={13} className="text-muted-foreground" />
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Countdown Timer — counts to midnight on launch date
                    </span>
                  </div>
                  <div className="p-4 space-y-3">
                    <Field label="Launch Date">
                      <input
                        type="date"
                        value={countdown?.launch_date ?? ''}
                        onChange={(e) => updateWidget(slug, 'countdown', { launch_date: e.target.value })}
                        className="px-3 py-2 text-sm bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors"
                      />
                    </Field>
                    {countdown?.launch_date && <CountdownPreview date={countdown.launch_date} />}
                  </div>
                </div>

                {isSoon && (
                  <div className="flex items-start gap-2 text-xs text-muted-foreground bg-secondary/40 rounded-lg px-3 py-2.5">
                    <Info size={13} className="shrink-0 mt-0.5" />
                    <span>
                      This route is always at <code className="font-mono">/soon</code>. Additional routes are at{' '}
                      <code className="font-mono">/launch/{'{slug}'}</code>.
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* add route */}
        {addingRoute ? (
          <div className="border border-border rounded-xl p-5 bg-background space-y-3">
            <p className="text-sm font-medium">New Route</p>
            <div className="flex gap-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground bg-secondary/50 px-3 py-2 rounded-lg border border-border shrink-0">
                /launch/
              </div>
              <input
                type="text"
                value={newSlugInput}
                onChange={(e) => setNewSlugInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addRoute()}
                placeholder="product-slug"
                autoFocus
                className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors font-mono"
              />
            </div>
            <p className="text-xs text-muted-foreground">Lowercase letters, numbers, hyphens only.</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addRoute}
                disabled={!newSlugInput.trim()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40"
              >
                Add Route
              </button>
              <button
                type="button"
                onClick={() => { setAddingRoute(false); setNewSlugInput(''); }}
                className="px-4 py-2 text-sm text-muted-foreground hover:bg-secondary rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAddingRoute(true)}
            className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-border rounded-xl text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            <Plus size={15} />
            Add Custom Route
          </button>
        )}
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">{label}</label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function CountdownPreview({ date }) {
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    const calc = () => {
      const diff = new Date(date + 'T00:00:00').getTime() - Date.now();
      if (diff <= 0) return setRemaining(null);
      setRemaining({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [date]);

  if (!remaining) {
    return (
      <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
        Launch date has passed — timer will show zeros.
      </p>
    );
  }

  const pad = (n) => String(n).padStart(2, '0');
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
      <span>Preview:</span>
      <span className="font-mono font-medium text-foreground">
        {remaining.days}d {pad(remaining.hours)}h {pad(remaining.minutes)}m {pad(remaining.seconds)}s remaining
      </span>
    </div>
  );
}
