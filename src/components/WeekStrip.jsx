import React, { useMemo } from 'react';
import { startOfWeek, addDays, ymd, dayTotal } from '../storage.js';

export default function WeekStrip({ selected, onSelect, state, goal }) {
  const start = useMemo(() => startOfWeek(new Date(selected + 'T00:00:00')), [selected]);
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(start, i)), [start]);
  const today = ymd();
  const letters = ['M','T','W','T','F','S','S'];

  return (
    <div className="flex justify-between gap-1 px-1">
      {days.map((d, i) => {
        const key = ymd(d);
        const isSel = key === selected;
        const isToday = key === today;
        const isFuture = key > today;
        const total = dayTotal(state, key);
        const pct = goal > 0 ? Math.min(1, total / goal) : 0;
        const hit = goal > 0 && total >= goal;

        return (
          <button key={key} onClick={() => onSelect(key)}
            className="pressable flex flex-col items-center gap-1.5 flex-1 py-1.5">
            <span className={'text-[10px] tracking-[0.16em] uppercase font-semibold ' +
              (isSel ? 'text-white' : isToday ? 'text-white/90' : 'text-white/55')}>
              {letters[i]}
            </span>
            <DayCell
              num={d.getDate()}
              pct={pct}
              hit={hit}
              isSel={isSel}
              isToday={isToday}
              isFuture={isFuture}
              hasData={total > 0}
            />
          </button>
        );
      })}
    </div>
  );
}

function DayCell({ num, pct, hit, isSel, isToday, isFuture, hasData }) {
  const size = 40;
  const stroke = 2.5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct);

  // Background fill state
  const bgClass = hit
    ? 'text-white'                              // hit: solid gradient fill
    : isSel
      ? 'text-white'                            // selected: gradient fill
      : isToday
        ? 'text-white'                          // today: subtle
        : isFuture
          ? 'text-white/30'                     // future: muted
          : 'text-white/75';                    // past, no hit

  const bgStyle = (hit || isSel)
    ? { background: 'linear-gradient(135deg, #a78bfa, #ec4899)' }
    : isToday
      ? { background: 'rgba(255,255,255,0.06)' }
      : { background: 'rgba(255,255,255,0.04)' };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* SVG ring overlay showing % of goal for that day */}
      {!isFuture && pct > 0 && !hit && (
        <svg width={size} height={size} className="absolute inset-0 -rotate-90 pointer-events-none">
          <circle cx={size/2} cy={size/2} r={r}
            stroke="rgba(255,255,255,0.10)" strokeWidth={stroke} fill="none"/>
          <circle cx={size/2} cy={size/2} r={r}
            stroke="url(#dayGrad)" strokeWidth={stroke} fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}/>
          <defs>
            <linearGradient id="dayGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"  stopColor="#fde047"/>
              <stop offset="100%" stopColor="#ec4899"/>
            </linearGradient>
          </defs>
        </svg>
      )}

      {/* Inner day-number disc */}
      <div className={`num absolute inset-[3px] flex items-center justify-center rounded-full text-[13px] font-bold transition ${bgClass}`}
           style={bgStyle}>
        {num}
      </div>

      {/* Tiny checkmark on hit days */}
      {hit && (
        <svg className="absolute -bottom-0.5 -right-0.5" width="14" height="14" viewBox="0 0 14 14">
          <circle cx="7" cy="7" r="7" fill="#22c55e"/>
          <path d="M4 7 L6 9 L10 5" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  );
}
