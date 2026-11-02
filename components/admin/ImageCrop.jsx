"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Crop, X, Check, Loader2 } from 'lucide-react';
import clsx from 'clsx';

const MIN = 24; // smallest crop edge, in image pixels
const MAX_EDGE = 2400; // longest edge of the exported image
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const RATIOS = [
  { id: 'free', label: 'Free', value: null },
  { id: 'orig', label: 'Original', value: 'orig' },
  { id: '16:9', label: '16:9', value: 16 / 9 },
  { id: '4:3', label: '4:3', value: 4 / 3 },
  { id: '1:1', label: '1:1', value: 1 },
  { id: '3:4', label: '3:4', value: 3 / 4 },
];

const HANDLES = [
  { id: 'nw', cls: 'left-0 top-0 cursor-nwse-resize', corner: true },
  { id: 'n', cls: 'left-1/2 top-0 cursor-ns-resize' },
  { id: 'ne', cls: 'left-full top-0 cursor-nesw-resize', corner: true },
  { id: 'e', cls: 'left-full top-1/2 cursor-ew-resize' },
  { id: 'se', cls: 'left-full top-full cursor-nwse-resize', corner: true },
  { id: 's', cls: 'left-1/2 top-full cursor-ns-resize' },
  { id: 'sw', cls: 'left-0 top-full cursor-nesw-resize', corner: true },
  { id: 'w', cls: 'left-0 top-1/2 cursor-ew-resize' },
];

// largest centred rectangle of the given ratio that fits inside the image
const fit = (nw, nh, ratio) => {
  let w = nw, h = nw / ratio;
  if (h > nh) { h = nh; w = nh * ratio; }
  return { x: (nw - w) / 2, y: (nh - h) / 2, w, h };
};

/** Full-screen cropper. `src` must be same-origin or a blob: URL so the canvas can export it. */
export function ImageCropModal({ src, name = 'image', onCancel, onDone }) {
  const area = useRef(null);
  const imgRef = useRef(null);
  const drag = useRef(null);
  const [nat, setNat] = useState(null); // natural size
  const [box, setBox] = useState({ w: 0, h: 0 }); // available area
  const [ratioId, setRatioId] = useState('free');
  const [crop, setCrop] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const ratioOf = useCallback((id, n = nat) => {
    const r = RATIOS.find((x) => x.id === id)?.value;
    return r === 'orig' ? (n ? n.w / n.h : null) : r;
  }, [nat]);

  useEffect(() => {
    const el = area.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBox({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setBox({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onCancel]);

  const onLoad = (e) => {
    const n = { w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight };
    setNat(n);
    setCrop({ x: 0, y: 0, w: n.w, h: n.h });
  };

  const pickRatio = (id) => {
    setRatioId(id);
    const r = ratioOf(id);
    if (r && nat) setCrop(fit(nat.w, nat.h, r));
  };

  // displayed size of the image (contain) and its scale from natural pixels
  const scale = nat && box.w ? Math.min((box.w - 32) / nat.w, (box.h - 32) / nat.h, 1) : 0;
  const shown = nat ? { w: nat.w * scale, h: nat.h * scale } : { w: 0, h: 0 };

  const toNatural = (e) => {
    const r = imgRef.current.getBoundingClientRect();
    return { x: clamp((e.clientX - r.left) / scale, 0, nat.w), y: clamp((e.clientY - r.top) / scale, 0, nat.h) };
  };

  const start = (mode, e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { mode, from: toNatural(e), crop };
  };

  const move = (e) => {
    const d = drag.current;
    if (!d) return;
    const p = toNatural(e);
    const c = d.crop;
    if (d.mode === 'move') {
      setCrop({ ...c, x: clamp(c.x + p.x - d.from.x, 0, nat.w - c.w), y: clamp(c.y + p.y - d.from.y, 0, nat.h - c.h) });
      return;
    }
    const ratio = ratioOf(ratioId);
    const m = d.mode;
    if (ratio) {
      // aspect locked: resize from the opposite corner
      const dx = m.includes('e') ? 1 : -1;
      const dy = m.includes('s') ? 1 : -1;
      const ax = dx > 0 ? c.x : c.x + c.w;
      const ay = dy > 0 ? c.y : c.y + c.h;
      const maxW = dx > 0 ? nat.w - ax : ax;
      const maxH = dy > 0 ? nat.h - ay : ay;
      let w = clamp(dx * (p.x - ax), MIN, maxW);
      let h = w / ratio;
      if (h > maxH) { h = maxH; w = h * ratio; }
      setCrop({ x: dx > 0 ? ax : ax - w, y: dy > 0 ? ay : ay - h, w, h });
      return;
    }
    let left = c.x, right = c.x + c.w, top = c.y, bottom = c.y + c.h;
    if (m.includes('w')) left = clamp(p.x, 0, right - MIN);
    if (m.includes('e')) right = clamp(p.x, left + MIN, nat.w);
    if (m.includes('n')) top = clamp(p.y, 0, bottom - MIN);
    if (m.includes('s')) bottom = clamp(p.y, top + MIN, nat.h);
    setCrop({ x: left, y: top, w: right - left, h: bottom - top });
  };

  const end = () => { drag.current = null; };

  const apply = async () => {
    if (!crop || busy) return;
    setBusy(true);
    setError('');
    try {
      const k = Math.min(1, MAX_EDGE / Math.max(crop.w, crop.h));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(crop.w * k);
      canvas.height = Math.round(crop.h * k);
      canvas.getContext('2d').drawImage(imgRef.current, crop.x, crop.y, crop.w, crop.h, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.9));
      if (!blob) throw new Error('export failed');
      const base = String(name).replace(/\.[^.]+$/, '').replace(/-cropped$/, '');
      onDone(new File([blob], `${base}-cropped.webp`, { type: 'image/webp' }));
    } catch {
      setError('Could not crop this image. Try uploading the file again.');
      setBusy(false);
    }
  };

  const locked = Boolean(ratioOf(ratioId));
  const pill = 'inline-flex h-9 items-center rounded-full px-4 text-sm font-medium transition-colors';

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/90 text-white" role="dialog" aria-modal="true" aria-label="Crop image">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex flex-wrap items-center gap-1.5" role="radiogroup" aria-label="Aspect ratio">
          {RATIOS.map((r) => (
            <button
              key={r.id}
              type="button"
              role="radio"
              aria-checked={ratioId === r.id}
              onClick={() => pickRatio(r.id)}
              className={clsx(pill, 'h-8 px-3.5 text-xs', ratioId === r.id ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20')}
            >
              {r.label}
            </button>
          ))}
        </div>
        <button type="button" onClick={onCancel} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/15" aria-label="Cancel"><X size={20} /></button>
      </div>

      <div ref={area} className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        <div className="relative" style={{ width: shown.w, height: shown.h }} onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={imgRef} src={src} alt="" onLoad={onLoad} onError={() => setError('This image could not be loaded for cropping.')} draggable={false} className="block h-full w-full select-none" style={!nat ? { width: 1, height: 1, opacity: 0 } : undefined} />
          {nat && crop && (
            <div
              className="absolute touch-none cursor-move border border-white"
              style={{ left: crop.x * scale, top: crop.y * scale, width: crop.w * scale, height: crop.h * scale, boxShadow: '0 0 0 9999px rgba(0,0,0,0.62)' }}
              onPointerDown={(e) => start('move', e)}
            >
              {/* rule-of-thirds guides */}
              <span className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, transparent 33.2%, rgba(255,255,255,.35) 33.3%, transparent 33.5%, transparent 66.5%, rgba(255,255,255,.35) 66.6%, transparent 66.8%), linear-gradient(to bottom, transparent 33.2%, rgba(255,255,255,.35) 33.3%, transparent 33.5%, transparent 66.5%, rgba(255,255,255,.35) 66.6%, transparent 66.8%)' }} />
              {HANDLES.filter((h) => !locked || h.corner).map((h) => (
                <span
                  key={h.id}
                  onPointerDown={(e) => start(h.id, e)}
                  className={clsx('absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 touch-none rounded-full border-2 border-black bg-white', h.cls)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 px-4 pb-5 pt-3">
        <p className="text-sm tabular-nums text-white/70" aria-live="polite">
          {error ? <span className="text-red-400">{error}</span> : crop ? `${Math.round(crop.w)} × ${Math.round(crop.h)} px` : 'Loading…'}
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={onCancel} className={clsx(pill, 'bg-white/10 hover:bg-white/20')}>Cancel</button>
          <button type="button" onClick={apply} disabled={!crop || busy} className={clsx(pill, 'gap-1.5 bg-white text-black hover:bg-white/90 disabled:opacity-50')}>
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Apply crop
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/**
 * "Crop" pill to lay over an image corner (parent must be `relative`).
 * `src` can be a saved image URL or a blob: URL. `onCrop(file)` receives the cropped WebP File.
 */
export default function ImageCropButton({ src, name, onCrop, className }) {
  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const open = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFailed(false);
    if (src.startsWith('blob:') || src.startsWith('data:')) { setSource({ url: src, own: false }); return; }
    setLoading(true);
    try {
      // Load the image as a blob so the canvas is not tainted by a cross-origin image.
      // If the image host blocks that, go through our own image optimizer (same origin, up to 2560px wide).
      let res = await fetch(src, { mode: 'cors' }).catch(() => null);
      if (!res || !res.ok) res = await fetch(`/_next/image?url=${encodeURIComponent(src)}&w=2560&q=80`);
      if (!res.ok) throw new Error();
      setSource({ url: URL.createObjectURL(await res.blob()), own: true });
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    if (source?.own) URL.revokeObjectURL(source.url);
    setSource(null);
  };

  if (!src) return null;
  return (
    <>
      <button
        type="button"
        onClick={open}
        disabled={loading}
        className={clsx('absolute z-20 flex h-9 items-center justify-center gap-1.5 rounded-full bg-background px-3.5 text-xs font-medium text-foreground shadow-float transition-colors hover:bg-secondary disabled:opacity-60', className ?? 'left-3 top-3')}
        title={failed ? 'This image could not be loaded for cropping. Upload the file again, then crop.' : 'Crop'}
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Crop size={14} />}
        {failed ? 'Cannot crop' : 'Crop'}
      </button>
      {source && <ImageCropModal src={source.url} name={name} onCancel={close} onDone={(file) => { onCrop(file); close(); }} />}
    </>
  );
}
