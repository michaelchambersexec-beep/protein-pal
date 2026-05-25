import React from 'react';

// Pixel-art bodybuilder sprites, redrawn cleaner.
// Face = 1-pixel eyes + tiny mouth so it never looks like a beard.

export const STAGES = [
  { id: 0, name: 'Lil Egg',       quote: 'zzz... feed me',     hero: 'bg-hero-stage-0' },
  { id: 1, name: 'Newbie',        quote: "let's start",        hero: 'bg-hero-stage-1' },
  { id: 2, name: 'Getting There', quote: 'gains incoming',     hero: 'bg-hero-stage-2' },
  { id: 3, name: 'Buff Bro',      quote: 'flex check 💪',      hero: 'bg-hero-stage-3' },
  { id: 4, name: 'Mega Lifter',   quote: 'one more rep',       hero: 'bg-hero-stage-4' },
  { id: 5, name: 'Champion',      quote: 'GOAL HIT!',          hero: 'bg-hero-stage-5' },
  { id: 6, name: 'BEAST MODE',    quote: 'unstoppable 🔥',     hero: 'bg-hero-stage-6' },
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

export default function Character({ pct = 0, size = 160 }) {
  const stage = getStage(pct);
  const meta = STAGES[stage];
  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative" style={{ width: size, height: size }}>
        {stage >= 4 && <Sparkles />}
        <div className="character-bob absolute inset-0 flex items-end justify-center">
          <PixelSprite stage={stage} />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="px-2 py-0.5 rounded-md bg-black/35 backdrop-blur text-[10px] tracking-[0.18em] font-bold text-white num">
          LV {String(stage + 1).padStart(2, '0')}
        </span>
        <span className="text-[15px] font-bold tracking-tight text-white">{meta.name}</span>
      </div>
      <div className="mt-1 text-[12px] text-white/85">{meta.quote}</div>
    </div>
  );
}

function Sparkles() {
  const positions = [
    { x: '4%',  y: '12%', size: 11, delay: 0    },
    { x: '88%', y: '14%', size: 9,  delay: 400  },
    { x: '92%', y: '64%', size: 12, delay: 800  },
    { x: '2%',  y: '58%', size: 10, delay: 1200 },
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

function PixelSprite({ stage }) {
  const { grid, palette } = SPRITES[stage];
  const h = grid.length;
  const w = grid[0].length;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%"
         shapeRendering="crispEdges"
         style={{ imageRendering: 'pixelated' }}
         preserveAspectRatio="xMidYMax meet">
      {grid.flatMap((row, y) =>
        [...row].map((ch, x) => {
          const color = palette[ch];
          if (!color) return null;
          return <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={color}/>;
        })
      )}
    </svg>
  );
}

// Palette — one solid color per code, designed to read at small sizes.
const P = {
  ' ': null, '.': null,
  k: '#1a0f1a',  // outline
  s: '#e1ad7b',  // skin mid
  S: '#f4cda3',  // skin highlight
  d: '#a06a3d',  // skin shadow
  H: '#3a2417',  // hair brown
  T: '#1e3a8a',  // trunks navy (default)
  t: '#152768',  // trunks shadow
  W: '#ffffff',  // white
  e: '#1a0f1a',  // eye pupil (= outline color)
  P: '#fb7185',  // cheek blush
  c: '#f9d5b0',  // shell light
  C: '#fef2e6',  // shell highlight
  r: '#dc2626',  // red
  y: '#facc15',  // gold
  Y: '#fde68a',  // gold highlight
  g: '#cbd5e1',  // metal light
  G: '#475569',  // metal dark
  F: '#fb923c',  // flame
  f: '#dc2626',  // flame dark
  L: '#fde047',  // lightning
  Z: '#cbd5e1',  // soft white for z's
};

const SPRITES = [
  // ============================== STAGE 0 ==============================
  // Sleepy egg — clean rounded shell, small skin face patch, dot eyes + tiny mouth, "z" letters
  {
    palette: P,
    grid: [
      '.....kkkkkk.....',
      '....kCCCCCCk....',
      '...kCccccccCk...',
      '...kCsssssscCk..',  // top of face
      '..kCcseseseccCk.',  // eye dots (e at cols 4 and 7)
      '..kCcssssssccCk.',
      '..kCcssPWPsccCk.',  // small mouth + cheek hints
      '..kCccccccccCCk.',
      '..kCCccccccccCk.',  // egg lower body
      '..kCCccccccccCk.',
      '..kCCcccccccCk..',
      '...kCCcccccCk...',
      '....kCCCCCCk....',
      '.....kkkkkk.....',
    ],
  },

  // ============================== STAGE 1 ==============================
  // Newbie — small skinny kid with messy hair, sky trunks
  {
    palette: { ...P, T: '#0891b2', t: '#0e7490' },
    grid: [
      '......kkkk......',
      '.....kHHHHk.....',
      '....kHHHHHHk....',
      '....kHsssHHk....',
      '....ksesesHk....',  // eyes
      '....kssssssk....',
      '....kssWssk.....',  // small smile
      '.....kkkkk......',
      '......ksk.......',
      '.....kssk.......',  // narrow shoulders
      '....ksssssk.....',  // chest
      '....ksssssk.....',
      '....ksssssk.....',
      '....kTTTTTk.....',  // trunks
      '....kTtttTk.....',
      '....kss.ssk.....',  // legs
      '....kss.ssk.....',
      '.....k...k......',
    ],
  },

  // ============================== STAGE 2 ==============================
  // Getting there — slightly wider, green trunks, hint of pec shading
  {
    palette: { ...P, T: '#16a34a', t: '#15803d' },
    grid: [
      '......kkkk......',
      '.....kHHHHk.....',
      '....kHHHHHHk....',
      '....kHsssHHk....',
      '....ksesesHk....',
      '....kssssssk....',
      '....kssWssk.....',
      '.....kkkkk......',
      '......ksk.......',
      '....kkkkkkkk....',  // wider shoulders
      '...kSssssssSk...',
      '...kSsdssdsSk...',  // pec shadow lines
      '...kSssssssSk...',
      '....kssssssk....',
      '....ksdsdsk.....',  // hint abs
      '....kTTTTTk.....',
      '....kTtttTk.....',
      '....kss.ssk.....',
      '....kss.ssk.....',
      '.....k...k......',
    ],
  },

  // ============================== STAGE 3 ==============================
  // Buff Bro — classic double bicep flex, navy trunks, red headband
  {
    palette: { ...P, T: '#1e3a8a', t: '#152768' },
    grid: [
      '.......kkkkkk...',
      '......kHHHHHHk..',
      '.....kHHHHHHHHk.',
      '....kHrrrrrrrrk.',  // red headband across forehead
      '....kHsssssssHk.',
      '....kHseseseHk..',  // eyes
      '....kHsssssssk..',
      '.....kssWWWss...',  // smile
      '......kkkkkk....',
      '.......kssk.....',
      '....kkkkkkkkk...',  // upper traps
      '.kkkSsssssssSkkk',  // FLEXED arms outward
      'kSSsSSSkkkSSSsSSk', // arms wide + chest top
      'kSSdSSdkdSSSdSSk',  // bicep peaks
      '.kSSdkSSSSSkdSSk',  // bicep curve down
      '..kSSdSSSSSSdSk.',  // forearm down
      '...kkSSSSSSSkk..',  // chest
      '...kSdsdsdsdSk..',  // 6-pack
      '...kSdsdsdsdSk..',
      '....kkkkkkkk....',
      '....kTTTTTTk....',
      '....kTttttTk....',
      '....kss..ssk....',
      '....kss..ssk....',
      '.....k....k.....',
    ],
  },

  // ============================== STAGE 4 ==============================
  // Mega Lifter — overhead press with barbell
  {
    palette: { ...P, T: '#6d28d9', t: '#4c1d95' },
    grid: [
      'GGGG........GGGG',  // dumbbell weights
      'GggGkkkkkkkkGgGG',  // bar across
      'GGGG........GGGG',
      '....kss....ssk..',  // arms stretched up
      '....ksSk..kSsk..',
      '....ksSk..kSsk..',
      '....ksSk..kSsk..',
      '....kkkk..kkkk..',
      '......kHHHHk....',
      '....kHHHHHHHHk..',
      '....kHsssssHHk..',
      '....kHseseseHk..',
      '....kHsssssHHk..',
      '....kssssssssk..',
      '.....kssWWss....',  // gritted teeth smile
      '......kkkkkk....',
      '....kkkkkkkkk...',  // huge shoulders
      '...kSSsssssSSk..',
      '...kSdsLLLsdSk..',  // L = lightning glow chest
      '...kSdssSSssdk..',
      '...kSdsdsdsdSk..',  // 8-pack
      '...kSdsdsdsdSk..',
      '....kkkkkkkk....',
      '....kTTTTTTk....',
      '....kTttttTk....',
      '....kss..ssk....',
      '....kss..ssk....',
      '.....k....k.....',
    ],
  },

  // ============================== STAGE 5 ==============================
  // Champion — gold crown, red cape, gold trunks
  {
    palette: { ...P, T: '#facc15', t: '#a16207' },
    grid: [
      '....kyykyykyyk..',  // crown spikes
      '....kyYykYrYykk.',  // gem in middle
      '.....kyyyyyyyk..',
      '......kHHHHHk...',
      '....kHHHHHHHHk..',
      '....kHsssssHHk..',
      '....kHseseseHk..',
      '....kHsssssHHk..',
      '....kssssssssk..',
      '.....kssWWWss...',  // big smile
      '......kkkkkk....',
      '.......kssk.....',
      'rkkkkkkkkkkkkkr.',  // red cape across shoulders
      'rSSsssssssssSSr.',
      'rSdsSSSSSSSSdSr.',  // chest with cape sides
      '.kSdSSSSSSSSdk..',
      '..kSdsSSSSsdSk..',
      '...kSdsdsdsdk...',
      '...kSdsdsdsdk...',
      '....kkkkkkkk....',
      '....kTTTTTTk....',
      '....kTttttTk....',
      '....kss..ssk....',
      '....kss..ssk....',
      '.....k....k.....',
    ],
  },

  // ============================== STAGE 6 ==============================
  // BEAST MODE — horns, mohawk, glowing eyes, red trunks, flame aura
  {
    palette: { ...P, T: '#dc2626', t: '#7f1d1d', H: '#1a0f1a', e: '#facc15' },
    grid: [
      'F.k.....kk.....kF',  // horns peeking
      'FkkF.kHHHHHHk.FkkF',
      '.F.F.kHHHHHHHHk.F.F',  // mohawk
      'F.FFkHsssssssHk.FFF',  // flame aura on sides
      'fF..kHseseseseHk..Ff',  // glowing yellow eyes (e -> #facc15)
      'fF..kssssssssssk..Ff',
      'fF...kssLLLLssk...Ff',  // L lightning teeth/snarl
      'Ff....kkkkkkkk....Ff',
      'Ff.....kssssk.....Ff',
      'Ff.kkkkkkkkkkkkk.Ff.',  // huge yoke
      'F.kSSSsssssSSSSk.F..',
      'F.kSdsdSSSSSdsdSk.F.',  // mass shoulders
      'F.kSdsrSSSSrSdsSk.F.',  // red chest stripes
      '..kSdsSLLLLSSdsSk...',  // big chest + lightning
      '...kSdSSSSSSSSdk....',
      '....kssSSSSSSsk.....',
      '....kSdsdsdsdSk.....',  // 8-pack abs
      '....kSdsdsdsdSk.....',
      '....kSdsdsdsdSk.....',
      '.....kkkkkkkk.......',
      '.....kTTTLLTTk......',  // red trunks with lightning
      '.....kTttttttk......',
      '.....kss..ssk.......',
      '.....kss..ssk.......',
      '......k....k........',
    ],
  },
];
