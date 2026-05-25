import React, { useMemo, useState } from 'react';
import { X, Search, Camera, Plus, Star, Trash } from '../icons.jsx';
import { FOOD_DATABASE } from '../foodDatabase.js';
import { uid } from '../storage.js';

const TABS = [
  { id: 'RECENTS',   bg: 'linear-gradient(135deg, #a78bfa, #6366f1)' },
  { id: 'FAVORITES', bg: 'linear-gradient(135deg, #fde047, #fb923c)' },
  { id: 'MY FOODS',  bg: 'linear-gradient(135deg, #86efac, #06b6d4)' },
  { id: 'MY MEALS',  bg: 'linear-gradient(135deg, #f9a8d4, #ec4899)' },
];

export default function AddProteinModal({ open, onClose, state, update, dateStr }) {
  const [tab, setTab] = useState(TABS[0].id);
  const [q, setQ] = useState('');
  const [qaName, setQaName] = useState('');
  const [qaProtein, setQaProtein] = useState('');
  const [qaCarbs, setQaCarbs] = useState('');
  const [qaFat, setQaFat] = useState('');
  const [err, setErr] = useState('');

  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodProtein, setNewFoodProtein] = useState('');
  const [mealName, setMealName] = useState('');
  const [mealItems, setMealItems] = useState([]);
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
    <div className="text-center text-ink3 text-[13px] py-14 px-4">{msg}</div>
  );

  const Row = ({ name, protein, onAdd, right }) => (
    <div className="flex items-center gap-3 py-3 border-b border-line">
      <div className="flex-1 min-w-0">
        <div className="text-[14px] text-ink truncate">{name}</div>
        <div className="num text-[11px] text-ink3 mt-0.5">{protein}g</div>
      </div>
      {right}
      <button onClick={onAdd}
        className="pressable w-10 h-10 rounded-full text-white flex items-center justify-center shadow-md"
        style={{ background: 'linear-gradient(135deg, #a78bfa, #ec4899)' }}>
        <Plus size={16}/>
      </button>
    </div>
  );

  const Input = (props) => (
    <input {...props}
      className={'bg-raised rounded-md px-3 py-2.5 text-[14px] text-ink placeholder:text-ink3 ' + (props.className || '')}/>
  );

  return (
    <div className="fixed inset-0 z-50 backdrop flex items-end" onClick={onClose}>
      <div
        className="w-full max-w-app mx-auto bg-bg rounded-t-[28px] animate-slideUp flex flex-col border-t border-line"
        style={{ height: '92vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab handle */}
        <div className="flex justify-center pt-2.5 pb-1">
          <div className="w-9 h-1 rounded-full bg-ink4"/>
        </div>

        <div className="flex items-center justify-between px-6 pt-2 pb-4">
          <div>
            <div className="eyebrow">add</div>
            <h2 className="text-[20px] font-semibold tracking-tight">Log protein</h2>
          </div>
          <button onClick={onClose} className="pressable w-9 h-9 rounded-full border border-line flex items-center justify-center text-ink2">
            <X size={16}/>
          </button>
        </div>

        {/* Search */}
        <div className="px-6">
          <div className="flex items-center gap-3 border-b border-line py-3">
            <Search size={16} className="text-ink3" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search foods"
              className="flex-1 bg-transparent text-[14px] text-ink placeholder:text-ink3"
            />
            <Camera size={16} className="text-ink3" />
          </div>
        </div>

        {/* Search results */}
        {q.trim() && (
          <div className="px-6 mt-1 max-h-56 overflow-y-auto no-scrollbar">
            {filteredDb.length === 0 ? (
              <div className="text-[12px] text-ink3 py-3">No matches</div>
            ) : filteredDb.map((f, i) => (
              <button key={i}
                onClick={() => { addEntry(f.name, f.protein); setQ(''); }}
                className="w-full flex items-center justify-between py-2.5 border-b border-line text-left"
              >
                <span className="text-[14px] text-ink">{f.name}</span>
                <span className="num text-[13px] text-ink2">{f.protein}g</span>
              </button>
            ))}
          </div>
        )}

        {/* Quick Add */}
        <div className="px-6 mt-5">
          <div className="eyebrow mb-2">quick add</div>
          <div className="flex gap-2">
            <Input value={qaName} onChange={(e) => setQaName(e.target.value)} placeholder="Name" className="flex-1"/>
            <Input value={qaProtein} onChange={(e) => setQaProtein(e.target.value)}
              placeholder="g" inputMode="numeric" type="number" className="num w-20 text-center"/>
            <button onClick={handleQuickAdd}
              className="pressable w-11 rounded-xl text-white flex items-center justify-center shadow-md"
              style={{ background: 'linear-gradient(135deg, #a78bfa, #ec4899)' }}>
              <Plus size={18}/>
            </button>
          </div>
          {state.showMacros && (
            <div className="flex gap-2 mt-2">
              <Input value={qaCarbs} onChange={(e) => setQaCarbs(e.target.value)}
                placeholder="Carbs (g)" inputMode="numeric" type="number" className="num flex-1"/>
              <Input value={qaFat} onChange={(e) => setQaFat(e.target.value)}
                placeholder="Fat (g)" inputMode="numeric" type="number" className="num flex-1"/>
            </div>
          )}
          {err && <div className="text-[12px] text-danger mt-2">{err}</div>}
        </div>

        {/* Tabs as colorful pills */}
        <div className="px-6 mt-5">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={'pressable shrink-0 px-3.5 py-1.5 rounded-full text-[11px] tracking-[0.12em] font-bold transition ' +
                    (active ? 'text-white shadow-lg' : 'bg-white/8 text-white/70 border border-white/10')}
                  style={active ? { background: t.bg, boxShadow: '0 6px 20px -6px rgba(168,139,250,0.55)' } : undefined}
                >{t.id}</button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pt-2 pb-6 no-scrollbar">
          <div key={tab} className="tab-fade">
            {tab === 'RECENTS' && (
              recents.length === 0 ? <Empty msg="Log something and it'll show up here." /> :
              recents.map((r) => (
                <Row key={r.id} name={r.name} protein={r.protein} onAdd={() => addEntry(r.name, r.protein)}
                  right={
                    <button onClick={() => toggleFav(r.name, r.protein)} className={isFav(r.name) ? 'text-ink' : 'text-ink3'}>
                      <Star size={16} fill={isFav(r.name) ? 'currentColor' : 'none'}/>
                    </button>
                  }/>
              ))
            )}
            {tab === 'FAVORITES' && (
              state.favorites.length === 0 ? <Empty msg="Star a recent entry to keep it close." /> :
              state.favorites.map((f) => (
                <Row key={f.id} name={f.name} protein={f.protein} onAdd={() => addEntry(f.name, f.protein)}
                  right={
                    <button onClick={() => toggleFav(f.name, f.protein)} className="text-ink">
                      <Star size={16} fill="currentColor"/>
                    </button>
                  }/>
              ))
            )}
            {tab === 'MY FOODS' && (
              <>
                <div className="pt-3 pb-4 border-b border-line">
                  <div className="eyebrow mb-2">new custom food</div>
                  <div className="flex gap-2">
                    <Input value={newFoodName} onChange={(e) => setNewFoodName(e.target.value)} placeholder="Name" className="flex-1"/>
                    <Input value={newFoodProtein} onChange={(e) => setNewFoodProtein(e.target.value)}
                      placeholder="g" inputMode="numeric" type="number" className="num w-20 text-center"/>
                    <button onClick={saveCustomFood}
                      className="pressable w-11 rounded-xl bg-white/10 border border-white/15 text-white flex items-center justify-center">
                      <Plus size={18}/>
                    </button>
                  </div>
                </div>
                {state.myFoods.length === 0 ? <Empty msg="Save go-tos for one-tap logging." /> :
                  state.myFoods.map((f) => (
                    <Row key={f.id} name={f.name} protein={f.protein} onAdd={() => addEntry(f.name, f.protein)}
                      right={<button onClick={() => deleteCustomFood(f.id)} className="text-ink3"><Trash size={14}/></button>}/>
                  ))
                }
              </>
            )}
            {tab === 'MY MEALS' && (
              <>
                <div className="pt-3 pb-4 border-b border-line">
                  <div className="eyebrow mb-2">build a meal</div>
                  <Input value={mealName} onChange={(e) => setMealName(e.target.value)} placeholder="Meal name (e.g. Post-workout)" className="w-full mb-2"/>
                  <div className="flex gap-2 mb-2">
                    <Input value={miName} onChange={(e) => setMiName(e.target.value)} placeholder="Item" className="flex-1"/>
                    <Input value={miProtein} onChange={(e) => setMiProtein(e.target.value)}
                      placeholder="g" inputMode="numeric" type="number" className="num w-16 text-center"/>
                    <button onClick={addMealItem}
                      className="pressable w-11 rounded-xl bg-white/10 border border-white/15 text-white flex items-center justify-center">
                      <Plus size={18}/>
                    </button>
                  </div>
                  {mealItems.length > 0 && (
                    <div className="space-y-1 mb-3">
                      {mealItems.map((it, i) => (
                        <div key={i} className="flex justify-between text-[12px] text-ink2 border-b border-line py-1">
                          <span>{it.name}</span><span className="num">{it.protein}g</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <button onClick={saveMeal} disabled={!mealName.trim() || mealItems.length === 0}
                    className="pressable w-full text-white rounded-xl py-3 text-[14px] font-bold shadow-lg disabled:opacity-40 disabled:shadow-none"
                    style={{ background: 'linear-gradient(135deg, #a78bfa, #ec4899)' }}>
                    Save meal
                  </button>
                </div>
                {state.myMeals.length === 0 ? <Empty msg="Bundle items, log them all at once." /> :
                  state.myMeals.map((m) => {
                    const total = m.items.reduce((a, b) => a + (Number(b.protein)||0), 0);
                    return (
                      <div key={m.id} className="flex items-center gap-3 py-3 border-b border-line">
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] text-ink truncate">{m.name}</div>
                          <div className="num text-[11px] text-ink3 mt-0.5">{m.items.length} items · {total}g</div>
                        </div>
                        <button onClick={() => deleteMeal(m.id)} className="text-ink3"><Trash size={14}/></button>
                        <button onClick={() => logMeal(m)}
                          className="pressable w-10 h-10 rounded-full text-white flex items-center justify-center shadow-md"
          style={{ background: 'linear-gradient(135deg, #a78bfa, #ec4899)' }}>
                          <Plus size={16}/>
                        </button>
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
