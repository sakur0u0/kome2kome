"use client";

import { motion } from "framer-motion";
import { fadeUp, lineGrow } from "@/lib/motion";
import { cn } from "@/lib/utils/cn";

interface SectionLabelProps {
  /** "01" のような通し番号 */
  index: string;
  /** ラテン文字のセクション名（Concept など） */
  children: string;
  align?: "left" | "center";
  className?: string;
}

/**
 * セクション冒頭の小さなラベル。「01 ―― Concept」のように番号と名称を金の線でつなぐ。
 * 親の <Reveal> から hidden / visible を継承する。
 */
export function SectionLabel({ index, children, align = "left", className }: SectionLabelProps) {
  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        "flex items-center gap-4 text-gold",
        align === "center" && "justify-center",
        className,
      )}
    >
      <span className="font-latin text-xs tracking-[0.35em]">{index}</span>
      <motion.span
        aria-hidden
        variants={lineGrow}
        className="h-px w-12 origin-left bg-gold/60"
      />
      <span className="font-latin text-xs uppercase tracking-[0.35em]">{children}</span>
    </motion.div>
  );
}
