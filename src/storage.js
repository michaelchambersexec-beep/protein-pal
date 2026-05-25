import { useEffect, useRef, useState, useCallback } from 'react';

const KEY = 'protein-pal:v1';

export const DEFAULT_STATE = {
  goal: 170,
  weightLbs: null,
  goalMultiplier: 0.8,
  displayName: '',
  showMacros: false,
  entries: {},   // { 'YYYY-MM-DD': [{ id, name, protein, timestamp, isQuickAdd }] }
  myFoods: [],   // [{ id, name, protein }]
  myMeals: [],   // [{ id, name, items: [{ name, protein }] }]
  favorites: [], // [{ id, name, protein }]
};

let memoryStore = null;
let storageAvailable = null;

export function checkStorage() {
  if (storageAvailable !== null) return storageAvailable;
  try {
    const k = '__pp_test__';
    window.localStorage.setItem(k, '1');
    window.localStorage.removeItem(k);
    storageAvailable = true;
  } catch {
    storageAvailable = false;
  }
  return storageAvailable;
}

export function loadState() {
  if (!checkStorage()) {
    return memoryStore ?? { ...DEFAULT_STATE };
  }
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function saveState(state) {
  if (!checkStorage()) {
    memoryStore = state;
    return;
  }
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    memoryStore = state;
  }
}

export function useAppState() {
  const [state, setState] = useState(() => loadState());

  const update = useCallback((mut) => {
    setState((s) => {
      const next = typeof mut === 'function' ? mut(s) : { ...s, ...mut };
      saveState(next);
      return next;
    });
  }, []);

  return [state, update];
}

// ---------- Date helpers (timezone-safe local YYYY-MM-DD) ----------
export function ymd(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
export function parseYmd(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}
export function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
export function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 Sun .. 6 Sat
  const diff = (day + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - diff);
  return d;
}
export function monthLabel(date) {
  return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}
export function shortDayLabel(date) {
  return date.toLocaleDateString(undefined, { weekday: 'short' })[0];
}

export function uid() {
  return 'id-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function dayTotal(state, dateStr) {
  const list = state.entries[dateStr] || [];
  return list.reduce((a, b) => a + (Number(b.protein) || 0), 0);
}

export function computeStreak(state) {
  // consecutive days back from today (inclusive) where total >= goal
  const goal = state.goal || 0;
  if (goal <= 0) return 0;
  let streak = 0;
  let d = new Date();
  for (;;) {
    const key = ymd(d);
    if (dayTotal(state, key) >= goal) {
      streak += 1;
      d = addDays(d, -1);
    } else break;
    if (streak > 999) break;
  }
  return streak;
}

export function longestStreak(state) {
  const goal = state.goal || 0;
  if (goal <= 0) return 0;
  const keys = Object.keys(state.entries).sort();
  if (keys.length === 0) return 0;
  let best = 0, cur = 0, prev = null;
  for (const k of keys) {
    if (dayTotal(state, k) < goal) { cur = 0; prev = k; continue; }
    if (prev) {
      const diff = (parseYmd(k) - parseYmd(prev)) / 86400000;
      if (diff === 1) cur += 1; else cur = 1;
    } else cur = 1;
    if (cur > best) best = cur;
    prev = k;
  }
  return best;
}
