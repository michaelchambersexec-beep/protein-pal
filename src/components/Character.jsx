import React from 'react';

export const STAGES = [
  { id: 0, name: 'Sleepy Egg',     quote: 'zzz... feed me',     color: '#e4e4e7', aura: null },
  { id: 1, name: 'Lil Hatchling',  quote: "I'm awake!",         color: '#fde68a', aura: null },
  { id: 2, name: 'Sprout',         quote: "Let's gooo!",        color: '#86efac', aura: null },
  { id: 3, name: 'Buff Buddy',     quote: 'feel the gains 💪',  color: '#7dd3fc', aura: 'cyan' },
  { id: 4, name: 'Power Pal',      quote: 'almost there!',      color: '#a78bfa', aura: 'violet' },
  { id: 5, name: 'Goal Crusher',   quote: 'GOAL HIT! 🔥',       color: '#fbbf24', aura: 'gold' },
  { id: 6, name: 'PROTEIN BEAST',  quote: 'LEGENDARY 🦾',       color: '#ef4444', aura: 'fire' },
];

export function getStage(pct) {
  if (pct >= 1.5) return 6;
  if (pct >= 1.0) return 5;
  if (pct >= 0.75) return 4;
  if (pct >= 0.5) return 3;
  if (pct >= 0.25) return 2;
  if (pct > 0) return 1;
  return 0;
}

export default function Character({ pct = 0, size = 84 }) {
  const stage = getStage(pct);
  const meta = STAGES[stage];
  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Aura */}
        {meta.aura && <Aura kind={meta.aura} />}
        {/* Bobbing wrapper */}
        <div className="character-bob absolute inset-0">
          <CharacterSvg stage={stage} color={meta.color} />
        </div>
      </div>
      <div className="mt-1.5 px-3 py-1 rounded-full bg-card text-[11px] font-semibold tracking-wide">
        Lv.{stage + 1} · {meta.name}
      </div>
      <div className="mt-1 relative">
        <div className="bg-card2 text-[10px] text-white/90 px-2.5 py-1 rounded-xl">
          {meta.quote}
        </div>
      </div>
    </div>
  );
}

function Aura({ kind }) {
  const colorMap = {
    cyan: 'from-cyan-400/30',
    violet: 'from-violet-400/40',
    gold: 'from-yellow-300/60',
    fire: 'from-red-500/60',
  };
  return (
    <div className={`absolute inset-0 rounded-full bg-gradient-radial blur-xl ${colorMap[kind]} character-aura`}
         style={{ background: kind === 'fire'
           ? 'radial-gradient(closest-side, rgba(239,68,68,0.55), transparent 70%)'
           : kind === 'gold'
           ? 'radial-gradient(closest-side, rgba(251,191,36,0.55), transparent 70%)'
           : kind === 'violet'
           ? 'radial-gradient(closest-side, rgba(167,139,250,0.45), transparent 70%)'
           : 'radial-gradient(closest-side, rgba(125,211,252,0.4), transparent 70%)' }}/>
  );
}

function CharacterSvg({ stage, color }) {
  // Common body parts
  const Eye = ({ cx, cy, r = 3.2, closed = false, glow = false }) =>
    closed
      ? <path d={`M ${cx - 3.5} ${cy} q 3.5 -2.5 7 0`} stroke="#1a1a1a" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      : (
        <>
          <circle cx={cx} cy={cy} r={r} fill={glow ? '#fff7ed' : '#1a1a1a'} />
          {glow && <circle cx={cx} cy={cy} r={r * 0.55} fill="#ef4444" />}
          <circle cx={cx + 0.9} cy={cy - 0.9} r={0.9} fill="#fff" />
        </>
      );

  // Stage 0: Sleeping egg
  if (stage === 0) {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <ellipse cx="50" cy="55" rx="28" ry="34" fill={color} stroke="#1a1a1a" strokeWidth="2"/>
        <Eye cx={42} cy={52} closed />
        <Eye cx={58} cy={52} closed />
        <text x="72" y="36" fontFamily="DM Sans" fontSize="10" fill="#9aa0aa" fontWeight="700">z</text>
        <text x="78" y="28" fontFamily="DM Sans" fontSize="8"  fill="#9aa0aa" fontWeight="700">z</text>
      </svg>
    );
  }

  // Stage 1: Hatched — broken shell
  if (stage === 1) {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* shell pieces */}
        <path d="M 22 70 L 30 60 L 38 70 L 46 60 L 54 70 L 62 60 L 70 70 L 78 60 L 78 90 L 22 90 Z"
              fill="#fafafa" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round"/>
        {/* head poking out */}
        <circle cx="50" cy="50" r="22" fill={color} stroke="#1a1a1a" strokeWidth="2"/>
        <Eye cx={43} cy={48} />
        <Eye cx={57} cy={48} />
        <path d="M 46 56 Q 50 60 54 56" stroke="#1a1a1a" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
        {/* sparkle */}
        <text x="74" y="28" fontSize="12" fill="#fff">✦</text>
      </svg>
    );
  }

  // Stage 2: Sprout — small standing blob, stub arms
  if (stage === 2) {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* stub arms */}
        <ellipse cx="22" cy="62" rx="6" ry="4" fill={color} stroke="#1a1a1a" strokeWidth="2"/>
        <ellipse cx="78" cy="62" rx="6" ry="4" fill={color} stroke="#1a1a1a" strokeWidth="2"/>
        {/* body */}
        <ellipse cx="50" cy="58" rx="26" ry="28" fill={color} stroke="#1a1a1a" strokeWidth="2"/>
        <Eye cx={42} cy={52} />
        <Eye cx={58} cy={52} />
        <path d="M 44 66 Q 50 72 56 66" stroke="#1a1a1a" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        {/* tiny leaf */}
        <path d="M 50 30 Q 56 22 62 30 Q 56 30 50 30 Z" fill="#22c55e" stroke="#1a1a1a" strokeWidth="1.4"/>
      </svg>
    );
  }

  // Stage 3: Buff Buddy — small biceps
  if (stage === 3) {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* arms with bicep curve */}
        <path d="M 24 70 Q 16 56 22 48 Q 32 50 30 64 Z" fill={color} stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M 76 70 Q 84 56 78 48 Q 68 50 70 64 Z" fill={color} stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round"/>
        {/* body */}
        <ellipse cx="50" cy="58" rx="26" ry="28" fill={color} stroke="#1a1a1a" strokeWidth="2"/>
        <Eye cx={42} cy={52} />
        <Eye cx={58} cy={52} />
        <path d="M 43 66 Q 50 74 57 66" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* sweatband */}
        <rect x="32" y="36" width="36" height="6" rx="2" fill="#5b8dee" stroke="#1a1a1a" strokeWidth="1.4"/>
      </svg>
    );
  }

  // Stage 4: Power Pal — bigger flex
  if (stage === 4) {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* big biceps */}
        <path d="M 22 72 Q 6 54 18 42 Q 34 44 30 66 Z" fill={color} stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M 78 72 Q 94 54 82 42 Q 66 44 70 66 Z" fill={color} stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round"/>
        {/* bicep highlights */}
        <path d="M 14 50 Q 12 46 16 44" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.6"/>
        <path d="M 86 50 Q 88 46 84 44" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.6"/>
        {/* body */}
        <ellipse cx="50" cy="60" rx="28" ry="28" fill={color} stroke="#1a1a1a" strokeWidth="2"/>
        <Eye cx={42} cy={54} />
        <Eye cx={58} cy={54} />
        <path d="M 42 68 Q 50 76 58 68" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* lightning bolt on chest */}
        <path d="M 48 62 L 52 58 L 50 64 L 54 64 L 48 72 L 50 66 L 46 66 Z" fill="#fde047" stroke="#1a1a1a" strokeWidth="1.2"/>
      </svg>
    );
  }

  // Stage 5: Goal Crusher — crown, cape
  if (stage === 5) {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* cape */}
        <path d="M 22 50 Q 14 78 30 86 Q 50 78 70 86 Q 86 78 78 50 Z" fill="#dc2626" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round"/>
        {/* big arms */}
        <path d="M 22 70 Q 6 52 18 40 Q 34 42 30 64 Z" fill={color} stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M 78 70 Q 94 52 82 40 Q 66 42 70 64 Z" fill={color} stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round"/>
        {/* body */}
        <ellipse cx="50" cy="58" rx="28" ry="28" fill={color} stroke="#1a1a1a" strokeWidth="2"/>
        {/* crown */}
        <path d="M 32 32 L 38 24 L 44 32 L 50 22 L 56 32 L 62 24 L 68 32 L 68 38 L 32 38 Z"
              fill="#fde047" stroke="#1a1a1a" strokeWidth="1.8" strokeLinejoin="round"/>
        <circle cx="50" cy="29" r="2" fill="#dc2626"/>
        {/* face */}
        <Eye cx={42} cy={54} />
        <Eye cx={58} cy={54} />
        <path d="M 40 64 Q 50 76 60 64" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </svg>
    );
  }

  // Stage 6: PROTEIN BEAST — flames + glowing eyes
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      {/* flame aura */}
      <path d="M 14 70 Q 8 50 18 38 Q 20 50 26 42 Q 28 56 36 46 Q 36 64 28 74 Z"
            fill="#fb923c" stroke="#1a1a1a" strokeWidth="1.6" strokeLinejoin="round" opacity="0.95"/>
      <path d="M 86 70 Q 92 50 82 38 Q 80 50 74 42 Q 72 56 64 46 Q 64 64 72 74 Z"
            fill="#fb923c" stroke="#1a1a1a" strokeWidth="1.6" strokeLinejoin="round" opacity="0.95"/>
      {/* arms */}
      <path d="M 22 72 Q 4 50 16 38 Q 34 40 30 66 Z" fill={color} stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M 78 72 Q 96 50 84 38 Q 66 40 70 66 Z" fill={color} stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round"/>
      {/* body */}
      <ellipse cx="50" cy="60" rx="28" ry="28" fill={color} stroke="#1a1a1a" strokeWidth="2"/>
      {/* horns */}
      <path d="M 34 36 Q 30 22 38 26 Z" fill="#1a1a1a"/>
      <path d="M 66 36 Q 70 22 62 26 Z" fill="#1a1a1a"/>
      {/* glowing eyes */}
      <Eye cx={42} cy={56} r={3.6} glow />
      <Eye cx={58} cy={56} r={3.6} glow />
      {/* fierce grin */}
      <path d="M 38 68 L 44 72 L 50 68 L 56 72 L 62 68" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* lightning */}
      <path d="M 46 38 L 52 32 L 49 40 L 54 40 L 46 50 L 50 42 L 44 42 Z" fill="#fde047" stroke="#1a1a1a" strokeWidth="1.2"/>
    </svg>
  );
}
