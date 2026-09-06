"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import type { Dictionary } from "@/lib/i18n";
import { EASE_ELEGANT, EASE_SILK } from "@/lib/motion";
import { cn } from "@/lib/utils/cn";

interface InkMapProps {
  labels: Dictionary["way"]["map"];
  className?: string;
  ariaLabel: string;
}

const INK = "rgba(245,245,245,0.72)";
const INK_FAINT = "rgba(245,245,245,0.35)";
const SHU = "#b3262e";
const GOLD = "#d4af37";

/** 描画順（秒） */
const T = {
  river: 0,
  shijo: 0.5,
  hanamikoji: 1.1,
  torii: 1.5,
  route: 1.9,
  seal: 2.6,
  labels: 2.9,
} as const;

/**
 * 墨線で描く祇園の簡易地図。
 * 鴨川 → 四条通 → 花見小路 → 八坂神社の鳥居 → 駅からの道順 → 店の落款、の順に筆が走る。
 * 実際の縮尺ではなく、位置関係だけを伝える意匠。
 */
export function InkMap({ labels, className, ariaLabel }: InkMapProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();
  const on = inView || reduced;

  const stroke = (delay: number, duration = 1.1) => ({
    initial: reduced ? false : { pathLength: 0, opacity: 0 },
    animate: on ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 },
    transition: {
      pathLength: { duration, ease: EASE_SILK, delay },
      opacity: { duration: 0.01, delay },
    },
  });
  const fade = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 4 },
    animate: on ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 },
    transition: { duration: 0.9, ease: EASE_ELEGANT, delay },
  });

  return (
    <svg
      ref={ref}
      viewBox="0 0 600 420"
      role="img"
      aria-label={ariaLabel}
      className={cn("h-auto w-full overflow-visible", className)}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <filter id="map-brush" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="5" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      <g filter="url(#map-brush)">
        {/* 鴨川 */}
        <motion.path
          d="M58 20 C48 70 72 110 60 160 C48 210 74 260 62 310 C52 350 70 390 60 420"
          stroke={INK_FAINT}
          strokeWidth="10"
          {...stroke(T.river, 1.4)}
        />
        <motion.path
          d="M78 20 C68 70 92 110 80 160 C68 210 94 260 82 310 C72 350 90 390 80 420"
          stroke={INK_FAINT}
          strokeWidth="2"
          {...stroke(T.river + 0.1, 1.4)}
        />

        {/* 四条通 */}
        <motion.path d="M30 200 L560 200" stroke={INK} strokeWidth="5" {...stroke(T.shijo, 1.3)} />
        {/* 四条大橋 */}
        <motion.path d="M46 190 L96 190 M46 210 L96 210" stroke={INK} strokeWidth="2" {...stroke(T.shijo + 0.2, 0.6)} />

        {/* 花見小路 */}
        <motion.path d="M330 88 L330 340" stroke={INK} strokeWidth="3" {...stroke(T.hanamikoji, 1)} />
        {/* 脇道（気配） */}
        <motion.path d="M200 200 L200 300 M420 200 L420 270" stroke={INK_FAINT} strokeWidth="1.5" {...stroke(T.hanamikoji + 0.3, 0.8)} />

        {/* 八坂神社の鳥居 */}
        <motion.path d="M536 176 L536 120 M574 176 L574 120" stroke={SHU} strokeWidth="5" {...stroke(T.torii, 0.7)} />
        <motion.path d="M524 122 Q555 112 586 122" stroke={SHU} strokeWidth="6" {...stroke(T.torii + 0.35, 0.6)} />
        <motion.path d="M530 138 L580 138" stroke={SHU} strokeWidth="4" {...stroke(T.torii + 0.6, 0.5)} />

        {/* 駅からの道順（点線） */}
        <motion.path
          d="M120 212 L470 212 L470 226"
          stroke={GOLD}
          strokeWidth="2"
          strokeDasharray="4 8"
          {...stroke(T.route, 1.4)}
        />
      </g>

      {/* 祇園四条駅 */}
      <motion.g {...fade(T.labels)}>
        <circle cx="120" cy="200" r="6" fill="#0a0a0a" stroke={INK} strokeWidth="2" />
        <circle cx="120" cy="200" r="2" fill={INK} />
      </motion.g>

      {/* 店の落款 */}
      <motion.g
        initial={reduced ? false : { opacity: 0, scale: 1.6 }}
        animate={on ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.6 }}
        transition={{ type: "spring", stiffness: 420, damping: 24, delay: T.seal }}
        style={{ transformOrigin: "470px 244px" }}
      >
        <rect x="454" y="228" width="32" height="32" fill={SHU} transform="rotate(-4 470 244)" />
        <text
          x="470"
          y="255"
          textAnchor="middle"
          fontSize="22"
          fontFamily="var(--font-brush)"
          fill="#f5f5f5"
          transform="rotate(-4 470 244)"
        >
          米
        </text>
      </motion.g>
      {/* 呼吸する輪 */}
      <motion.circle
        cx="470"
        cy="244"
        r="26"
        stroke={GOLD}
        strokeWidth="1"
        initial={{ opacity: 0 }}
        animate={on && !reduced ? { opacity: [0, 0.7, 0], scale: [0.7, 1.4, 1.4] } : { opacity: 0 }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut", delay: T.seal + 0.4 }}
        style={{ transformOrigin: "470px 244px" }}
      />

      {/* ラベル */}
      <g fontFamily="var(--font-display)" fontSize="13" letterSpacing="0.15em" fill="rgba(245,245,245,0.7)">
        <motion.text x="96" y="52" {...fade(T.labels)} style={{ writingMode: "vertical-rl" }}>
          {labels.kamo}
        </motion.text>
        <motion.text x="230" y="186" {...fade(T.labels + 0.1)}>
          {labels.shijo}
        </motion.text>
        <motion.text x="342" y="330" {...fade(T.labels + 0.2)}>
          {labels.hanamikoji}
        </motion.text>
        <motion.text x="555" y="104" textAnchor="middle" fill={SHU} {...fade(T.labels + 0.3)}>
          {labels.yasaka}
        </motion.text>
        <motion.text x="120" y="236" textAnchor="middle" fontSize="11" {...fade(T.labels + 0.4)}>
          {labels.station}
        </motion.text>
        <motion.text x="470" y="290" textAnchor="middle" fill={GOLD} fontSize="14" {...fade(T.labels + 0.5)}>
          {labels.here}
        </motion.text>
      </g>
    </svg>
  );
}
