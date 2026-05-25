import React, { useMemo } from 'react';
import { startOfWeek, addDays, ymd } from '../storage.js';

export default function WeekStrip({ selected, onSelect }) {
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
        return (
          <button key={key} onClick={() => onSelect(key)}
            className="pressable flex flex-col items-center gap-1.5 flex-1 py-1.5">
            <span className={'text-[10px] tracking-[0.16em] uppercase font-semibold ' + (isSel ? 'text-white' : 'text-white/55')}>{letters[i]}</span>
            <span className={
              'num w-9 h-9 flex items-center justify-center rounded-full text-[13px] font-bold transition ' +
              (isSel
                ? 'text-white shadow-lg shadow-violet/40'
                : isToday
                  ? 'text-white ring-2 ring-violet/60'
                  : 'text-white/75 bg-white/5 hover:bg-white/10')
            }
            style={isSel ? { background: 'linear-gradient(135deg, #a78bfa, #ec4899)' } : undefined}>
              {d.getDate()}
            </span>
          </button>
        );
      })}
    </div>
  );
}
