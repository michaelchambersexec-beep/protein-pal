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
        className="w-full max-w-app mx-auto bg-bg rounded-t-[28px] animate-slideUp flex flex-col border-t border-line"
        style={{ height: '92vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-2.5 pb-1">
          <div className="w-9 h-1 rounded-full bg-ink4"/>
        </div>
        <div className="flex items-center justify-between px-6 pt-2 pb-4">
          <div>
            <div className="eyebrow">configure</div>
            <h2 className="text-[20px] font-semibold tracking-tight">Settings</h2>
          </div>
          <button onClick={onClose}
            className="pressable w-9 h-9 rounded-full border border-line flex items-center justify-center text-ink2">
            <X size={16}/>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-10 no-scrollbar">
          <Section title="daily goal">
            <div className="flex items-center gap-3 border-b border-line py-3">
              <input type="number" inputMode="numeric" value={goalDraft}
                onChange={(e) => {
                  setGoalDraft(e.target.value);
                  const n = parseInt(e.target.value, 10);
                  if (!Number.isNaN(n) && n >= 0) update({ goal: n });
                }}
                placeholder="e.g. 170"
                className="num flex-1 bg-transparent text-[18px] font-semibold tracking-tight placeholder:text-ink3 placeholder:font-normal"
              />
              <span className="num text-ink3 text-[12px]">grams/day</span>
            </div>
          </Section>

          <Section title="from bodyweight">
            <div className="space-y-4 pb-5 border-b border-line">
              <div className="flex items-center gap-3 pt-3">
                <input type="number" inputMode="decimal" value={weight}
                  onChange={(e) => onWeightChange(e.target.value)}
                  placeholder="Weight"
                  className="num flex-1 bg-raised rounded-md px-3 py-2.5 text-[14px] placeholder:text-ink3"/>
                <span className="num text-ink3 text-[12px]">lbs</span>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-ink3 mb-1.5">
                  <span className="eyebrow">multiplier</span>
                  <span className="num text-ink2">{mult.toFixed(2)} g/lb</span>
                </div>
                <input type="range" min={0.6} max={1.2} step={0.05} value={mult}
                  onChange={(e) => onMultChange(e.target.value)}
                  className="w-full accent-ink"/>
                <div className="num flex justify-between text-[10px] text-ink3 mt-1">
                  <span>0.6</span><span>0.8</span><span>1.0</span><span>1.2</span>
                </div>
              </div>
              {weight && !Number.isNaN(parseFloat(weight)) && (
                <div className="text-[12px] text-ink3">
                  → suggested goal <span className="num text-ink font-medium">{Math.round(parseFloat(weight) * mult)}g</span>/day
                </div>
              )}
            </div>
          </Section>

          <Section title="display name">
            <input value={name}
              onChange={(e) => { setName(e.target.value); update({ displayName: e.target.value }); }}
              placeholder="Your name"
              className="w-full bg-transparent border-b border-line py-3 text-[14px] placeholder:text-ink3"/>
          </Section>

          <Section title="quick add fields">
            <label className="flex items-center justify-between py-3.5 border-b border-line">
              <span className="text-[13px]">Show optional carbs & fat</span>
              <Toggle on={state.showMacros} onChange={(v) => update({ showMacros: v })} />
            </label>
          </Section>

          <Section title="data">
            <button onClick={exportJson} className="w-full text-left py-3.5 border-b border-line text-[13px] text-ink hover:text-ink2 transition">
              Export all data as JSON
            </button>
            <button onClick={resetToday} className="w-full text-left py-3.5 border-b border-line text-[13px] text-danger hover:opacity-80 transition">
              Reset today's entries
            </button>
          </Section>

          <div className="num text-center text-[10px] text-ink3 tracking-[0.16em] uppercase pt-8">
            Protein Pal · v{APP_VERSION}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="pt-7 first:pt-2">
      <div className="eyebrow mb-1">{title}</div>
      {children}
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)}
      className={'w-10 h-6 rounded-full transition relative border ' + (on ? 'bg-ink border-ink' : 'bg-transparent border-line')}>
      <span className={'absolute top-0.5 w-4 h-4 rounded-full transition-all ' +
        (on ? 'left-[18px] bg-bg' : 'left-1 bg-ink2')}/>
    </button>
  );
}
