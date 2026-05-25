import React from 'react';

// 16-bit pixel art bodybuilder. Each stage = its own sprite grid.
// Characters are rendered as <rect> "pixels" with shape-rendering: crispEdges.

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

export default function Character({ pct = 0, size = 156 }) {
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
    { x: '6%',  y: '12%', size: 11, delay: 0    },
    { x: '86%', y: '14%', size: 9,  delay: 400  },
    { x: '92%', y: '64%', size: 13, delay: 800  },
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

// ---------- Pixel renderer ----------
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

// Shared palette codes — overridden per stage where needed.
const BASE_PALETTE = {
  ' ': null,
  '.': null,
  k: '#1a0f1a',  // outline (near-black)
  s: '#e1ad7b',  // skin mid
  S: '#f4cda3',  // skin highlight
  d: '#a06a3d',  // skin shadow
  H: '#3a2417',  // hair brown
  h: '#1f130a',  // hair shadow
  T: '#1e3a8a',  // trunks navy (default)
  t: '#152768',  // trunks shadow
  W: '#ffffff',  // eye white
  r: '#dc2626',  // red
  y: '#facc15',  // gold
  Y: '#fde68a',  // light gold
  g: '#9ca3af',  // metal
  G: '#4b5563',  // metal dark
  F: '#fb923c',  // flame
  f: '#dc2626',  // flame dark
  L: '#fde047',  // lightning
  P: '#fb7185',  // cheek blush
  c: '#f9c2a0',  // diaper white-pink
  C: '#fef2e6',  // shell
  e: '#4a2a17',  // eye pupil brown
};

const SPRITES = [
  // ============ STAGE 0 — Sleepy egg with face ============
  {
    palette: { ...BASE_PALETTE, T: '#fef2e6', t: '#e5c8a8' },
    grid: [
      '......kkkkkk....',
      '.....kCCCCCCk...',
      '....kCCCCCCCCk..',
      '....kCsssssCCk..',
      '....kCkkskkCCk..',  // closed eyes (zigzag lashes)
      '....kCssssssCk..',
      '....kCsPPsPPCk..',  // cheek blush
      '....kCssssssCk..',
      '.....kCsWWsCk...',  // tiny smile
      '.....kCCCCCk....',
      '....kCCCCCCCk...',
      '...kCCCCCCCCCk..',
      '...kCCCCCCCCCk..',  // egg body
      '...kCCCCCCCCCk..',
      '....kCCCCCCCk...',
      '.....kkkkkk.....',
    ],
  },
  // ============ STAGE 1 — Newbie (skinny kid) ============
  {
    palette: { ...BASE_PALETTE, H: '#a0522d', T: '#0891b2', t: '#0e7490' },
    grid: [
      '.....kkkkkk.....',
      '....kHHHHHHk....',
      '...kHHHHHHHHk...',
      '...kHsssssHHk...',
      '...kHsWeWsHHk...',  // eyes (W white, e pupil)
      '...kHsssssHHk...',
      '....kssPPsk.....',  // cheek
      '....kssWWsk.....',  // mouth
      '.....kkkkk......',
      '......ksk.......',  // neck
      '.....ksssk......',  // narrow shoulders
      '....kssssk......',  // skinny body
      '....kssssk......',
      '....kssssk......',
      '....kssssk......',
      '....kTTTTTk.....',  // trunks
      '....kTtttTk.....',
      '....kss.ssk.....',  // legs split
      '....kss.ssk.....',
      '....kss.ssk.....',
      '.....kk.kk......',
    ],
  },
  // ============ STAGE 2 — Getting there (small muscles) ============
  {
    palette: { ...BASE_PALETTE, H: '#92400e', T: '#16a34a', t: '#15803d' },
    grid: [
      '.....kkkkkk.....',
      '....kHHHHHHk....',
      '...kHHHHHHHHk...',
      '...kHsssssHHk...',
      '...kHsWeWsHHk...',
      '...kHsssssHHk...',
      '....kssssssk....',
      '....ksssWssk....',  // smile starting
      '.....kkkkkk.....',
      '......kssk......',
      '...kkkksskkkk...',  // shoulders forming
      '..kSSsssssSSk...',
      '..kSSdsssdSSk...',  // chest with shadow lines
      '..kSdsssssdSk...',
      '...kssssssk.....',
      '....ksssssk.....',  // narrow waist
      '....ksdsdsk.....',  // hint of abs
      '....kTTTTTk.....',
      '....kTtttTk.....',
      '....kss.ssk.....',
      '....kss.ssk.....',
      '.....kk.kk......',
    ],
  },
  // ============ STAGE 3 — Buff Bro (classic double bicep flex) ============
  {
    palette: { ...BASE_PALETTE, H: '#3a2417', T: '#1e3a8a', t: '#152768' },
    grid: [
      '......kkkkkk....',
      '.....kHHHHHHk...',
      '....kHHHHHHHHk..',
      '....kHsssssHHk..',
      '....kHsWeWsHHk..',
      '....kHsssksssk..',  // nose hint
      '....kssssssssk..',
      '.....kssWWssk...',  // smile
      '......kkkkkk....',
      '.......kssk.....',
      '....kkkkkkkk....',  // upper traps
      '.kkksSSsssSSskk.',  // shoulders FLEXED OUT
      'kSSsSSskkSSsSSSk',  // bicep peaks both sides
      'kSdsSSdkdSSsSdSk',  // bicep with shadow lines
      'kSdsSdkrrkdSsdSk',  // (r = red headband sweatband on inner)
      '.kSSdkSSSSkdSSk.',  // forearm tapering
      '..kssdSSSSdsk...',
      '...kssSSSSssk...',  // chest
      '...kSdsdsdSk....',  // abs!
      '...kSdsdsdSk....',
      '....kkkkkkk.....',  // waist
      '....kTTTTTk.....',
      '....kTtttTk.....',
      '....kss.ssk.....',
      '....kss.ssk.....',
      '....kssdssk.....',  // leg muscle hint
      '.....kk.kk......',
    ],
  },
  // ============ STAGE 4 — Mega Lifter (overhead press with dumbbell) ============
  {
    palette: { ...BASE_PALETTE, H: '#3a2417', T: '#6d28d9', t: '#4c1d95' },
    grid: [
      'gggk.......kggg',  // dumbbell weights
      'gGgk.......kgGg',
      'gggk.......kggg',
      '.kk.........kk.',
      '..k...........k',
      '..k.kkkkkk....k',  // bar
      '..k.kHHHHk....k',
      '....kHHHHHHk....',
      '....kHsssssHk...',
      '....kHsWeWsHk...',
      '....kHsssssHk...',
      '....kssssssk....',
      '.....kssWWk.....',  // gritted teeth
      '......kkkk......',
      '.kkkkkkkkkkkkk..',  // wide shoulders pressing up
      'kSSSsSSSSsSSSsk',
      'kSdsSdsssSdsSdk',  // big delts
      'kSdsSsLLLsSsSdk',  // L = lightning glow on chest
      '.kSdsSSSSsSsdk.',
      '..kssSSSSSSsk..',
      '..kSdsdsdsdSk..',  // 6-pack
      '..kSdsdsdsdSk..',
      '...kkkkkkkkk...',
      '...kTTTTTTTk...',
      '...kTttttttk...',
      '...kss...ssk...',
      '...kss...ssk...',
      '....kk...kk....',
    ],
  },
  // ============ STAGE 5 — Champion (crown, gold trunks, cape) ============
  {
    palette: { ...BASE_PALETTE, H: '#3a2417', T: '#facc15', t: '#a16207', r: '#dc2626' },
    grid: [
      '...kyyykkkyyyk..',  // crown spikes
      '...kyYyrkrYyyk..',  // crown with red gem
      '....kkyyyyykk...',
      '....kHHHHHHHk...',
      '...kHHsssssHk...',
      '...kHsWeWssHk...',
      '...kHsssssHHk...',
      '....kssssssk....',
      '.....kssWWk.....',  // big smile
      '......kkkk......',
      '.......kssk.....',
      'rkkkkkkkkkkkkkkr',  // cape edge across shoulders
      'rkSSsssSSsssSSkr',
      'rkSdsSSSSSSdSdkr',  // chest + cape sides
      'rkSdsSSrrSSsSdkr',  // r = red trim of cape
      '.kSSdSSSSSdSSk..',
      '..kssSSSSSSsk...',
      '..kSdsdsdsdSk...',
      '..kSdsdsdsdSk...',
      '...kkkkkkkkk....',
      '...kTTTyTTTk....',  // gold trunks with sash
      '...kTttytttk....',
      '....kss.ssk.....',
      '....kss.ssk.....',
      '....kssdssk.....',
      '.....kk.kk......',
    ],
  },
  // ============ STAGE 6 — BEAST MODE (red trunks, horns, flame aura) ============
  {
    palette: { ...BASE_PALETTE, H: '#1a0f1a', T: '#dc2626', t: '#7f1d1d', e: '#fef08a' },
    grid: [
      '.k.....FF.....k.',  // horns + flame tip
      'kkk...FfFF...kkk',
      '.k...FfffF....k.',
      'F.k.kHHHHHHk.k.F',  // flame aura sides
      'Ff.kHHkkkkHHk.fF',  // mohawk hair
      'fFkHsssssssHkFf.',
      'Ff.kHsWeWesHk.fF',  // glowing eye whites with yellow pupil
      'Ff..kHsssssHk.fF',
      'Ff..kssPPPssk.fF',
      'Ff...kkkLLkk..fF',  // lightning teeth/snarl
      'Ff....kssk....fF',
      'F.kkkkkkkkkkkk.F',  // mega traps
      'kSSSSsssssSSSSSk',
      'kSdsdSSSSSdsdSdk',  // MAX size shoulders
      'kSdsdSrrrrSdsSdk',  // red chest stripes
      'kSdsSSLLLLSSdSdk',  // big chest with lightning
      '.kSdSSSSSSSSdSk.',
      '..kssSSSSSSSSk..',
      '..kSdsdsdsdsdk..',  // 8-pack abs!
      '..kSdsdsdsdsdk..',
      '..kSdsdsdsdsdk..',
      '...kkkkkkkkkk...',
      '...kTTTLLTTTTk..',  // red trunks with lightning
      '...kTtttttttk...',
      '...kss....ssk...',
      '...kss....ssk...',
      '....kk....kk....',
    ],
  },
];
