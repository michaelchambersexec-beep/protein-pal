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
    <div className="relative overflow-hidden select-none border-b border-white/8 last:border-0">
      <button onClick={onDelete}
        className="absolute top-0 right-0 h-full px-5 bg-coral/95 flex items-center text-white"
        style={{ width: 80 }} aria-label="Delete entry">
        <Trash size={18}/>
      </button>
      <div
        className="relative flex items-center gap-3 px-4 py-3.5"
        style={{
          background: 'oklch(0.16 0.025 280)',
          transform: `translateX(${dx}px)`,
          transition: swiping.current ? 'none' : 'transform 220ms cubic-bezier(0.34,1.56,0.64,1)',
        }}
        onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd} onTouchCancel={onEnd}
        onMouseDown={onStart} onMouseMove={onMove} onMouseUp={onEnd} onMouseLeave={onEnd}
        onClick={onRowClick}
      >
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white shadow-md"
             style={{ background: 'linear-gradient(135deg, #a78bfa, #ec4899)' }}>
          <Bolt size={16}/>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-semibold text-white truncate">{entry.name}</div>
          <div className="num text-[11px] text-white/55 mt-0.5">
            {new Date(entry.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
          </div>
        </div>
        <div className="num text-[18px] font-bold text-white tracking-tight">
          {entry.protein}<span className="text-[11px] text-white/55 font-normal ml-0.5">g</span>
        </div>
      </div>
    </div>
  );
}
