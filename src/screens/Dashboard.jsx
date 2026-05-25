import React, { useEffect, useMemo, useRef, useState } from 'react';
import ProgressRing from '../components/ProgressRing.jsx';
import WeekStrip from '../components/WeekStrip.jsx';
import EntryRow from '../components/EntryRow.jsx';
import AddProteinModal from '../components/AddProteinModal.jsx';
import Character, { getStage, STAGES } from '../components/Character.jsx';
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
  const meta = STAGES[stage];
  const remaining = Math.max(0, goal - total);

  const goalUnset = goal <= 0;

  const [pops, setPops] = useState([]);
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
      setTimeout(() => setConfettiKey(null), 1800);
    }
    prevTotalRef.current = total;
    prevHitRef.current = hit;
  }, [total, goal]);

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
    <div className="flex flex-col h-full pb-40 relative">
      {confettiKey && <Confetti seed={confettiKey} />}
      {confettiKey && <div className="goal-glow" />}

      {storageWarning && (
        <div className="mx-5 mt-3 border border-yellow/40 bg-yellow/10 text-yellow text-[12px] rounded-xl px-3 py-2">
          Storage unavailable. Data will only persist in memory.
        </div>
      )}

      {/* Header */}
      <header className="flex items-end justify-between px-5 pt-7 pb-2">
        <div>
          <div className="eyebrow text-white/60">{isToday ? 'today' : selectedDate.toLocaleDateString(undefined, { weekday: 'long' })}</div>
          <h1 className="text-[26px] leading-none font-bold tracking-tight mt-2">{monthLabel(selectedDate)}</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className={'flex items-center gap-1.5 rounded-full px-3 py-1.5 transition ' +
            (streak > 0 ? 'bg-gradient-to-r from-orange to-coral text-white shadow-lg shadow-orange/30' : 'bg-white/8 text-white/60 border border-white/10')}>
            <Flame size={14}/>
            <span className="num text-[12px] font-bold">{streak}</span>
          </div>
          <button onClick={onOpenSettings}
            className="pressable w-10 h-10 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-white/80">
            <Gear size={16}/>
          </button>
        </div>
      </header>

      {/* Week strip */}
      <div className="px-3 mt-4">
        <WeekStrip selected={selected} onSelect={setSelected} />
      </div>

      {/* HERO CARD — character + ring with stage-colored gradient bg */}
      <div className="px-4 mt-5">
        <div className={`${meta.hero} hero-glow rounded-[28px] px-5 pt-6 pb-7 relative overflow-hidden`}>
          {/* decorative blur blobs in the corner */}
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/20 blur-2xl"/>
          <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-black/15 blur-2xl"/>

          <div className="relative flex justify-center">
            <Character pct={pct}/>
          </div>

          <div className="relative flex justify-center mt-2 animate-pop">
            <ProgressRing
              value={total}
              goal={goal}
              onGoalChange={(g) => update({ goal: g })}
            />
            <div className="absolute top-0 left-1/2 w-0 h-0">
              {pops.map((p) => (
                <div key={p.id} className="float-pop"
                     style={{ fontSize: p.isLvl ? 14 : 26, color: p.isLvl ? '#fde047' : '#fff' }}>
                  {p.isLvl ? p.value : `+${p.value}g`}
                </div>
              ))}
            </div>
          </div>

          {!goalUnset && (
            <div className="relative text-center mt-3 text-[13px] text-white/85 font-medium">
              {remaining > 0
                ? <>still need <span className="num font-bold text-white">{remaining}g</span></>
                : <>🎉 goal hit · <span className="num font-bold text-white">+{total - goal}g</span> over</>
              }
            </div>
          )}
        </div>
      </div>

      {goalUnset && (
        <div className="mx-5 mt-4 border border-violet/40 bg-violet/15 rounded-2xl px-4 py-3 text-[13px]">
          <div className="font-semibold">Set your daily goal</div>
          <div className="text-white/70 text-[12px] mt-1">Tap the pencil under the ring, or open Settings.</div>
        </div>
      )}

      {/* Entries */}
      <div className="px-5 mt-6 flex-1">
        <div className="flex items-baseline justify-between mb-2">
          <h2 className="eyebrow">today's entries</h2>
          <span className="num text-[11px] text-white/60">{entries.length}</span>
        </div>
        {entries.length === 0 ? (
          <div className="rounded-2xl bg-white/5 border border-white/10 text-center py-10 px-4">
            <div className="text-[13px] font-semibold">Nothing logged yet</div>
            <div className="text-[12px] text-white/60 mt-1">Tap + to feed your buddy and level up.</div>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10">
            {entries.slice().reverse().map((e) => (
              <EntryRow key={e.id} entry={e} onDelete={() => removeEntry(e.id)} />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setModal(true)}
        className="pressable fixed bottom-24 right-1/2 translate-x-[185px] w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #a78bfa, #ec4899)', boxShadow: '0 12px 36px -8px rgba(168,139,250,0.6)' }}
        aria-label="Add protein"
      >
        <Plus size={26} strokeWidth={2.6}/>
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
  const colors = ['#a78bfa', '#ec4899', '#fde047', '#34d399', '#fb923c', '#60a5fa'];
  const pieces = useMemo(() => Array.from({ length: 28 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 28 + Math.random() * 0.35;
    const dist = 120 + Math.random() * 90;
    return {
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist - 30,
      rot: (Math.random() * 720 - 360) + 'deg',
      bg: colors[i % colors.length],
      delay: Math.random() * 100,
    };
  }), [seed]); // eslint-disable-line
  return (
    <div className="absolute inset-x-0 top-56 h-0 z-30 pointer-events-none flex justify-center">
      <div className="relative">
        {pieces.map((p, i) => (
          <span key={i} className="confetti-piece"
                style={{
                  background: p.bg,
                  ['--dx']: `${p.dx}px`,
                  ['--dy']: `${p.dy}px`,
                  ['--rot']: p.rot,
                  animationDelay: `${p.delay}ms`,
                }}/>
        ))}
      </div>
    </div>
  );
}
