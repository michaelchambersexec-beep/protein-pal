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
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"  stopColor="#fde047"/>
            <stop offset="50%" stopColor="#fb7185"/>
            <stop offset="100%" stopColor="#a78bfa"/>
          </linearGradient>
          <linearGradient id="ringGradHit" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"  stopColor="#86efac"/>
            <stop offset="100%" stopColor="#34d399"/>
          </linearGradient>
        </defs>
        {/* track */}
        <circle cx={size/2} cy={size/2} r={r}
          stroke="rgba(255,255,255,0.14)" strokeWidth={stroke} fill="none"/>
        {/* progress */}
        <circle
          className="ring-progress"
          cx={size/2} cy={size/2} r={r}
          stroke={hit ? 'url(#ringGradHit)' : 'url(#ringGrad)'}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={dashoffset}
          style={{ filter: `drop-shadow(0 0 14px ${hit ? 'rgba(134,239,172,0.5)' : 'rgba(251,113,133,0.4)'})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <div className="num text-[60px] leading-none font-extrabold tracking-tight">
          {Math.round(value)}
          <span className="text-base font-medium opacity-70 ml-1">g</span>
        </div>
        {editing ? (
          <div className="mt-2 flex items-center gap-1.5">
            <span className="text-white/70 text-xs">of</span>
            <input autoFocus type="number" inputMode="numeric" value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false); }}
              className="num w-16 bg-white/15 backdrop-blur rounded px-2 py-0.5 text-xs text-center text-white"/>
            <button onClick={save} className="text-white"><Check size={16}/></button>
            <button onClick={() => setEditing(false)} className="text-white/70"><X size={16}/></button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="mt-1.5 flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition">
            <span className="num">of {goal || 0}g</span>
            <Pencil size={12}/>
          </button>
        )}
        <div className="num mt-1 text-[10px] tracking-[0.18em] uppercase text-white/70 font-semibold">
          {goal > 0 ? Math.round(pct * 100) : 0}%
        </div>
      </div>
    </div>
  );
}
