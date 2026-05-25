import React, { useEffect, useState } from 'react';
import { X } from '../icons.jsx';
import { ymd } from '../storage.js';

const APP_VERSION = '1.0.0';

export default function Settings({ open, onClose, state, update }) {
  const [goalDraft, setGoalDraft] = useState(String(state.goal || ''));
  const [name, setName] = useState(state.displayName || '');
  const [weight, setWeight] = useState(state.weightLbs != null ? String(state.weightLbs) : '');
  const [mult, setMult] = useState(state.goalMultiplier || 0.8);

  useEffect(() => { setGoalDraft(String(state.goal || '')); }, [state.goal]);
  useEffect(() => { setName(state.displayName || ''); }, [state.displayName]);


  const saveGoal = () => {
    const n = parseInt(goalDraft, 10);
    if (!Number.isNaN(n) && n >= 0) update({ goal: n });
  };

  const onWeightChange = (val) => {
    setWeight(val);
    const w = parseFloat(val);
    if (!Number.isNaN(w) && w > 0) {
      const g = Math.round(w * mult);
      update({ weightLbs: w, goalMultiplier: mult, goal: g });
      setGoalDraft(String(g));
    }
  };
  const onMultChange = (val) => {
    const m = parseFloat(val);
    setMult(m);
    const w = parseFloat(weight);
    if (!Number.isNaN(w) && w > 0) {
      const g = Math.round(w * m);
      update({ weightLbs: w, goalMultiplier: m, goal: g });
      setGoalDraft(String(g));
    } else {
      update({ goalMultiplier: m });
    }
  };

  const resetToday = () => {
    if (!confirm("Reset today's entries?")) return;
    update((s) => {
      const next = { ...s.entries };
      delete next[ymd()];
      return { ...s, entries: next };
    });
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `protein-pal-${ymd()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop flex items-end" onClick={onClose}>
      <div
        className="w-full max-w-app mx-auto bg-bg rounded-t-3xl border-t border-card2 animate-slideUp flex flex-col"
        style={{ height: '92vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button onClick={onClose} className="text-muted p-1"><X /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-8 space-y-5 no-scrollbar">
          <Section title="Daily protein goal">
            <div className="flex items-center gap-2">
              <input type="number" inputMode="numeric" value={goalDraft}
                onChange={(e) => {
                  setGoalDraft(e.target.value);
                  const n = parseInt(e.target.value, 10);
                  if (!Number.isNaN(n) && n >= 0) update({ goal: n });
                }}
                className="flex-1 bg-card rounded-lg px-3 py-2.5 text-sm" placeholder="e.g. 170"
              />
              <span className="text-muted text-sm">g/day</span>
            </div>
          </Section>

          <Section title="Or calculate from bodyweight">
            <div className="bg-card rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <input type="number" inputMode="decimal" value={weight}
                  onChange={(e) => onWeightChange(e.target.value)}
                  placeholder="Bodyweight"
                  className="flex-1 bg-card2 rounded-lg px-3 py-2 text-sm" />
                <span className="text-muted text-sm">lbs</span>
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted mb-1">
                  <span>Multiplier</span>
                  <span className="tabular-nums">{mult.toFixed(2)}g per lb</span>
                </div>
                <input type="range" min={0.6} max={1.2} step={0.05} value={mult}
                  onChange={(e) => onMultChange(e.target.value)}
                  className="w-full accent-accent" />
                <div className="flex justify-between text-[10px] text-muted mt-0.5">
                  <span>0.6</span><span>0.8</span><span>1.0</span><span>1.2</span>
                </div>
              </div>
              {weight && !Number.isNaN(parseFloat(weight)) && (
                <div className="text-xs text-muted">Suggested goal: <span className="text-white font-medium">{Math.round(parseFloat(weight) * mult)}g</span> per day</div>
              )}
            </div>
          </Section>

          <Section title="Display name">
            <input value={name}
              onChange={(e) => { setName(e.target.value); update({ displayName: e.target.value }); }}
              placeholder="Your name"
              className="w-full bg-card rounded-lg px-3 py-2.5 text-sm" />
          </Section>

          <Section title="Quick Add fields">
            <label className="flex items-center justify-between bg-card rounded-xl px-4 py-3">
              <span className="text-sm">Show optional carbs & fat</span>
              <Toggle on={state.showMacros} onChange={(v) => update({ showMacros: v })} />
            </label>
          </Section>

          <Section title="Data">
            <div className="space-y-2">
              <button onClick={exportJson} className="w-full bg-card rounded-xl px-4 py-3 text-sm text-left">Export all data as JSON</button>
              <button onClick={resetToday} className="w-full bg-card rounded-xl px-4 py-3 text-sm text-left text-red-400">Reset today's entries</button>
            </div>
          </Section>

          <div className="text-center text-xs text-muted pt-4">Protein Pal v{APP_VERSION}</div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted mb-2">{title}</div>
      {children}
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)}
      className={'w-11 h-6 rounded-full transition relative ' + (on ? 'bg-accent' : 'bg-card2')}>
      <span className={'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ' + (on ? 'left-5' : 'left-0.5')}/>
    </button>
  );
}
