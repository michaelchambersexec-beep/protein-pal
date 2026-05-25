import React from 'react';

// Mii-style mascot: chubby gradient body, big glossy eyes, pink cheeks.
// Same 7 stages — each gets its own gradient + accessory.
export const STAGES = [
  { id: 0, name: 'Sleepy Egg',     quote: 'zzz... feed me',     hero: 'bg-hero-stage-0' },
  { id: 1, name: 'Lil Hatchling',  quote: "I'm awake!",         hero: 'bg-hero-stage-1' },
  { id: 2, name: 'Sprout',         quote: "Let's gooo!",        hero: 'bg-hero-stage-2' },
  { id: 3, name: 'Buff Buddy',     quote: 'feel the gains',     hero: 'bg-hero-stage-3' },
  { id: 4, name: 'Power Pal',      quote: 'almost there!',      hero: 'bg-hero-stage-4' },
  { id: 5, name: 'Champion',       quote: 'GOAL HIT!',          hero: 'bg-hero-stage-5' },
  { id: 6, name: 'LEGEND',         quote: 'beast mode 🔥',      hero: 'bg-hero-stage-6' },
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

export default function Character({ pct = 0, size = 130 }) {
  const stage = getStage(pct);
  const meta = STAGES[stage];
  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative" style={{ width: size, height: size }}>
        {/* sparkle dots around character (stage 3+) */}
        {stage >= 3 && <Sparkles />}
        <div className="character-bob absolute inset-0">
          <CharacterSvg stage={stage} />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="px-2 py-0.5 rounded-full bg-white/15 backdrop-blur text-[10px] tracking-[0.16em] font-bold text-white num">
          LV {String(stage + 1).padStart(2, '0')}
        </span>
        <span className="text-[15px] font-bold tracking-tight text-white">{meta.name}</span>
      </div>
      <div className="mt-1 text-[12px] text-white/80">{meta.quote}</div>
    </div>
  );
}

function Sparkles() {
  // 4 little stars at random positions
  const positions = [
    { x: '8%',  y: '14%', size: 10, delay: 0    },
    { x: '85%', y: '18%', size: 8,  delay: 400  },
    { x: '92%', y: '70%', size: 12, delay: 800  },
    { x: '4%',  y: '62%', size: 9,  delay: 1200 },
  ];
  return (
    <>
      {positions.map((p, i) => (
        <svg key={i} className="absolute twinkle" viewBox="0 0 24 24"
             style={{ left: p.x, top: p.y, width: p.size, height: p.size, animationDelay: p.delay + 'ms' }}>
          <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill="white" opacity="0.95"/>
        </svg>
      ))}
    </>
  );
}

function CharacterSvg({ stage }) {
  const grad = `bodyGrad-${stage}`;
  const stroke = `oklch(0.20 0.05 280)`;
  // Per-stage body gradient colors (light → mid for that 3D ball shimmer)
  const grads = [
    ['#f5f3ff', '#c4b5fd'], // stage 0 — pale lavender egg
    ['#fef3c7', '#fb923c'], // stage 1 — peach / orange
    ['#bbf7d0', '#34d399'], // stage 2 — mint
    ['#bae6fd', '#3b82f6'], // stage 3 — sky / blue
    ['#f5d0fe', '#a855f7'], // stage 4 — pink-violet
    ['#fef08a', '#f59e0b'], // stage 5 — gold
    ['#fecaca', '#ef4444'], // stage 6 — red beast
  ];
  const [g1, g2] = grads[stage];

  const Defs = (
    <defs>
      <radialGradient id={grad} cx="35%" cy="30%" r="80%">
        <stop offset="0%"  stopColor={g1}/>
        <stop offset="60%" stopColor={g2}/>
        <stop offset="100%" stopColor={g2} stopOpacity="0.9"/>
      </radialGradient>
      <radialGradient id={`cheek-${stage}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%"  stopColor="#fb7185" stopOpacity="0.85"/>
        <stop offset="100%" stopColor="#fb7185" stopOpacity="0"/>
      </radialGradient>
    </defs>
  );

  // Reusable face parts
  const Eyes = ({ y = 56, r = 5, intense = false, closed = false }) => (
    closed ? (
      <g stroke={stroke} strokeWidth="2.5" strokeLinecap="round" fill="none">
        <path d={`M ${36} ${y} q 5 -4 10 0`} />
        <path d={`M ${54} ${y} q 5 -4 10 0`} />
      </g>
    ) : (
      <g>
        {/* eye whites */}
        <ellipse cx="41" cy={y} rx={r} ry={r * 1.1} fill="#fff"/>
        <ellipse cx="59" cy={y} rx={r} ry={r * 1.1} fill="#fff"/>
        {/* pupils */}
        <circle cx="41" cy={y + 0.5} r={r * 0.55} fill={intense ? '#dc2626' : '#1f1147'}/>
        <circle cx="59" cy={y + 0.5} r={r * 0.55} fill={intense ? '#dc2626' : '#1f1147'}/>
        {/* shine highlights */}
        <circle cx="42.5" cy={y - 1.5} r={r * 0.22} fill="#fff"/>
        <circle cx="60.5" cy={y - 1.5} r={r * 0.22} fill="#fff"/>
      </g>
    )
  );

  const Cheeks = ({ y = 64 }) => (
    <g>
      <circle cx="33" cy={y} r="5" fill={`url(#cheek-${stage})`}/>
      <circle cx="67" cy={y} r="5" fill={`url(#cheek-${stage})`}/>
    </g>
  );

  const Smile = ({ y = 68, big = false }) => (
    <path d={big
      ? `M 40 ${y} Q 50 ${y + 8} 60 ${y}`
      : `M 43 ${y} Q 50 ${y + 5} 57 ${y}`}
      stroke={stroke} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
  );

  // ---------- Stage 0: Sleeping egg ----------
  if (stage === 0) {
    return (
      <svg viewBox="0 0 100 110" width="100%" height="100%">
        {Defs}
        <ellipse cx="50" cy="58" rx="32" ry="38" fill={`url(#${grad})`} stroke={stroke} strokeWidth="2.5"/>
        <Eyes y={56} closed />
        <Cheeks y={66} />
        <path d="M 44 70 q 6 3 12 0" stroke={stroke} strokeWidth="2" fill="none" strokeLinecap="round"/>
        <text x="76" y="32" fontFamily="DM Sans" fontWeight="800" fontSize="11" fill="white" opacity="0.9">z</text>
        <text x="82" y="22" fontFamily="DM Sans" fontWeight="800" fontSize="8"  fill="white" opacity="0.75">z</text>
      </svg>
    );
  }

  // ---------- Stage 1: Hatched (cracked shell base + head) ----------
  if (stage === 1) {
    return (
      <svg viewBox="0 0 100 110" width="100%" height="100%">
        {Defs}
        <path d="M 22 80 L 30 70 L 38 80 L 46 70 L 54 80 L 62 70 L 70 80 L 78 70 L 80 95 L 20 95 Z"
              fill="#fafafa" stroke={stroke} strokeWidth="2.5" strokeLinejoin="round"/>
        <ellipse cx="50" cy="48" rx="28" ry="30" fill={`url(#${grad})`} stroke={stroke} strokeWidth="2.5"/>
        <Eyes y={50} />
        <Cheeks y={60}/>
        <Smile y={62} />
        {/* tiny tuft of hair */}
        <path d="M 50 18 q 2 -8 8 -6 q -3 4 -8 6 Z" fill={g2} stroke={stroke} strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    );
  }

  // ---------- Stage 2: Sprout (standing body, stub arms, leaf) ----------
  if (stage === 2) {
    return (
      <svg viewBox="0 0 100 110" width="100%" height="100%">
        {Defs}
        {/* stub arms */}
        <ellipse cx="20" cy="62" rx="7" ry="5" fill={`url(#${grad})`} stroke={stroke} strokeWidth="2"/>
        <ellipse cx="80" cy="62" rx="7" ry="5" fill={`url(#${grad})`} stroke={stroke} strokeWidth="2"/>
        {/* body */}
        <ellipse cx="50" cy="58" rx="30" ry="32" fill={`url(#${grad})`} stroke={stroke} strokeWidth="2.5"/>
        <Eyes y={54} />
        <Cheeks y={66}/>
        <Smile y={68} />
        {/* leaf */}
        <path d="M 50 26 Q 60 16 68 22 Q 60 28 50 26 Z" fill="#86efac" stroke={stroke} strokeWidth="2" strokeLinejoin="round"/>
        <line x1="50" y1="26" x2="50" y2="18" stroke={stroke} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
  }

  // ---------- Stage 3: Buff Buddy (small flex + headband) ----------
  if (stage === 3) {
    return (
      <svg viewBox="0 0 100 110" width="100%" height="100%">
        {Defs}
        {/* arms with bicep curve */}
        <path d="M 22 72 Q 12 58 18 48 Q 30 50 30 66 Z" fill={`url(#${grad})`} stroke={stroke} strokeWidth="2" strokeLinejoin="round"/>
        <path d="M 78 72 Q 88 58 82 48 Q 70 50 70 66 Z" fill={`url(#${grad})`} stroke={stroke} strokeWidth="2" strokeLinejoin="round"/>
        {/* body */}
        <ellipse cx="50" cy="58" rx="30" ry="32" fill={`url(#${grad})`} stroke={stroke} strokeWidth="2.5"/>
        <Eyes y={56} />
        <Cheeks y={66}/>
        <Smile y={68} big />
        {/* headband */}
        <rect x="28" y="32" width="44" height="7" rx="3" fill="#ef4444" stroke={stroke} strokeWidth="2"/>
        <circle cx="50" cy="35.5" r="1.6" fill="#fff"/>
      </svg>
    );
  }

  // ---------- Stage 4: Power Pal (bigger arms, lightning) ----------
  if (stage === 4) {
    return (
      <svg viewBox="0 0 100 110" width="100%" height="100%">
        {Defs}
        {/* big biceps */}
        <path d="M 22 74 Q 2 52 14 38 Q 32 40 30 66 Z" fill={`url(#${grad})`} stroke={stroke} strokeWidth="2" strokeLinejoin="round"/>
        <path d="M 78 74 Q 98 52 86 38 Q 68 40 70 66 Z" fill={`url(#${grad})`} stroke={stroke} strokeWidth="2" strokeLinejoin="round"/>
        {/* bicep shine */}
        <path d="M 10 50 Q 8 44 14 42" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.65"/>
        <path d="M 90 50 Q 92 44 86 42" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.65"/>
        {/* body */}
        <ellipse cx="50" cy="60" rx="30" ry="32" fill={`url(#${grad})`} stroke={stroke} strokeWidth="2.5"/>
        <Eyes y={58} />
        <Cheeks y={68}/>
        <Smile y={70} big />
        {/* lightning bolt patch */}
        <path d="M 48 62 L 53 56 L 50 64 L 55 64 L 47 74 L 50 66 L 45 66 Z"
              fill="#fde047" stroke={stroke} strokeWidth="1.6" strokeLinejoin="round"/>
      </svg>
    );
  }

  // ---------- Stage 5: Champion (crown + cape) ----------
  if (stage === 5) {
    return (
      <svg viewBox="0 0 100 110" width="100%" height="100%">
        {Defs}
        {/* cape behind body */}
        <path d="M 22 56 Q 14 90 30 95 Q 50 88 70 95 Q 86 90 78 56 Z"
              fill="#dc2626" stroke={stroke} strokeWidth="2" strokeLinejoin="round"/>
        {/* arms */}
        <path d="M 22 72 Q 4 50 16 38 Q 34 40 30 64 Z" fill={`url(#${grad})`} stroke={stroke} strokeWidth="2" strokeLinejoin="round"/>
        <path d="M 78 72 Q 96 50 84 38 Q 66 40 70 64 Z" fill={`url(#${grad})`} stroke={stroke} strokeWidth="2" strokeLinejoin="round"/>
        {/* body */}
        <ellipse cx="50" cy="60" rx="30" ry="32" fill={`url(#${grad})`} stroke={stroke} strokeWidth="2.5"/>
        {/* crown */}
        <path d="M 30 30 L 36 22 L 44 30 L 50 18 L 56 30 L 64 22 L 70 30 L 70 36 L 30 36 Z"
              fill="#fde047" stroke={stroke} strokeWidth="2" strokeLinejoin="round"/>
        <circle cx="50" cy="28" r="2" fill="#dc2626"/>
        <circle cx="36" cy="33" r="1.4" fill="#dc2626"/>
        <circle cx="64" cy="33" r="1.4" fill="#dc2626"/>
        <Eyes y={56} />
        <Cheeks y={66}/>
        <Smile y={68} big />
      </svg>
    );
  }

  // ---------- Stage 6: Legend (flame aura, horns, glowing eyes) ----------
  return (
    <svg viewBox="0 0 100 110" width="100%" height="100%">
      {Defs}
      {/* flame aura on sides */}
      <path d="M 12 78 Q 4 56 16 38 Q 18 52 24 44 Q 26 60 22 72 Q 28 64 32 60 Q 30 72 24 80 Z"
            fill="#fb923c" stroke={stroke} strokeWidth="2" strokeLinejoin="round" opacity="0.95"/>
      <path d="M 88 78 Q 96 56 84 38 Q 82 52 76 44 Q 74 60 78 72 Q 72 64 68 60 Q 70 72 76 80 Z"
            fill="#fb923c" stroke={stroke} strokeWidth="2" strokeLinejoin="round" opacity="0.95"/>
      {/* arms */}
      <path d="M 22 74 Q 2 52 14 38 Q 32 40 30 66 Z" fill={`url(#${grad})`} stroke={stroke} strokeWidth="2" strokeLinejoin="round"/>
      <path d="M 78 74 Q 98 52 86 38 Q 68 40 70 66 Z" fill={`url(#${grad})`} stroke={stroke} strokeWidth="2" strokeLinejoin="round"/>
      {/* body */}
      <ellipse cx="50" cy="60" rx="30" ry="32" fill={`url(#${grad})`} stroke={stroke} strokeWidth="2.5"/>
      {/* horns */}
      <path d="M 32 34 Q 28 18 38 24 Z" fill={stroke}/>
      <path d="M 68 34 Q 72 18 62 24 Z" fill={stroke}/>
      {/* intense eyes */}
      <Eyes y={58} r={5.5} intense/>
      <Cheeks y={68}/>
      {/* fierce zigzag mouth */}
      <path d="M 38 70 L 44 74 L 50 70 L 56 74 L 62 70"
            stroke={stroke} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* lightning on chest */}
      <path d="M 47 62 L 53 56 L 50 64 L 55 64 L 47 74 L 50 66 L 45 66 Z"
            fill="#fde047" stroke={stroke} strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  );
}
