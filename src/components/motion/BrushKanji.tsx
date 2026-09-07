"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
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

/** 一画の描き始めから次の一画が始まるまでの間隔（一画の所要時間に対する比） */
const STROKE_OVERLAP = 0.82;

/**
 * KanjiVG の筆順パスを一画ずつ描く「筆文字」。
 *
 * 掠れ（feTurbulence + feDisplacementMap）は描き終わってから乗せる。
 * フィルタ付きの SVG が動くと Safari は毎フレーム全体を再ラスタライズして
 * カクつくため、描画中は素の線で描き、静止後に一度だけフィルタを適用する。
 * タッチ端末（≒ モバイル）ではフィルタ自体を省略してメモリを節約する。
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
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const filterId = useId();
  const { strokes, char } = KANJI_STROKES[kanji];
  const shown = active ?? inView;
  const [settled, setSettled] = useState(false);

  // 全画を描き終えたタイミングで「静止」扱いにする
  useEffect(() => {
    if (!shown) return;
    if (reduced) {
      const id = window.setTimeout(() => setSettled(true), 0);
      return () => window.clearTimeout(id);
    }
    const total = delay + (strokes.length - 1) * strokeDuration * STROKE_OVERLAP + strokeDuration;
    const id = window.setTimeout(() => setSettled(true), total * 1000 + 80);
    return () => window.clearTimeout(id);
  }, [shown, reduced, delay, strokeDuration, strokes.length]);

  const useFilter = settled && finePointer;

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
      {finePointer && (
        <defs>
          <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.6" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      )}
      <g
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={useFilter ? `url(#${filterId})` : undefined}
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
                delay: delay + index * strokeDuration * STROKE_OVERLAP,
              },
              opacity: { duration: 0.01, delay: delay + index * strokeDuration * STROKE_OVERLAP },
            }}
          />
        ))}
      </g>
    </svg>
  );
}
