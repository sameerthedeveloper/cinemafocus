"use client";

import React, { useEffect, useState } from 'react';
import { Loader2, Save, Plus, Trash2, MessageCircleQuestion, MapPin } from 'lucide-react';
import { createClient } from '@/lib/aws/queryClient';
import { revalidateData } from '@/lib/actions';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const input = "w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none";

const EMPTY = {
  faqs: [],
  aiSummary: '',
  business: {
    phone: '', email: '', streetAddress: '', locality: '', city: '', region: '', postalCode: '',
    latitude: '', longitude: '', days: [], opens: '', closes: '', sameAs: [],
  },
};

/**
 * Admin: AEO (answer-engine) and GEO (generative-engine / local) content.
 * Saved as the `aeo_geo` site setting. Blank fields fall back to the built-in business details.
 */
export default function AeoGeoPanel() {
  const supabase = createClient();
  const [data, setData] = useState(EMPTY);
  const [sameAsText, setSameAsText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data: row } = await supabase.from('site_settings').select('data').eq('id', 'aeo_geo').single();
        if (row?.data) {
          const d = row.data;
          setData({ ...EMPTY, ...d, business: { ...EMPTY.business, ...(d.business || {}) } });
          setSameAsText((d.business?.sameAs || []).join('\n'));
        }
      } catch (e) {
        console.error('Error loading AEO/GEO settings:', e);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setBusiness = (patch) => setData((d) => ({ ...d, business: { ...d.business, ...patch } }));
  const setFaq = (i, patch) => setData((d) => ({ ...d, faqs: d.faqs.map((f, idx) => (idx === i ? { ...f, ...patch } : f)) }));

  const toggleDay = (day) =>
    setBusiness({
      days: data.business.days.includes(day)
        ? data.business.days.filter((d) => d !== day)
        : DAYS.filter((d) => d === day || data.business.days.includes(d)),
    });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...data,
        faqs: data.faqs.filter((f) => f.question.trim() && f.answer.trim()),
        business: {
          ...data.business,
          sameAs: sameAsText.split('\n').map((s) => s.trim()).filter(Boolean),
        },
      };
      const { error } = await supabase.from('site_settings').upsert({ id: 'aeo_geo', data: payload });
      if (error) throw error;
      await revalidateData('settings');
      setMessage('AEO & GEO settings saved.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving AEO/GEO settings:', error);
      setMessage('Failed to save: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center text-muted-foreground"><Loader2 className="animate-spin mr-2" size={18} /> Loading...</div>;
  }

  const b = data.business;

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      {/* FAQ */}
      <div className="bg-background border border-border rounded-2xl p-4 md:p-8 space-y-6">
        <div>
          <h2 className="text-lg md:text-xl font-medium flex items-center gap-2">
            <MessageCircleQuestion size={20} className="text-primary" /> FAQs (answer engines)
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Shown on a public <code>/faq</code> page, marked up as FAQ rich results, and included in <code>llms-full.txt</code>.
            Write short, factual answers. The page is hidden until you add at least one FAQ.
          </p>
        </div>

        {data.faqs.map((f, i) => (
          <div key={i} className="space-y-3 p-4 rounded-xl border border-border/60">
            <div className="flex gap-3">
              <input
                value={f.question}
                maxLength={300}
                onChange={(e) => setFaq(i, { question: e.target.value })}
                className={input}
                placeholder="Question, e.g. Where is the Cinema Focus showroom?"
              />
              <button
                type="button"
                onClick={() => setData((d) => ({ ...d, faqs: d.faqs.filter((_, idx) => idx !== i) }))}
                className="p-3 text-red-500 hover:bg-red-500/10 rounded-lg"
                title="Remove FAQ"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <textarea
              rows={3}
              value={f.answer}
              maxLength={2000}
              onChange={(e) => setFaq(i, { answer: e.target.value })}
              className={input}
              placeholder="Answer"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={() => setData((d) => ({ ...d, faqs: [...d.faqs, { question: '', answer: '' }] }))}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-full hover:border-primary hover:text-primary transition-colors"
        >
          <Plus size={16} /> Add FAQ
        </button>

        <div className="space-y-2">
          <label className="text-sm font-medium">AI summary <span className="text-xs font-normal text-muted-foreground ml-1">(1-2 factual sentences about the business)</span></label>
          <textarea
            rows={3}
            maxLength={600}
            value={data.aiSummary}
            onChange={(e) => setData((d) => ({ ...d, aiSummary: e.target.value }))}
            className={input}
            placeholder="Cinema Focus is a hi-fi and home cinema showroom in Mylapore, Chennai..."
          />
          <p className="text-xs text-muted-foreground">Used as the business description in structured data and at the top of <code>llms-full.txt</code>. Do not include claims you cannot back up.</p>
        </div>
      </div>

      {/* GEO */}
      <div className="bg-background border border-border rounded-2xl p-4 md:p-8 space-y-6">
        <div>
          <h2 className="text-lg md:text-xl font-medium flex items-center gap-2">
            <MapPin size={20} className="text-primary" /> Business details (local &amp; generative search)
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Used in structured data and <code>llms-full.txt</code> only; it does not change text on the website. Leave a field blank to keep the built-in value.
            Keep it identical to your Google Business Profile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2"><label className="text-sm font-medium">Phone</label><input className={input} value={b.phone} onChange={(e) => setBusiness({ phone: e.target.value })} placeholder="+91 98410 35821" /></div>
          <div className="space-y-2"><label className="text-sm font-medium">Email</label><input className={input} value={b.email} onChange={(e) => setBusiness({ email: e.target.value })} placeholder="info@cinemafocus.in" /></div>
          <div className="space-y-2 md:col-span-2"><label className="text-sm font-medium">Street address</label><input className={input} value={b.streetAddress} onChange={(e) => setBusiness({ streetAddress: e.target.value })} /></div>
          <div className="space-y-2"><label className="text-sm font-medium">Area</label><input className={input} value={b.locality} onChange={(e) => setBusiness({ locality: e.target.value })} placeholder="Mylapore" /></div>
          <div className="space-y-2"><label className="text-sm font-medium">City</label><input className={input} value={b.city} onChange={(e) => setBusiness({ city: e.target.value })} placeholder="Chennai" /></div>
          <div className="space-y-2"><label className="text-sm font-medium">State</label><input className={input} value={b.region} onChange={(e) => setBusiness({ region: e.target.value })} placeholder="Tamil Nadu" /></div>
          <div className="space-y-2"><label className="text-sm font-medium">PIN code</label><input className={input} value={b.postalCode} onChange={(e) => setBusiness({ postalCode: e.target.value })} placeholder="600004" /></div>
          <div className="space-y-2"><label className="text-sm font-medium">Latitude</label><input className={input} inputMode="decimal" value={b.latitude} onChange={(e) => setBusiness({ latitude: e.target.value })} placeholder="13.0415" /></div>
          <div className="space-y-2"><label className="text-sm font-medium">Longitude</label><input className={input} inputMode="decimal" value={b.longitude} onChange={(e) => setBusiness({ longitude: e.target.value })} placeholder="80.2720" /></div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Opening days and hours</label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <label key={day} className="flex items-center gap-2 px-3 py-2 rounded-full border border-border text-sm cursor-pointer has-[:checked]:border-primary has-[:checked]:text-primary">
                <input type="checkbox" className="sr-only" checked={b.days.includes(day)} onChange={() => toggleDay(day)} />
                {day.slice(0, 3)}
              </label>
            ))}
          </div>
          <div className="flex items-center gap-3 max-w-xs">
            <input type="time" className={input} value={b.opens} onChange={(e) => setBusiness({ opens: e.target.value })} />
            <span className="text-muted-foreground">to</span>
            <input type="time" className={input} value={b.closes} onChange={(e) => setBusiness({ closes: e.target.value })} />
          </div>
          <p className="text-xs text-muted-foreground">Pick days plus open and close times, or leave all empty to keep Mon-Sat 11:00-20:00.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Official profiles <span className="text-xs font-normal text-muted-foreground ml-1">(one https:// URL per line: Google Business Profile, Facebook, Instagram, YouTube, LinkedIn)</span></label>
          <textarea rows={4} className={input} value={sameAsText} onChange={(e) => setSameAsText(e.target.value)} placeholder="https://www.instagram.com/..." />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-60">
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save AEO &amp; GEO
        </button>
        {message && <span className="text-sm text-muted-foreground">{message}</span>}
      </div>
    </form>
  );
}
