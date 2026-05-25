import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, Cell } from 'recharts';
import { ymd, addDays, dayTotal, computeStreak, longestStreak } from '../storage.js';

const INK   = '#ffffff';
const INK3  = 'rgba(255,255,255,0.55)';
const MUTED = 'rgba(255,255,255,0.15)';
const HIT_GRAD_ID = 'barHitGrad';

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
          ? d.toLocaleDateString(undefined, { weekday: 'short' })[0]
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
  const hitDays = totals.filter((t) => goal > 0 && t >= goal).length;

  return (
    <div className="flex flex-col h-full pb-32 px-6 pt-7" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1.75rem)' }}>
      <header className="flex items-end justify-between">
        <div>
          <div className="eyebrow">summary</div>
          <h1 className="text-[26px] leading-none font-semibold tracking-tight mt-2">Stats</h1>
        </div>
        <div className="flex border border-line rounded-full overflow-hidden">
          {[7, 30].map((n) => (
            <button key={n} onClick={() => setRange(n)}
              className={'num px-3 py-1 text-[11px] tracking-wide transition ' +
                (range === n ? 'bg-ink text-bg' : 'text-ink3')}
            >{n}D</button>
          ))}
        </div>
      </header>

      {/* Hit ratio */}
      <div className="mt-7 flex items-baseline gap-3">
        <div className="num text-[44px] leading-none font-semibold tracking-tight">{hitDays}<span className="text-[18px] text-ink3 font-normal"> / {range}</span></div>
        <div className="text-[12px] text-ink3">days goal hit</div>
      </div>

      {/* Chart */}
      <div className="mt-6 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 12, right: 4, left: -28, bottom: 0 }}>
            <defs>
              <linearGradient id={HIT_GRAD_ID} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"  stopColor="#fde047"/>
                <stop offset="50%" stopColor="#ec4899"/>
                <stop offset="100%" stopColor="#a78bfa"/>
              </linearGradient>
            </defs>
            <XAxis dataKey="label" stroke={INK3} fontSize={10} tickLine={false} axisLine={false}
              interval={range === 30 ? 4 : 0}
              tick={{ fill: INK3 }}/>
            <YAxis stroke={INK3} fontSize={10} tickLine={false} axisLine={false}
              tick={{ fill: INK3 }}/>
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.06)' }}
              contentStyle={{
                background: 'oklch(0.16 0.025 280)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 10, fontSize: 12,
              }}
              labelStyle={{ color: INK3 }}
              itemStyle={{ color: INK, fontWeight: 600 }}
              formatter={(v) => [`${v}g`, 'protein']}
            />
            {goal > 0 && (
              <ReferenceLine y={goal} stroke="#fde047" strokeDasharray="3 4" strokeOpacity={0.7} ifOverflow="extendDomain"/>
            )}
            <Bar dataKey="protein" radius={[6, 6, 0, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={goal > 0 && d.protein >= goal ? `url(#${HIT_GRAD_ID})` : MUTED} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary cards — minimal, borderless rows */}
      <div className="mt-2 border-t border-line">
        <StatRow label="Average" value={`${avg}g`}/>
        <StatRow label="Best day" value={`${best}g`}/>
        <StatRow label="Current streak" value={`${cur}d`}/>
        <StatRow label="Longest streak" value={`${longest}d`}/>
      </div>
    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div className="flex items-baseline justify-between py-3.5 border-b border-line">
      <div className="text-[13px] text-ink2">{label}</div>
      <div className="num text-[20px] font-semibold tracking-tight">{value}</div>
    </div>
  );
}
