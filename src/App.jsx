import React, { lazy, Suspense, useState } from 'react';
import Dashboard from './screens/Dashboard.jsx';
import Settings from './screens/Settings.jsx';
const Stats = lazy(() => import('./screens/Stats.jsx'));
import { Home, Chart } from './icons.jsx';
import { useAppState, checkStorage } from './storage.js';

export default function App() {
  const [state, update] = useAppState();
  const [tab, setTab] = useState('home');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const storageWarning = !checkStorage();

  return (
    <div className="min-h-screen bg-bg text-white">
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
          <Suspense fallback={<div className="p-8 text-center text-muted text-sm">Loading…</div>}>
            <Stats state={state} />
          </Suspense>
        )}

        <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} state={state} update={update} />

        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app bg-card/95 backdrop-blur border-t border-card2 flex">
          <TabBtn active={tab === 'home'} onClick={() => setTab('home')} label="Home" Icon={Home} />
          <TabBtn active={tab === 'stats'} onClick={() => setTab('stats')} label="Stats" Icon={Chart} />
        </nav>
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, label, Icon }) {
  return (
    <button onClick={onClick}
      className={'flex-1 flex flex-col items-center gap-1 py-3 transition ' + (active ? 'text-accent' : 'text-muted')}
    >
      <Icon size={22} />
      <span className="text-[11px] font-medium">{label}</span>
    </button>
  );
}
