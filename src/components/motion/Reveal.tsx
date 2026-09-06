"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import { useScrollReveal, type UseScrollRevealOptions } from "@/hooks/useScrollReveal";
import { staggerContainer } from "@/lib/motion";

export interface RevealProps
  extends Omit<HTMLMotionProps<"div">, "variants" | "initial" | "animate" | "ref">,
    UseScrollRevealOptions {
  /** 子要素の出現間隔（秒） */
  stagger?: number;
  /** 最初の子が出現するまでの遅延（秒） */
  delayChildren?: number;
  /** コンテナ自身の Variants を差し替えたい場合 */
  variants?: Variants;
}

/**
 * スクロールで表示領域に入ったとき、子要素（variants を持つ motion 要素）を
 * 順番に出現させるコンテナ。useScrollReveal フックの薄いラッパー。
 */
export function Reveal({
  children,
  stagger = 0.18,
  delayChildren = 0,
  once,
  amount,
  margin,
  variants,
  ...rest
}: RevealProps) {
  const { ref, state } = useScrollReveal<HTMLDivElement>({ once, amount, margin });

  return (
    <motion.div
      ref={ref}
      variants={variants ?? staggerContainer(stagger, delayChildren)}
      initial="hidden"
      animate={state}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
