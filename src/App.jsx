import React, { lazy, Suspense, useState } from 'react';
import Dashboard from './screens/Dashboard.jsx';
import Settings from './screens/Settings.jsx';
import { Home, Chart } from './icons.jsx';
import { useAppState, checkStorage } from './storage.js';
const Stats = lazy(() => import('./screens/Stats.jsx'));

export default function App() {
  const [state, update] = useAppState();
  const [tab, setTab] = useState('home');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const storageWarning = !checkStorage();

  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="max-w-app mx-auto min-h-screen relative">
        {tab === 'home' && (
          <Dashboard
            state={state}
            update={update}
            onOpenSettings={() => setSettingsOpen(true)}
            storageWarning={storageWarning}
          />
        )}
        {tab === 'stats' && (
          <Suspense fallback={<div className="p-8 text-center text-ink3 text-[13px]">Loading…</div>}>
            <Stats state={state} />
          </Suspense>
        )}

        <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} state={state} update={update} />

        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app bg-bg/85 backdrop-blur-md border-t border-line">
          <div className="flex">
            <TabBtn active={tab === 'home'} onClick={() => setTab('home')} label="HOME" Icon={Home} />
            <TabBtn active={tab === 'stats'} onClick={() => setTab('stats')} label="STATS" Icon={Chart} />
          </div>
          <div className="h-[env(safe-area-inset-bottom)]"/>
        </nav>
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, label, Icon }) {
  return (
    <button onClick={onClick}
      className={'relative flex-1 flex flex-col items-center gap-1 py-3 transition ' + (active ? 'text-ink' : 'text-ink3')}
    >
      <Icon size={20} />
      <span className="text-[10px] tracking-[0.16em] font-medium">{label}</span>
      {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-px bg-ink"/>}
    </button>
  );
}
