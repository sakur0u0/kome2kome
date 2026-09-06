"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface MonbranDrawingProps {
  /** 0 → 1 のスクロール進捗 */
  progress: MotionValue<number>;
  className?: string;
  label?: string;
}

/** 決定的な擬似乱数（描画が毎回同じになるように） */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 400;
const H = 540;
const CX = 200;
const CUP_TOP = 340;
const MOUND_TOP = 130;
const STRANDS = 84;
/** 絞りが始まる / 終わる進捗 */
const PIPE_START = 0.12;
const PIPE_END = 0.74;
const TOPPING_START = 0.76;
const TOPPING_END = 0.9;
const FLASH_START = 0.9;

interface Strand {
  d: string;
  width: number;
  color: string;
  start: number;
  end: number;
}

interface Dot {
  x: number;
  y: number;
  r: number;
  color: string;
  delay: number;
}

function buildStrands(): Strand[] {
  const rand = mulberry32(20260311);
  const strands: Strand[] = [];
  for (let i = 0; i < STRANDS; i++) {
    const layer = i / (STRANDS - 1);
    // 下は広く、上に行くほど狭くなる山
    // 最下層は器の縁にかかり、上に行くほど狭くなる山
    const baseY = CUP_TOP + 2 - layer * (CUP_TOP + 2 - MOUND_TOP);
    const halfWidth = 12 + 80 * Math.pow(1 - layer, 0.8);
    const segments = 5 + Math.floor(rand() * 4);
    let x = CX + (rand() * 2 - 1) * halfWidth * 0.8;
    let y = baseY + (rand() * 2 - 1) * 5;
    let d = `M${x.toFixed(1)},${y.toFixed(1)}`;
    for (let s = 0; s < segments; s++) {
      const dir = rand() > 0.5 ? 1 : -1;
      const nx = Math.max(CX - halfWidth, Math.min(CX + halfWidth, x + dir * (28 + rand() * 46)));
      const ny = baseY + (rand() * 2 - 1) * 9;
      const c1x = x + (nx - x) * 0.3 + (rand() * 2 - 1) * 22;
      const c1y = y + (rand() * 2 - 1) * 26;
      const c2x = x + (nx - x) * 0.7 + (rand() * 2 - 1) * 22;
      const c2y = ny + (rand() * 2 - 1) * 26;
      d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${nx.toFixed(1)},${ny.toFixed(1)}`;
      x = nx;
      y = ny;
    }
    // 上層ほど、ほんのり金を帯びる
    const gold = Math.max(0, layer - 0.55) / 0.45;
    const color = gold > 0 ? mix("#f5f1e6", "#e9d18a", gold * 0.55) : "#f5f1e6";
    const start = PIPE_START + layer * (PIPE_END - PIPE_START) * 0.92;
    strands.push({ d, width: 1.9 + rand() * 1.0, color, start, end: Math.min(PIPE_END, start + 0.09) });
  }
  return strands;
}

function buildToppings(): { ponkashi: Dot[]; goma: Dot[] } {
  const rand = mulberry32(777);
  const ponkashi: Dot[] = [];
  const goma: Dot[] = [];
  for (let i = 0; i < 14; i++) {
    const t = rand();
    const y = MOUND_TOP + 10 + t * 120;
    const hw = 14 + 70 * Math.pow((y - MOUND_TOP) / (CUP_TOP - MOUND_TOP), 0.8);
    ponkashi.push({
      x: CX + (rand() * 2 - 1) * hw,
      y,
      r: 3.2 + rand() * 2.6,
      color: rand() > 0.5 ? "#e8d9b8" : "#d9c49a",
      delay: rand(),
    });
  }
  for (let i = 0; i < 22; i++) {
    const t = rand();
    const y = MOUND_TOP + 6 + t * 110;
    const hw = 12 + 66 * Math.pow((y - MOUND_TOP) / (CUP_TOP - MOUND_TOP), 0.8);
    goma.push({
      x: CX + (rand() * 2 - 1) * hw,
      y,
      r: 0.9 + rand() * 0.8,
      color: rand() > 0.4 ? "#111" : "#fafafa",
      delay: rand(),
    });
  }
  return { ponkashi, goma };
}

function mix(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (shift: number) => {
    const va = (pa >> shift) & 255;
    const vb = (pb >> shift) & 255;
    return Math.round(va + (vb - va) * t);
  };
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
}

/** 描画データは決定的なので、モジュール読み込み時に一度だけ生成する */
const STRAND_DATA = buildStrands();
const TOPPING_DATA = buildToppings();

/**
 * お米のクリームが器に積み重なっていく線描。
 * 進捗 0.12〜0.74 で 48 本の線が下から順に描かれ、
 * 0.76〜0.9 でポン菓子とごま塩が落ち、0.9〜1 で金の光とシャッターの輪が広がる。
 */
export function MonbranDrawing({ progress, className, label }: MonbranDrawingProps) {
  const strands = STRAND_DATA;
  const toppings = TOPPING_DATA;

  const cupOpacity = useTransform(progress, [0, 0.08], [0.35, 1]);
  const nozzleOpacity = useTransform(progress, [PIPE_START - 0.04, PIPE_START, PIPE_END, PIPE_END + 0.04], [0, 1, 1, 0]);
  const flowY2 = useTransform(progress, [PIPE_START, PIPE_END], [CUP_TOP - 8, MOUND_TOP]);
  const glowOpacity = useTransform(progress, [FLASH_START, 1], [0, 1]);
  const ringScale = useTransform(progress, [FLASH_START, 1], [0.7, 1.35]);
  const ringOpacity = useTransform(progress, [FLASH_START, FLASH_START + 0.03, 1], [0, 0.9, 0]);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={cn("h-full w-auto max-w-full", className)}
      role="img"
      aria-label={label}
    >
      <defs>
        <radialGradient id="mb-glow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#e9d18a" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#d4af37" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="mb-cup" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#050505" />
          <stop offset="45%" stopColor="#181818" />
          <stop offset="100%" stopColor="#070707" />
        </linearGradient>
        <filter id="mb-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.35" />
        </filter>
      </defs>

      {/* 金の光（最後） */}
      <motion.circle cx={CX} cy={250} r={230} fill="url(#mb-glow)" style={{ opacity: glowOpacity }} />

      {/* 器 */}
      <motion.g style={{ opacity: cupOpacity }}>
        <ellipse cx={CX} cy={H - 24} rx={92} ry={10} fill="#000" opacity="0.5" />
        <path
          d={`M${CX - 86},${CUP_TOP} L${CX + 86},${CUP_TOP} L${CX + 62},${H - 30} L${CX - 62},${H - 30} Z`}
          fill="url(#mb-cup)"
          stroke="rgba(245,245,245,0.14)"
          strokeWidth="1"
        />
        <ellipse cx={CX} cy={CUP_TOP} rx={86} ry={9} fill="#1c1c1c" stroke="rgba(245,245,245,0.22)" strokeWidth="1" />
        {/* 「米」の印 */}
        <g transform={`translate(${CX - 24} ${CUP_TOP + 62})`}>
          <rect width="48" height="48" fill="#f5f1e6" transform="rotate(-2 24 24)" />
          <text
            x="24"
            y="33"
            textAnchor="middle"
            fontSize="30"
            fontFamily="var(--font-brush)"
            fill="#1a1a1a"
            transform="rotate(-2 24 24)"
          >
            米
          </text>
          <rect x="35" y="35" width="7" height="7" fill="#b3262e" transform="rotate(-2 24 24)" />
        </g>
      </motion.g>

      {/* ノズルと、落ちていく一本の糸 */}
      <motion.g style={{ opacity: nozzleOpacity }}>
        <path d={`M${CX - 14},0 L${CX + 14},0 L${CX + 7},26 L${CX - 7},26 Z`} fill="#2a2a2a" stroke="rgba(245,245,245,0.2)" />
        <motion.line
          x1={CX}
          y1={26}
          x2={CX}
          y2={flowY2}
          stroke="#f5f1e6"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.9"
        />
      </motion.g>

      {/* お米のクリーム */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#mb-soft)">
        {strands.map((strand, index) => (
          <StrandPath key={index} strand={strand} progress={progress} />
        ))}
      </g>

      {/* ポン菓子・ごま塩 */}
      {toppings.ponkashi.map((dot, index) => (
        <ToppingDot key={`p-${index}`} dot={dot} progress={progress} stroke="rgba(0,0,0,0.25)" />
      ))}
      {toppings.goma.map((dot, index) => (
        <ToppingDot key={`g-${index}`} dot={dot} progress={progress} />
      ))}

      {/* シャッターの輪 */}
      <motion.circle
        cx={CX}
        cy={250}
        r={150}
        fill="none"
        stroke="#e9d18a"
        strokeWidth="1"
        style={{ scale: ringScale, opacity: ringOpacity, transformOrigin: `${CX}px 250px` }}
      />
    </svg>
  );
}

function StrandPath({ strand, progress }: { strand: Strand; progress: MotionValue<number> }) {
  const pathLength = useTransform(progress, [strand.start, strand.end], [0, 1]);
  const opacity = useTransform(progress, [strand.start, strand.start + 0.005], [0, 0.95]);
  return (
    <motion.path
      d={strand.d}
      stroke={strand.color}
      strokeWidth={strand.width}
      style={{ pathLength, opacity }}
    />
  );
}

function ToppingDot({ dot, progress, stroke }: { dot: Dot; progress: MotionValue<number>; stroke?: string }) {
  const at = TOPPING_START + dot.delay * (TOPPING_END - TOPPING_START - 0.04);
  const scale = useTransform(progress, [at, at + 0.04], [0, 1]);
  const y = useTransform(progress, [at, at + 0.04], [dot.y - 40, dot.y]);
  const opacity = useTransform(progress, [at, at + 0.01], [0, 1]);
  return (
    <motion.circle
      cx={dot.x}
      cy={y}
      r={dot.r}
      fill={dot.color}
      stroke={stroke}
      strokeWidth={stroke ? 0.6 : 0}
      style={{ scale, opacity, transformOrigin: `${dot.x}px ${dot.y}px` }}
    />
  );
}
