import React, { useRef, useState } from 'react';
import { Bolt, Trash } from '../icons.jsx';

export default function EntryRow({ entry, onDelete }) {
  const [dx, setDx] = useState(0);
  const dxRef = useRef(0);
  const startX = useRef(null);
  const swiping = useRef(false);
  const moved = useRef(false);

  const setBoth = (v) => { dxRef.current = v; setDx(v); };

  const onStart = (e) => {
    startX.current = (e.touches ? e.touches[0].clientX : e.clientX);
    swiping.current = true;
    moved.current = false;
  };
  const onMove = (e) => {
    if (!swiping.current) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX);
    const d = Math.max(-120, Math.min(0, x - startX.current));
    if (Math.abs(d) > 6) moved.current = true;
    setBoth(d);
  };
  const onEnd = () => {
    if (!swiping.current) return;
    swiping.current = false;
    if (dxRef.current < -60) setBoth(-80);
    else setBoth(0);
  };

  const onRowClick = () => {
    if (moved.current) { moved.current = false; return; }
    if (dxRef.current < 0) setBoth(0);
  };

  return (
    <div className="relative overflow-hidden rounded-xl select-none">
      <button
        onClick={onDelete}
        className="absolute top-0 right-0 h-full px-5 bg-danger flex items-center text-white"
        style={{ width: 80 }}
        aria-label="Delete entry"
      >
        <Trash size={20}/>
      </button>
      <div
        className="relative bg-card flex items-center gap-3 px-4 py-3"
        style={{ transform: `translateX(${dx}px)`, transition: swiping.current ? 'none' : 'transform 180ms ease' }}
        onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd} onTouchCancel={onEnd}
        onMouseDown={onStart}
        onMouseMove={onMove}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
        onClick={onRowClick}
      >
        <div className="w-9 h-9 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0">
          <Bolt size={18}/>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{entry.name}</div>
          <div className="text-xs text-muted">
            {new Date(entry.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
          </div>
        </div>
        <div className="text-base font-semibold tabular-nums">{entry.protein}<span className="text-xs text-muted font-normal">g</span></div>
      </div>
    </div>
  );
}
