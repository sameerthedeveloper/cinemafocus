"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ZoomIn, ZoomOut, Maximize2, X, Search } from 'lucide-react';
import clsx from 'clsx';

const MIN = 1;
const MAX = 8;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/**
 * Full-screen image viewer: scroll or pinch to zoom, drag to pan, double-click to toggle 100%/250%,
 * + / - / 0 keys, Esc to close. Rendered in a portal so parent overflow never clips it.
 */
export function ImageZoomModal({ src, alt = '', onClose }) {
  const stage = useRef(null);
  const pointers = useRef(new Map());
  const gesture = useRef(null);
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  // keep the image from being dragged fully out of the stage
  const bound = useCallback((v) => {
    const el = stage.current;
    if (!el) return v;
    const maxX = (el.clientWidth * (v.scale - 1)) / 2;
    const maxY = (el.clientHeight * (v.scale - 1)) / 2;
    return { scale: v.scale, x: clamp(v.x, -maxX, maxX), y: clamp(v.y, -maxY, maxY) };
  }, []);

  // zoom keeping the point under (cx, cy) fixed; coordinates are relative to the stage centre
  const zoomTo = useCallback((next, cx = 0, cy = 0) => {
    setView((v) => {
      const scale = clamp(next, MIN, MAX);
      if (scale === MIN) return { scale, x: 0, y: 0 };
      const ratio = scale / v.scale;
      return bound({ scale, x: cx - (cx - v.x) * ratio, y: cy - (cy - v.y) * ratio });
    });
  }, [bound]);

  const centre = (e) => {
    const r = stage.current.getBoundingClientRect();
    return { cx: e.clientX - r.left - r.width / 2, cy: e.clientY - r.top - r.height / 2 };
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === '+' || e.key === '=') zoomTo(view.scale * 1.4);
      else if (e.key === '-') zoomTo(view.scale / 1.4);
      else if (e.key === '0') zoomTo(1);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose, zoomTo, view.scale]);

  // wheel needs a non-passive listener so the page behind does not scroll
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const { cx, cy } = centre(e);
      zoomTo(view.scale * Math.exp(-e.deltaY * 0.002), cx, cy);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomTo, view.scale]);

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    gesture.current = { view, start: { x: e.clientX, y: e.clientY }, dist: null };
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current.dist = Math.hypot(a.x - b.x, a.y - b.y);
    }
    setDragging(true);
  };

  const onPointerMove = (e) => {
    if (!pointers.current.has(e.pointerId) || !gesture.current) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    if (pointers.current.size === 2 && g.dist) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const r = stage.current.getBoundingClientRect();
      zoomTo(g.view.scale * (d / g.dist), (a.x + b.x) / 2 - r.left - r.width / 2, (a.y + b.y) / 2 - r.top - r.height / 2);
    } else if (pointers.current.size === 1 && g.view.scale > 1) {
      setView(bound({ scale: g.view.scale, x: g.view.x + e.clientX - g.start.x, y: g.view.y + e.clientY - g.start.y }));
    }
  };

  const onPointerUp = (e) => {
    pointers.current.delete(e.pointerId);
    gesture.current = null;
    if (pointers.current.size === 0) setDragging(false);
  };

  const onDoubleClick = (e) => {
    const { cx, cy } = centre(e);
    zoomTo(view.scale > 1.05 ? 1 : 2.5, cx, cy);
  };

  const btn = 'flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 disabled:opacity-30 disabled:hover:bg-transparent focus-visible:outline-2 focus-visible:outline-white';

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/90" role="dialog" aria-modal="true" aria-label="Image zoom">
      <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 text-white">
        <p className="min-w-0 truncate text-sm text-white/70">{alt}</p>
        <button type="button" onClick={onClose} className={btn} aria-label="Close"><X size={20} /></button>
      </div>

      <div
        ref={stage}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={onDoubleClick}
        className={clsx('relative flex-1 touch-none select-none overflow-hidden', view.scale > 1 ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in')}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="absolute inset-0 m-auto max-h-full max-w-full object-contain will-change-transform"
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`, transition: dragging ? 'none' : 'transform 0.18s cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
      </div>

      <div className="flex shrink-0 justify-center pb-5 pt-3">
        <div className="flex items-center gap-1 rounded-full bg-white/10 p-1 text-white">
          <button type="button" className={btn} onClick={() => zoomTo(view.scale / 1.4)} disabled={view.scale <= MIN} aria-label="Zoom out"><ZoomOut size={18} /></button>
          <button type="button" onClick={() => zoomTo(1)} className="h-10 min-w-16 rounded-full px-3 text-sm font-medium tabular-nums hover:bg-white/15" aria-label="Reset zoom">{Math.round(view.scale * 100)}%</button>
          <button type="button" className={btn} onClick={() => zoomTo(view.scale * 1.4)} disabled={view.scale >= MAX} aria-label="Zoom in"><ZoomIn size={18} /></button>
          <button type="button" className={btn} onClick={() => zoomTo(1)} disabled={view.scale === 1} aria-label="Fit to screen"><Maximize2 size={16} /></button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/**
 * Small round "Zoom" button to lay over an image corner. The parent must be `relative`.
 * Sits above file-input overlays (z-20) and stops the click from reaching them.
 */
export default function ImageZoomButton({ src, alt = '', className, label }) {
  const [open, setOpen] = useState(false);
  if (!src) return null;
  return (
    <>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        className={clsx('absolute z-20 flex h-9 items-center justify-center gap-1.5 rounded-full bg-background text-foreground shadow-float transition-opacity hover:bg-secondary focus-visible:opacity-100', label ? 'px-3.5 text-xs font-medium' : 'w-9', className ?? 'bottom-2 right-2')}
        aria-label="Zoom image"
        title="Zoom"
      >
        <Search size={16} />
        {label}
      </button>
      {open && <ImageZoomModal src={src} alt={alt} onClose={() => setOpen(false)} />}
    </>
  );
}
