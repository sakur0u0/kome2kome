"use client";

import { motion } from "framer-motion";
import { motifReveal } from "@/lib/motion";
import { cn } from "@/lib/utils/cn";

interface MotifProps {
  /** 背景に大きく敷く一文字 */
  children: string;
  className?: string;
}

/**
 * セクション背景の装飾漢字。極薄の明朝体で「気配」だけを残す。
 * 言語に依存しない意匠として常に明朝体で描く。
 */
export function Motif({ children, className }: MotifProps) {
  return (
    <motion.span
      aria-hidden
      variants={motifReveal}
      className={cn(
        "pointer-events-none absolute select-none font-kanji leading-none text-ivory/[0.035]",
        "text-[14rem] sm:text-[20rem] lg:text-[26rem]",
        className,
      )}
    >
      {children}
    </motion.span>
  );
}
