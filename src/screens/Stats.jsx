import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, Cell } from 'recharts';
import { ymd, addDays, dayTotal, computeStreak, longestStreak } from '../storage.js';

export default function Stats({ state }) {
  const [range, setRange] = useState(7);

  const data = useMemo(() => {
    const out = [];
    const today = new Date();
    for (let i = range - 1; i >= 0; i--) {
      const d = addDays(today, -i);
      const key = ymd(d);
      out.push({
        date: key,
        label: range === 7
          ? d.toLocaleDateString(undefined, { weekday: 'short' })
          : `${d.getMonth() + 1}/${d.getDate()}`,
        protein: dayTotal(state, key),
      });
    }
    return out;
  }, [state, range]);

  const goal = state.goal || 0;
  const totals = data.map((d) => d.protein);
  const avg = totals.length ? Math.round(totals.reduce((a, b) => a + b, 0) / totals.length) : 0;
  const best = totals.length ? Math.max(...totals) : 0;
  const cur = computeStreak(state);
  const longest = longestStreak(state);

  return (
    <div className="flex flex-col h-full pb-20 px-5 pt-5">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Stats</h1>
        <div className="flex bg-card rounded-full p-1">
          {[7, 30].map((n) => (
            <button key={n} onClick={() => setRange(n)}
              className={'px-3 py-1 text-xs rounded-full transition ' + (range === n ? 'bg-accent text-white' : 'text-muted')}
            >{n}d</button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl p-3 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 6, left: -20, bottom: 0 }}>
            <XAxis dataKey="label" stroke="#666" fontSize={10} tickLine={false} axisLine={false}
              interval={range === 30 ? 4 : 0} />
            <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill: '#ffffff10' }}
              contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#9aa0aa' }}
              formatter={(v) => [`${v}g`, 'Protein']}
            />
            {goal > 0 && (
              <ReferenceLine y={goal} stroke="#5b8dee" strokeDasharray="4 4" strokeOpacity={0.7} ifOverflow="extendDomain" />
            )}
            <Bar dataKey="protein" radius={[6, 6, 0, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={goal > 0 && d.protein >= goal ? '#5b8dee' : '#3a3a3a'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <StatCard label={`${range}-day average`} value={`${avg}g`} />
        <StatCard label="Best day" value={`${best}g`} />
        <StatCard label="Current streak" value={cur} unit="days" />
        <StatCard label="Longest streak" value={longest} unit="days" />
      </div>
    </div>
  );
}

function StatCard({ label, value, unit }) {
  return (
    <div className="bg-card rounded-2xl p-4">
      <div className="text-xs text-muted uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-semibold mt-1 tabular-nums">{value}{unit && <span className="text-sm text-muted font-normal ml-1">{unit}</span>}</div>
    </div>
  );
}
