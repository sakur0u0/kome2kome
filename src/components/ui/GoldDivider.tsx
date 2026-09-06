"use client";

import { motion } from "framer-motion";
import { fadeIn, lineGrow } from "@/lib/motion";
import { cn } from "@/lib/utils/cn";

interface GoldDividerProps {
  className?: string;
  /** 中央の菱形を省いて線のみにする */
  plain?: boolean;
}

/**
 * 中央から左右へ伸びる金のヘアライン。中央に小さな菱形を置く。
 * 親の <Reveal> から hidden / visible を継承する。
 */
export function GoldDivider({ className, plain = false }: GoldDividerProps) {
  return (
    <div aria-hidden className={cn("flex items-center justify-center gap-4", className)}>
      <motion.span variants={lineGrow} className="h-px w-24 origin-right hairline-gold" />
      {!plain && (
        <motion.span
          variants={fadeIn}
          className="block h-1.5 w-1.5 rotate-45 border border-gold/80"
        />
      )}
      <motion.span variants={lineGrow} className="h-px w-24 origin-left hairline-gold" />
    </div>
  );
}
