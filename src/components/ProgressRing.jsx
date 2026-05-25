import React, { useEffect, useState } from 'react';
import { Pencil, Check, X } from '../icons.jsx';

export default function ProgressRing({ value, goal, onGoalChange, stage = 0, stageName = '' }) {
  const size = 300;
  const stroke = 18;
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
        <circle cx={size/2} cy={size/2} r={r}
          stroke="rgba(255,255,255,0.14)" strokeWidth={stroke} fill="none"/>
        <circle
          className="ring-progress"
          cx={size/2} cy={size/2} r={r}
          stroke={hit ? 'url(#ringGradHit)' : 'url(#ringGrad)'}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={dashoffset}
          style={{ filter: `drop-shadow(0 0 20px ${hit ? 'rgba(134,239,172,0.55)' : 'rgba(251,113,133,0.45)'})` }}
        />
      </svg>

      {/* Inside-the-ring typography */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6">
        <div className="px-2.5 py-0.5 rounded-md bg-black/30 backdrop-blur text-[10px] tracking-[0.22em] font-bold num">
          LV {String(stage + 1).padStart(2, '0')}
        </div>

        <div className="num text-[88px] leading-[0.9] font-black tracking-tight mt-3">
          {Math.round(value)}
          <span className="text-[26px] font-bold opacity-70 ml-1 align-top">g</span>
        </div>

        <div className="text-[18px] font-extrabold tracking-[0.08em] uppercase mt-1 text-center"
             style={{ textShadow: '0 2px 14px rgba(0,0,0,0.35)' }}>
          {stageName}
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
          <button onClick={() => setEditing(true)} className="mt-2 flex items-center gap-1.5 text-[12px] text-white/85 hover:text-white transition num">
            <span>of {goal || 0}g · {goal > 0 ? Math.round(pct * 100) : 0}%</span>
            <Pencil size={12}/>
          </button>
        )}
      </div>
    </div>
  );
}
