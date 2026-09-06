"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useId, useRef } from "react";
import { KANJI_STROKES, type KanjiKey } from "@/lib/kanji/strokes";
import { EASE_SILK } from "@/lib/motion";
import { cn } from "@/lib/utils/cn";

interface BrushKanjiProps {
  kanji: KanjiKey;
  className?: string;
  /** 線の色（CSS カラー） */
  color?: string;
  /** 線の太さ（viewBox 109 基準） */
  strokeWidth?: number;
  /** 一画あたりの所要時間（秒） */
  strokeDuration?: number;
  /** 描き始めまでの遅延（秒） */
  delay?: number;
  /** 描き終えた線を薄く残す（背景モチーフ用） */
  opacity?: number;
  /** 親から表示状態を制御する場合 */
  active?: boolean;
  once?: boolean;
  amount?: number;
  /** ラベル（装飾のみなら省略で aria-hidden） */
  label?: string;
}

/**
 * KanjiVG の筆順パスを一画ずつ描く「筆文字」。
 * feTurbulence + feDisplacementMap で輪郭をわずかに揺らし、筆の掠れを出す。
 */
export function BrushKanji({
  kanji,
  className,
  color = "currentColor",
  strokeWidth = 7,
  strokeDuration = 0.55,
  delay = 0,
  opacity = 1,
  active,
  once = true,
  amount = 0.4,
  label,
}: BrushKanjiProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once, amount });
  const reduced = useReducedMotion();
  const filterId = useId();
  const { strokes, char } = KANJI_STROKES[kanji];
  const shown = active ?? inView;

  return (
    <svg
      ref={ref}
      viewBox="0 0 109 109"
      className={cn("overflow-visible", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ opacity }}
    >
      <title>{label ?? char}</title>
      <defs>
        <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${filterId})`}
      >
        {strokes.map((d, index) => (
          <motion.path
            key={index}
            d={d}
            initial={reduced ? false : { pathLength: 0, opacity: 0 }}
            animate={
              shown || reduced
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: 0, opacity: 0 }
            }
            transition={{
              pathLength: {
                duration: strokeDuration,
                ease: EASE_SILK,
                delay: delay + index * strokeDuration * 0.82,
              },
              opacity: { duration: 0.01, delay: delay + index * strokeDuration * 0.82 },
            }}
          />
        ))}
      </g>
    </svg>
  );
}
