import React, { useMemo, useState } from 'react';
import { X, Search, Camera, Plus, Star, Trash } from '../icons.jsx';
import { FOOD_DATABASE } from '../foodDatabase.js';
import { uid } from '../storage.js';

const TABS = ['Recents', 'Favorites', 'My Foods', 'My Meals'];

export default function AddProteinModal({ open, onClose, state, update, dateStr }) {
  const [tab, setTab] = useState('Recents');
  const [q, setQ] = useState('');
  const [qaName, setQaName] = useState('');
  const [qaProtein, setQaProtein] = useState('');
  const [qaCarbs, setQaCarbs] = useState('');
  const [qaFat, setQaFat] = useState('');
  const [err, setErr] = useState('');

  // Custom food form
  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodProtein, setNewFoodProtein] = useState('');
  // Meal builder
  const [mealName, setMealName] = useState('');
  const [mealItems, setMealItems] = useState([]); // {name, protein}
  const [miName, setMiName] = useState('');
  const [miProtein, setMiProtein] = useState('');

  const addEntry = (name, protein) => {
    const p = Number(protein);
    if (!name || !name.trim()) { setErr('Name required'); return false; }
    if (Number.isNaN(p) || p < 0) { setErr('Protein must be a number'); return false; }
    setErr('');
    update((s) => {
      const list = s.entries[dateStr] ? [...s.entries[dateStr]] : [];
      list.push({ id: uid(), name: name.trim(), protein: Math.round(p), timestamp: new Date().toISOString(), isQuickAdd: true });
      return { ...s, entries: { ...s.entries, [dateStr]: list } };
    });
    onClose?.();
    return true;
  };

  const handleQuickAdd = () => {
    const ok = addEntry(qaName, qaProtein);
    if (ok) { setQaName(''); setQaProtein(''); setQaCarbs(''); setQaFat(''); }
  };

  const recents = useMemo(() => {
    const all = [];
    Object.keys(state.entries).sort().reverse().forEach((d) => {
      state.entries[d].slice().reverse().forEach((e) => all.push(e));
    });
    // unique by name
    const seen = new Set();
    const out = [];
    for (const e of all) {
      const key = e.name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(e);
      if (out.length >= 10) break;
    }
    return out;
  }, [state.entries]);

  const toggleFav = (name, protein) => {
    update((s) => {
      const exists = s.favorites.find((f) => f.name.toLowerCase() === name.toLowerCase());
      if (exists) return { ...s, favorites: s.favorites.filter((f) => f !== exists) };
      return { ...s, favorites: [...s.favorites, { id: uid(), name, protein }] };
    });
  };
  const isFav = (name) => state.favorites.some((f) => f.name.toLowerCase() === name.toLowerCase());

  const filteredDb = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return FOOD_DATABASE.filter((f) => f.name.toLowerCase().includes(term)).slice(0, 30);
  }, [q]);

  if (!open) return null;

  const saveCustomFood = () => {
    const p = Number(newFoodProtein);
    if (!newFoodName.trim() || Number.isNaN(p) || p < 0) return;
    update((s) => ({ ...s, myFoods: [...s.myFoods, { id: uid(), name: newFoodName.trim(), protein: Math.round(p) }] }));
    setNewFoodName(''); setNewFoodProtein('');
  };
  const deleteCustomFood = (id) => update((s) => ({ ...s, myFoods: s.myFoods.filter((f) => f.id !== id) }));

  const addMealItem = () => {
    const p = Number(miProtein);
    if (!miName.trim() || Number.isNaN(p) || p < 0) return;
    setMealItems((m) => [...m, { name: miName.trim(), protein: Math.round(p) }]);
    setMiName(''); setMiProtein('');
  };
  const saveMeal = () => {
    if (!mealName.trim() || mealItems.length === 0) return;
    update((s) => ({ ...s, myMeals: [...s.myMeals, { id: uid(), name: mealName.trim(), items: mealItems }] }));
    setMealName(''); setMealItems([]);
  };
  const logMeal = (meal) => {
    update((s) => {
      const list = s.entries[dateStr] ? [...s.entries[dateStr]] : [];
      meal.items.forEach((it) => list.push({
        id: uid(), name: `${meal.name} – ${it.name}`, protein: Math.round(Number(it.protein) || 0),
        timestamp: new Date().toISOString(), isQuickAdd: false,
      }));
      return { ...s, entries: { ...s.entries, [dateStr]: list } };
    });
    onClose?.();
  };
  const deleteMeal = (id) => update((s) => ({ ...s, myMeals: s.myMeals.filter((m) => m.id !== id) }));

  const Empty = ({ msg }) => (
    <div className="text-center text-muted text-sm py-12 px-4">{msg}</div>
  );

  return (
    <div className="fixed inset-0 z-50 backdrop flex items-end" onClick={onClose}>
      <div
        className="w-full max-w-app mx-auto bg-bg rounded-t-3xl border-t border-card2 animate-slideUp flex flex-col"
        style={{ height: '92vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <h2 className="text-lg font-semibold">Add Protein</h2>
          <button onClick={onClose} className="text-muted p-1"><X /></button>
        </div>

        <div className="px-5">
          <div className="bg-card rounded-xl flex items-center gap-2 px-3 py-2.5">
            <Search size={18} className="text-muted" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search foods"
              className="flex-1 bg-transparent text-sm placeholder:text-muted"
            />
            <Camera size={18} className="text-muted" />
          </div>
        </div>

        {/* Search results */}
        {q.trim() && (
          <div className="px-5 mt-2 max-h-60 overflow-y-auto no-scrollbar">
            {filteredDb.length === 0 ? (
              <div className="text-xs text-muted py-3">No matches in food database</div>
            ) : filteredDb.map((f, i) => (
              <button key={i}
                onClick={() => { addEntry(f.name, f.protein); setQ(''); }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-card text-left"
              >
                <span className="text-sm">{f.name}</span>
                <span className="text-sm text-accent font-medium">{f.protein}g</span>
              </button>
            ))}
          </div>
        )}

        {/* Quick Add */}
        <div className="px-5 mt-3">
          <div className="bg-card rounded-xl p-3">
            <div className="text-xs uppercase tracking-wider text-muted mb-2">Quick Add</div>
            <div className="flex gap-2">
              <input
                value={qaName} onChange={(e) => setQaName(e.target.value)}
                placeholder="Name"
                className="flex-1 bg-card2 rounded-lg px-3 py-2 text-sm placeholder:text-muted"
              />
              <input
                value={qaProtein} onChange={(e) => setQaProtein(e.target.value)}
                placeholder="Protein (g)" inputMode="numeric" type="number"
                className="w-28 bg-card2 rounded-lg px-3 py-2 text-sm placeholder:text-muted"
              />
              <button onClick={handleQuickAdd} className="bg-accent rounded-lg w-10 flex items-center justify-center"><Plus size={20}/></button>
            </div>
            {state.showMacros && (
              <div className="flex gap-2 mt-2">
                <input value={qaCarbs} onChange={(e) => setQaCarbs(e.target.value)} placeholder="Carbs (g)" inputMode="numeric" type="number"
                  className="flex-1 bg-card2 rounded-lg px-3 py-2 text-sm placeholder:text-muted" />
                <input value={qaFat} onChange={(e) => setQaFat(e.target.value)} placeholder="Fat (g)" inputMode="numeric" type="number"
                  className="flex-1 bg-card2 rounded-lg px-3 py-2 text-sm placeholder:text-muted" />
              </div>
            )}
            {err && <div className="text-xs text-danger mt-2">{err}</div>}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-5 mt-4">
          <div className="flex gap-1 bg-card rounded-xl p-1">
            {TABS.map((t) => (
              <button key={t}
                onClick={() => setTab(t)}
                className={'flex-1 text-xs py-1.5 rounded-lg transition ' + (tab === t ? 'bg-accent text-white' : 'text-muted')}
              >{t}</button>
            ))}
          </div>
        </div>

        {/* Tab body */}
        <div className="flex-1 overflow-y-auto px-5 pt-3 pb-5 no-scrollbar">
          <div key={tab} className="tab-fade space-y-2">
            {tab === 'Recents' && (
              recents.length === 0 ? <Empty msg="No recent entries yet. Log something to see it here." /> :
              recents.map((r) => (
                <div key={r.id} className="bg-card rounded-xl flex items-center gap-2 px-3 py-2.5">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{r.name}</div>
                    <div className="text-xs text-muted">{r.protein}g protein</div>
                  </div>
                  <button onClick={() => toggleFav(r.name, r.protein)} className={isFav(r.name) ? 'text-yellow-400' : 'text-muted'}>
                    <Star size={18} fill={isFav(r.name) ? 'currentColor' : 'none'} />
                  </button>
                  <button onClick={() => addEntry(r.name, r.protein)} className="bg-accent rounded-lg w-9 h-9 flex items-center justify-center"><Plus size={18}/></button>
                </div>
              ))
            )}
            {tab === 'Favorites' && (
              state.favorites.length === 0 ? <Empty msg="Tap the star on any recent to save a favorite." /> :
              state.favorites.map((f) => (
                <div key={f.id} className="bg-card rounded-xl flex items-center gap-2 px-3 py-2.5">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{f.name}</div>
                    <div className="text-xs text-muted">{f.protein}g protein</div>
                  </div>
                  <button onClick={() => toggleFav(f.name, f.protein)} className="text-yellow-400">
                    <Star size={18} fill="currentColor" />
                  </button>
                  <button onClick={() => addEntry(f.name, f.protein)} className="bg-accent rounded-lg w-9 h-9 flex items-center justify-center"><Plus size={18}/></button>
                </div>
              ))
            )}
            {tab === 'My Foods' && (
              <>
                <div className="bg-card rounded-xl p-3">
                  <div className="text-xs uppercase tracking-wider text-muted mb-2">New custom food</div>
                  <div className="flex gap-2">
                    <input value={newFoodName} onChange={(e) => setNewFoodName(e.target.value)} placeholder="Name"
                      className="flex-1 bg-card2 rounded-lg px-3 py-2 text-sm placeholder:text-muted" />
                    <input value={newFoodProtein} onChange={(e) => setNewFoodProtein(e.target.value)} placeholder="Protein" inputMode="numeric" type="number"
                      className="w-24 bg-card2 rounded-lg px-3 py-2 text-sm placeholder:text-muted" />
                    <button onClick={saveCustomFood} className="bg-accent rounded-lg w-10 flex items-center justify-center"><Plus size={20}/></button>
                  </div>
                </div>
                {state.myFoods.length === 0 ? <Empty msg="Save foods you eat often to log them in one tap." /> :
                  state.myFoods.map((f) => (
                    <div key={f.id} className="bg-card rounded-xl flex items-center gap-2 px-3 py-2.5">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm truncate">{f.name}</div>
                        <div className="text-xs text-muted">{f.protein}g protein</div>
                      </div>
                      <button onClick={() => deleteCustomFood(f.id)} className="text-muted"><Trash size={16}/></button>
                      <button onClick={() => addEntry(f.name, f.protein)} className="bg-accent rounded-lg w-9 h-9 flex items-center justify-center"><Plus size={18}/></button>
                    </div>
                  ))
                }
              </>
            )}
            {tab === 'My Meals' && (
              <>
                <div className="bg-card rounded-xl p-3">
                  <div className="text-xs uppercase tracking-wider text-muted mb-2">Build a meal</div>
                  <input value={mealName} onChange={(e) => setMealName(e.target.value)} placeholder="Meal name (e.g. Post-workout)"
                    className="w-full bg-card2 rounded-lg px-3 py-2 text-sm placeholder:text-muted mb-2" />
                  <div className="flex gap-2 mb-2">
                    <input value={miName} onChange={(e) => setMiName(e.target.value)} placeholder="Item"
                      className="flex-1 bg-card2 rounded-lg px-3 py-2 text-sm placeholder:text-muted" />
                    <input value={miProtein} onChange={(e) => setMiProtein(e.target.value)} placeholder="g" inputMode="numeric" type="number"
                      className="w-20 bg-card2 rounded-lg px-3 py-2 text-sm placeholder:text-muted" />
                    <button onClick={addMealItem} className="bg-card2 rounded-lg w-10 flex items-center justify-center"><Plus size={18}/></button>
                  </div>
                  {mealItems.length > 0 && (
                    <div className="space-y-1 mb-2">
                      {mealItems.map((it, i) => (
                        <div key={i} className="flex justify-between text-xs text-muted bg-card2 rounded px-2 py-1">
                          <span>{it.name}</span><span>{it.protein}g</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <button onClick={saveMeal} disabled={!mealName.trim() || mealItems.length === 0}
                    className="w-full bg-accent disabled:bg-card2 disabled:text-muted text-white rounded-lg py-2 text-sm">Save meal</button>
                </div>
                {state.myMeals.length === 0 ? <Empty msg="Bundle items into a meal to log them all at once." /> :
                  state.myMeals.map((m) => {
                    const total = m.items.reduce((a, b) => a + (Number(b.protein)||0), 0);
                    return (
                      <div key={m.id} className="bg-card rounded-xl px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm truncate">{m.name}</div>
                            <div className="text-xs text-muted">{m.items.length} items · {total}g protein</div>
                          </div>
                          <button onClick={() => deleteMeal(m.id)} className="text-muted"><Trash size={16}/></button>
                          <button onClick={() => logMeal(m)} className="bg-accent rounded-lg w-9 h-9 flex items-center justify-center"><Plus size={18}/></button>
                        </div>
                      </div>
                    );
                  })
                }
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
