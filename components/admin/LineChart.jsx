"use client";

import React, { useId, useState } from 'react';

/**
 * Dependency-free area/line chart.
 * data: [{ label: string, value: number }]
 */
const W = 640;
const H = 260;
const PAD = { top: 16, right: 16, bottom: 28, left: 36 };

const niceMax = (max) => {
  if (max <= 4) return 4;
  const pow = 10 ** Math.floor(Math.log10(max));
  const n = max / pow;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow;
};

export default function LineChart({ data = [], color = 'var(--admin-accent)', valueLabel = 'Value', secondary = null, secondaryLabel = 'Secondary' }) {
  const gradId = useId().replace(/:/g, '');
  const [hover, setHover] = useState(null);

  if (!data.length) return null;

  const max = niceMax(Math.max(...data.map((d) => d.value), ...(secondary ? secondary.map((d) => d.value) : []), 1));
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const x = (i) => PAD.left + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
  const y = (v) => PAD.top + innerH - (v / max) * innerH;

  const line = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(' ');
  const line2 = secondary
    ? secondary.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(' ')
    : null;
  const area = `${line} L${x(data.length - 1).toFixed(1)},${PAD.top + innerH} L${x(0).toFixed(1)},${PAD.top + innerH} Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t));
  const labelEvery = Math.ceil(data.length / 6);

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - PAD.left) / innerW) * (data.length - 1));
    setHover(Math.max(0, Math.min(data.length - 1, i)));
  };

  const h = hover !== null ? data[hover] : null;

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto block"
        role="img"
        aria-label={`${valueLabel} over time`}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="#e5e7eb" strokeWidth="1" />
            <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#6b7280">{t}</text>
          </g>
        ))}

        <path d={area} fill={`url(#${gradId})`} />
        {line2 && <path d={line2} fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="4 4" strokeLinejoin="round" strokeLinecap="round" />}
        <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {data.map((d, i) => (i % labelEvery === 0 || i === data.length - 1) && (
          <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="#6b7280">{d.label}</text>
        ))}

        {h && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + innerH} stroke="#d1d5db" strokeDasharray="3 3" />
            <circle cx={x(hover)} cy={y(h.value)} r="4" fill="#fff" stroke={color} strokeWidth="2" />
          </g>
        )}
      </svg>

      {h && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg border border-[#e5e7eb] bg-white px-2.5 py-1.5 text-xs shadow-sm"
          style={{ left: `${(x(hover) / W) * 100}%`, top: `${(y(h.value) / H) * 100}%`, marginTop: -10 }}
        >
          <div className="font-medium text-[#111827] tabular">{h.value} {valueLabel.toLowerCase()}</div>
          {secondary && <div className="text-[#6b7280] tabular">{secondary[hover]?.value ?? 0} {secondaryLabel.toLowerCase()}</div>}
          <div className="text-[#6b7280]">{h.label}</div>
        </div>
      )}
    </div>
  );
}
