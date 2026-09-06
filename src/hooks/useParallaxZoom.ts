"use client";

import { useScroll, useTransform, type MotionValue } from "framer-motion";
import type { RefObject } from "react";

export interface UseParallaxZoomOptions {
  /** スクロール完了時に背景を下方向へ動かす距離(px) */
  distance?: number;
  /** スクロール完了時の追加スケール */
  zoom?: number;
  /** コンテンツをフェードアウトさせ終える進捗（0〜1） */
  fadeEnd?: number;
}

export interface ParallaxZoomValues {
  /** 背景レイヤーの translateY */
  y: MotionValue<number>;
  /** 背景レイヤーの scale（スクロールに応じて微増） */
  scale: MotionValue<number>;
  /** 前景コンテンツの opacity（スクロールで消えていく） */
  contentOpacity: MotionValue<number>;
  /** 前景コンテンツの translateY（背景より遅く動かして奥行きを出す） */
  contentY: MotionValue<number>;
  /** 0〜1 のスクロール進捗 */
  progress: MotionValue<number>;
}

/**
 * ヒーロー用パララックス。
 * セクションが画面上端から離れていく間、背景をゆっくり下げつつ僅かに拡大し、
 * 前景テキストは別速度で動かしてレイヤー感を演出する。
 */
export function useParallaxZoom<T extends HTMLElement>(
  target: RefObject<T | null>,
  { distance = 180, zoom = 0.12, fadeEnd = 0.7 }: UseParallaxZoomOptions = {},
): ParallaxZoomValues {
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, distance]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1 + zoom]);
  const contentOpacity = useTransform(scrollYProgress, [0, fadeEnd], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, distance * 0.45]);

  return { y, scale, contentOpacity, contentY, progress: scrollYProgress };
}
