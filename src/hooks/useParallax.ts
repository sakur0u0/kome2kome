"use client";

import { useScroll, useTransform, type MotionValue } from "framer-motion";
import type { RefObject } from "react";

/**
 * 要素がビューポートを通過する間に、上下へゆるやかに移動させるパララックス。
 * 画像や装飾文字に使い、スクロールへの追従で奥行きを出す。
 *
 * @param distance 通過中に移動させる総距離(px)。負の値で逆方向に動く
 */
export function useParallax<T extends HTMLElement>(
  target: RefObject<T | null>,
  distance = 60,
): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start end", "end start"],
  });
  return useTransform(scrollYProgress, [0, 1], [-distance / 2, distance / 2]);
}
