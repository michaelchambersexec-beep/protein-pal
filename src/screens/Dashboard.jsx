import React, { useEffect, useMemo, useRef, useState } from 'react';
import ProgressRing from '../components/ProgressRing.jsx';
import WeekStrip from '../components/WeekStrip.jsx';
import EntryRow from '../components/EntryRow.jsx';
import AddProteinModal from '../components/AddProteinModal.jsx';
import Character, { getStage } from '../components/Character.jsx';
import { Plus, Flame, Gear } from '../icons.jsx';
import { dayTotal, computeStreak, ymd, parseYmd, monthLabel } from '../storage.js';

export default function Dashboard({ state, update, onOpenSettings, storageWarning }) {
  const [selected, setSelected] = useState(ymd());
  const [modal, setModal] = useState(false);
  const entries = state.entries[selected] || [];
  const total = useMemo(() => dayTotal(state, selected), [state, selected]);
  const streak = useMemo(() => computeStreak(state), [state]);
  const selectedDate = parseYmd(selected);
  const isToday = selected === ymd();
  const goal = state.goal || 0;
  const pct = goal > 0 ? total / goal : 0;
  const stage = getStage(pct);

  const goalUnset = goal <= 0;

  // ----- Pop animations -----
  const [pops, setPops] = useState([]); // {id, value}
  const [confettiKey, setConfettiKey] = useState(null);
  const prevTotalRef = useRef(total);
  const prevHitRef = useRef(goal > 0 && total >= goal);
  const prevStageRef = useRef(stage);

  useEffect(() => {
    const diff = total - prevTotalRef.current;
    if (diff > 0) {
      const id = Date.now() + Math.random();
      setPops((p) => [...p, { id, value: diff }]);
      setTimeout(() => setPops((p) => p.filter((x) => x.id !== id)), 1200);
    }
    const hit = goal > 0 && total >= goal;
    if (hit && !prevHitRef.current) {
      setConfettiKey(Date.now());
      setTimeout(() => setConfettiKey(null), 1700);
    }
    prevTotalRef.current = total;
    prevHitRef.current = hit;
  }, [total, goal]);

  // celebrate stage-up too (smaller)
  useEffect(() => {
    if (stage > prevStageRef.current) {
      const id = Date.now() + Math.random();
      setPops((p) => [...p, { id, value: '+1 LVL', isLvl: true }]);
      setTimeout(() => setPops((p) => p.filter((x) => x.id !== id)), 1400);
    }
    prevStageRef.current = stage;
  }, [stage]);

  const removeEntry = (id) => update((s) => {
    const list = (s.entries[selected] || []).filter((e) => e.id !== id);
    const nextEntries = { ...s.entries, [selected]: list };
    if (list.length === 0) delete nextEntries[selected];
    return { ...s, entries: nextEntries };
  });

  return (
    <div className="flex flex-col h-full pb-32 relative">
      {confettiKey && <Confetti seed={confettiKey} />}
      {confettiKey && <div className="goal-glow" />}

      {storageWarning && (
        <div className="mx-4 mt-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs rounded-lg px-3 py-2">
          Storage unavailable. Data will only persist in memory for this session.
        </div>
      )}

      <header className="flex items-center justify-between px-5 pt-5 pb-2">
        <div>
          <div className="text-xs text-muted uppercase tracking-wider">{isToday ? 'Today' : selectedDate.toLocaleDateString(undefined, { weekday: 'long' })}</div>
          <h1 className="text-2xl font-semibold">{monthLabel(selectedDate)}</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className={'flex items-center gap-1 rounded-full px-3 py-1.5 transition ' + (streak > 0 ? 'bg-orange-500/15 border border-orange-400/30' : 'bg-card')}>
            <Flame size={16} className={streak > 0 ? 'text-orange-400' : 'text-muted'} />
            <span className={'text-sm font-semibold ' + (streak > 0 ? 'text-orange-300' : '')}>{streak}</span>
          </div>
          <button onClick={onOpenSettings} className="text-muted p-1 pressable"><Gear /></button>
        </div>
      </header>

      <div className="px-3 mt-1">
        <WeekStrip selected={selected} onSelect={setSelected} />
      </div>

      {/* Character */}
      <div className="flex justify-center mt-3">
        <Character pct={pct} />
      </div>

      {/* Ring + floating pops */}
      <div className="relative flex justify-center mt-3 animate-pop">
        <ProgressRing
          value={total}
          goal={goal}
          onGoalChange={(g) => update({ goal: g })}
        />
        <div className="absolute top-0 left-1/2 w-0 h-0">
          {pops.map((p) => (
            <div key={p.id} className="float-pop"
                 style={{ fontSize: p.isLvl ? 14 : 24, color: p.isLvl ? '#fbbf24' : '#5b8dee' }}>
              {p.isLvl ? p.value : `+${p.value}g`}
            </div>
          ))}
        </div>
      </div>

      {goalUnset && (
        <div className="mx-5 mt-4 bg-accent/10 border border-accent/30 rounded-xl px-4 py-3 text-sm">
          <div className="font-medium mb-1">Set your daily goal</div>
          <div className="text-muted text-xs mb-2">Tap the pencil under the ring, or open Settings for a bodyweight calculator.</div>
          <button onClick={onOpenSettings} className="text-accent text-xs font-medium pressable">Open Settings →</button>
        </div>
      )}

      <div className="px-5 mt-6 flex-1">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">Entries</h2>
          <span className="text-xs text-muted">{entries.length}</span>
        </div>
        {entries.length === 0 ? (
          <div className="bg-card rounded-2xl text-center py-10 px-4">
            <div className="text-3xl mb-2">💪</div>
            <div className="text-sm font-medium">Nothing logged yet</div>
            <div className="text-xs text-muted mt-1">Tap the + to feed your buddy.</div>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.slice().reverse().map((e) => (
              <EntryRow key={e.id} entry={e} onDelete={() => removeEntry(e.id)} />
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => setModal(true)}
        className="pressable fixed bottom-24 right-1/2 translate-x-[185px] bg-accent text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl shadow-accent/40 active:scale-90"
        aria-label="Add protein"
      >
        <Plus size={26} />
      </button>

      <AddProteinModal
        open={modal}
        onClose={() => setModal(false)}
        state={state}
        update={update}
        dateStr={selected}
      />
    </div>
  );
}

function Confetti({ seed }) {
  const colors = ['#5b8dee', '#fbbf24', '#86efac', '#a78bfa', '#fb923c', '#f472b6'];
  // generate 24 pieces with random trajectories
  const pieces = useMemo(() => Array.from({ length: 24 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 24 + Math.random() * 0.4;
    const dist = 110 + Math.random() * 70;
    return {
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist - 30, // drift up
      bg: colors[i % colors.length],
      delay: Math.random() * 80,
    };
  }), [seed]); // eslint-disable-line
  return (
    <div className="absolute inset-x-0 top-44 h-0 z-30 pointer-events-none flex justify-center">
      <div className="relative">
        {pieces.map((p, i) => (
          <span key={i} className="confetti-piece"
                style={{
                  background: p.bg,
                  ['--dx']: `${p.dx}px`,
                  ['--dy']: `${p.dy}px`,
                  animationDelay: `${p.delay}ms`,
                }}/>
        ))}
      </div>
    </div>
  );
}
