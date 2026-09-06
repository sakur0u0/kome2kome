"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { swapTransition } from "@/lib/motion";

interface FadeSwapProps {
  /** この値が変わるとクロスフェードで中身を入れ替える（通常は locale） */
  id: string;
  children: ReactNode;
  className?: string;
  /** インラインではなくブロック要素として描画 */
  block?: boolean;
}

/**
 * 言語切り替え時にテキストをふわりと入れ替えるためのラッパー。
 * 親の見出しや段落の中に置き、id（locale）をキーに退場 → 登場を行う。
 */
export function FadeSwap({ id, children, className, block = false }: FadeSwapProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={id}
        className={[block ? "block" : "inline-block", className].filter(Boolean).join(" ")}
        initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
        transition={swapTransition}
      >
        {children}
      </motion.span>
    </AnimatePresence>
  );
}
