import React, { useEffect, useState } from 'react';
import { Pencil, Check, X } from '../icons.jsx';

export default function ProgressRing({ value, goal, onGoalChange }) {
  const size = 240;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = goal > 0 ? Math.min(1, value / goal) : 0;
  const [mounted, setMounted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(goal || ''));

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);
  useEffect(() => { setDraft(String(goal || '')); }, [goal]);

  const dashoffset = mounted ? c * (1 - pct) : c;
  const hit = goal > 0 && value >= goal;

  const save = () => {
    const n = parseInt(draft, 10);
    if (!Number.isNaN(n) && n >= 0) onGoalChange(n);
    setEditing(false);
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} stroke="#222" strokeWidth={stroke} fill="none" />
        <circle
          className="ring-progress"
          cx={size/2} cy={size/2} r={r}
          stroke={hit ? '#4ade80' : '#5b8dee'}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={dashoffset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-bold tabular-nums">{Math.round(value)}<span className="text-lg font-medium text-muted">g</span></div>
        {editing ? (
          <div className="mt-1 flex items-center gap-1">
            <span className="text-muted text-sm">of</span>
            <input
              autoFocus
              type="number"
              inputMode="numeric"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false); }}
              className="w-16 bg-card2 rounded px-2 py-0.5 text-sm text-center"
            />
            <button onClick={save} className="text-accent"><Check size={18}/></button>
            <button onClick={() => setEditing(false)} className="text-muted"><X size={18}/></button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="mt-1 flex items-center gap-1 text-sm text-muted hover:text-white transition">
            <span>of {goal || 0}g</span>
            <Pencil size={14} />
          </button>
        )}
        <div className="mt-1 text-xs text-muted">{goal > 0 ? Math.round(pct * 100) : 0}%</div>
      </div>
    </div>
  );
}
