import type { ReactNode } from 'react';

// Generated cover art for projects that don't have screenshots yet.
// Each piece is a stylised nod to what the project does; values in the
// shapes are illustrative, and only resume-backed numbers appear as text. To use a real
// screenshot instead, set `image` on the project in Work.tsx.

const ACCENT = '#E2FF00';
const GOLD = '#D4AF37';
const LIGHT = '#F5F2ED';

// Deterministic pseudo-random so the art is stable across renders
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function Frame({ children, glow = GOLD }: { children: ReactNode; glow?: string }) {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        {/* Solid pre-mixed stops: a translucent stop blends badly into an opaque one */}
        <radialGradient id={`bg-${glow.slice(1)}`} cx="70%" cy="20%" r="90%">
          <stop offset="0" stopColor={glow === ACCENT ? '#292b12' : '#272318'} />
          <stop offset="0.55" stopColor="#141414" />
          <stop offset="1" stopColor="#0c0c0c" />
        </radialGradient>
        <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill={LIGHT} fillOpacity="0.07" />
        </pattern>
      </defs>
      <rect width="800" height="500" fill={`url(#bg-${glow.slice(1)})`} />
      <rect width="800" height="500" fill="url(#dots)" />
      {children}
    </svg>
  );
}

function Panel({ x, y, w, h, title }: { x: number; y: number; w: number; h: number; title: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="10" fill="#0a0a0a" fillOpacity="0.75" stroke={LIGHT} strokeOpacity="0.1" />
      <text x={x + 16} y={y + 26} fill={LIGHT} fillOpacity="0.45" fontSize="11" fontFamily="monospace" letterSpacing="2">
        {title}
      </text>
    </g>
  );
}

function EcoSense() {
  const r = rng(7);
  const cities = Array.from({ length: 22 }, () => ({ x: 90 + r() * 360, y: 70 + r() * 360, v: r() }));
  const trend = Array.from({ length: 24 }, (_, i) => 60 + Math.sin(i / 3) * 18 + r() * 14);
  return (
    <Frame glow={ACCENT}>
      {/* contour lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse key={i} cx="270" cy="250" rx={80 + i * 45} ry={60 + i * 38} fill="none" stroke={LIGHT} strokeOpacity={0.06} strokeDasharray="4 6" />
      ))}
      {cities.map((c, i) => (
        <g key={i}>
          <circle cx={c.x} cy={c.y} r={6 + c.v * 22} fill={c.v > 0.7 ? GOLD : ACCENT} fillOpacity={0.08 + c.v * 0.1} />
          <circle cx={c.x} cy={c.y} r="3" fill={c.v > 0.7 ? GOLD : ACCENT} />
        </g>
      ))}
      <Panel x={500} y={60} w={250} h={150} title="AQI · 24H" />
      <polyline
        points={trend.map((v, i) => `${520 + i * 9.5},${190 - v}`).join(' ')}
        fill="none"
        stroke={ACCENT}
        strokeWidth="2"
      />
      <Panel x={500} y={230} w={250} h={200} title="SOURCES" />
      {['API 01', 'API 02', 'API 03', 'API 04', 'API 05', 'API 06', 'API 07'].map((s, i) => (
        <g key={s}>
          <rect x={516} y={262 + i * 22} width={40 + ((i * 37) % 150)} height="10" rx="5" fill={i % 3 === 0 ? GOLD : LIGHT} fillOpacity={i % 3 === 0 ? 0.8 : 0.18} />
          <text x={726} y={271 + i * 22} fill={LIGHT} fillOpacity="0.4" fontSize="10" fontFamily="monospace" textAnchor="end">
            {s}
          </text>
        </g>
      ))}
    </Frame>
  );
}

function IRAIS() {
  const classes = [
    { label: 'SLIGHT', v: 0.92 },
    { label: 'SERIOUS', v: 0.81 },
    { label: 'FATAL', v: 0.74 },
  ];
  const matrix = [
    [0.92, 0.06, 0.02],
    [0.11, 0.81, 0.08],
    [0.05, 0.21, 0.74],
  ];
  return (
    <Frame>
      <Panel x={50} y={50} w={330} h={400} title="SEVERITY CLASSES" />
      {classes.map((c, i) => (
        <g key={c.label}>
          <rect x={80 + i * 95} y={420 - c.v * 300} width="60" height={c.v * 300} rx="6" fill={i === 2 ? GOLD : LIGHT} fillOpacity={i === 2 ? 0.9 : 0.2 + i * 0.1} />
          <text x={110 + i * 95} y={440} fill={LIGHT} fillOpacity="0.4" fontSize="10" fontFamily="monospace" textAnchor="middle" letterSpacing="1">
            {c.label}
          </text>
        </g>
      ))}
      <Panel x={410} y={50} w={340} h={260} title="MODEL COMPARISON · RF / XGB" />
      {matrix.map((row, i) =>
        row.map((v, j) => (
          <g key={`${i}${j}`}>
            <rect x={450 + j * 90} y={85 + i * 70} width="84" height="64" rx="6" fill={i === j ? ACCENT : LIGHT} fillOpacity={i === j ? v * 0.85 : v * 0.6} />
          </g>
        )),
      )}
      <Panel x={410} y={330} w={340} h={120} title="FEATURES" />
      <text x={430} y={410} fill={LIGHT} fontSize="56" fontFamily="sans-serif" fontWeight="700">26</text>
      <text x={520} y={395} fill={LIGHT} fillOpacity="0.5" fontSize="12" fontFamily="monospace">engineered</text>
      <text x={520} y={413} fill={GOLD} fontSize="12" fontFamily="monospace">+ SMOTE balanced</text>
    </Frame>
  );
}

function ThreatDetection() {
  const r = rng(42);
  const nodes = Array.from({ length: 46 }, (_, i) => {
    const cluster = i % 3;
    const cx = [230, 520, 400][cluster];
    const cy = [200, 170, 360][cluster];
    return { x: cx + (r() - 0.5) * 220, y: cy + (r() - 0.5) * 170, anomaly: i === 7 || i === 23 || i === 38 };
  });
  const edges: [number, number][] = [];
  nodes.forEach((a, i) =>
    nodes.forEach((b, j) => {
      if (j > i && Math.hypot(a.x - b.x, a.y - b.y) < 85) edges.push([i, j]);
    }),
  );
  return (
    <Frame glow={ACCENT}>
      {edges.map(([i, j]) => (
        <line key={`${i}-${j}`} x1={nodes[i].x} y1={nodes[i].y} x2={nodes[j].x} y2={nodes[j].y} stroke={LIGHT} strokeOpacity="0.09" />
      ))}
      {nodes.map((n, i) =>
        n.anomaly ? (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="26" fill="none" stroke={ACCENT} strokeOpacity="0.5" strokeDasharray="3 4" />
            <circle cx={n.x} cy={n.y} r="7" fill={ACCENT} />
          </g>
        ) : (
          <circle key={i} cx={n.x} cy={n.y} r="4" fill={LIGHT} fillOpacity="0.45" />
        ),
      )}
      <Panel x={560} y={330} w={200} h={120} title="SESSIONS" />
      <text x={578} y={405} fill={LIGHT} fontSize="40" fontFamily="sans-serif" fontWeight="700">175K</text>
      <text x={578} y={430} fill={ACCENT} fontSize="11" fontFamily="monospace">anomaly consensus</text>
    </Frame>
  );
}

function LoopedLies() {
  return (
    <Frame>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <circle
          key={i}
          cx="400"
          cy="250"
          r={50 + i * 34}
          fill="none"
          stroke={i === 3 ? GOLD : LIGHT}
          strokeOpacity={i === 3 ? 0.7 : 0.08 + (6 - i) * 0.01}
          strokeWidth={i === 3 ? 1.5 : 1}
          strokeDasharray={i % 2 ? '2 10' : undefined}
        />
      ))}
      {/* clock hand */}
      <line x1="400" y1="250" x2="400" y2="120" stroke={GOLD} strokeWidth="2" strokeLinecap="round" />
      <line x1="400" y1="250" x2="490" y2="290" stroke={LIGHT} strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="400" cy="250" r="5" fill={GOLD} />
      <text x="400" y="438" fill={LIGHT} fillOpacity="0.5" fontSize="12" fontFamily="monospace" textAnchor="middle" letterSpacing="6">
        742-ITERATION TIME LOOP
      </text>
      <text x="60" y="95" fill={LIGHT} fillOpacity="0.35" fontSize="11" fontFamily="monospace" letterSpacing="3">5 ACTS</text>
      <text x="740" y="95" fill={LIGHT} fillOpacity="0.35" fontSize="11" fontFamily="monospace" letterSpacing="3" textAnchor="end">3 ENDINGS</text>
    </Frame>
  );
}

const art = {
  ecosense: EcoSense,
  irais: IRAIS,
  threat: ThreatDetection,
  looped: LoopedLies,
};

export type ArtKind = keyof typeof art;

export function ProjectArt({ kind }: { kind: ArtKind }) {
  const Art = art[kind];
  return <Art />;
}
