import React, { useMemo } from 'react';
import { startOfWeek, addDays, ymd } from '../storage.js';

export default function WeekStrip({ selected, onSelect }) {
  const start = useMemo(() => startOfWeek(new Date(selected + 'T00:00:00')), [selected]);
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(start, i)), [start]);
  const today = ymd();

  return (
    <div className="flex justify-between gap-1 px-1">
      {days.map((d) => {
        const key = ymd(d);
        const isSel = key === selected;
        const isToday = key === today;
        const letters = ['M','T','W','T','F','S','S'];
        const dayIdx = (d.getDay() + 6) % 7;
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className="flex flex-col items-center gap-1.5 flex-1 py-1"
          >
            <span className="text-[11px] text-muted">{letters[dayIdx]}</span>
            <span className={
              'w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition ' +
              (isSel ? 'bg-accent text-white' : isToday ? 'border border-accent/60 text-white' : 'text-white/80 hover:bg-card')
            }>{d.getDate()}</span>
          </button>
        );
      })}
    </div>
  );
}
