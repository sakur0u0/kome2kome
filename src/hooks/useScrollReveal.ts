"use client";

import { useInView, type UseInViewOptions } from "framer-motion";
import { useRef } from "react";

export type RevealState = "hidden" | "visible";

export interface UseScrollRevealOptions {
  /** 一度表示されたら再び隠さない（既定: true） */
  once?: boolean;
  /** 要素のどれだけが見えたら発火するか（0〜1 or "some" | "all"） */
  amount?: UseInViewOptions["amount"];
  /** ビューポートのマージン。負の値で「もう少し奥に入ってから」発火させる */
  margin?: UseInViewOptions["margin"];
}

/**
 * スクロール連動アニメーションのフック。
 *
 * ```tsx
 * const { ref, state } = useScrollReveal();
 * <motion.section ref={ref} variants={staggerContainer()} initial="hidden" animate={state}>
 *   <motion.h2 variants={fadeUp}>…</motion.h2>
 * </motion.section>
 * ```
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>({
  once = true,
  amount = 0.25,
  margin = "0px 0px -10% 0px",
}: UseScrollRevealOptions = {}) {
  const ref = useRef<T | null>(null);
  const isInView = useInView(ref, { once, amount, margin });
  const state: RevealState = isInView ? "visible" : "hidden";

  return { ref, isInView, state } as const;
}
