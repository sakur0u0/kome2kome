"use client";

import { motion, type Variants } from "framer-motion";
import { EASE_ELEGANT } from "@/lib/motion";
import { cn } from "@/lib/utils/cn";

interface VerticalTypeProps {
  /** 行ごとの文字列 */
  lines: readonly string[];
  className?: string;
  lineClassName?: string;
  /** 縦書きにする（欧文では false にして横組みで出す） */
  vertical?: boolean;
  /** 1 文字ごとの間隔（秒） */
  stagger?: number;
  delay?: number;
  /**
   * 表示状態を直接指定する。FadeSwap など animate を持つ要素の内側では
   * 親の variants が伝播しないため、こちらで制御する
   */
  active?: boolean;
}

/** custom に遅延秒を渡す（variants 側の transition が優先されるため） */
const charVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(6px)", y: 6 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.9, ease: EASE_ELEGANT, delay },
  }),
};

/**
 * 一文字ずつ墨で置くように現れる見出し。
 * 縦書き時は右から左へ行が並ぶ（writing-mode: vertical-rl）。
 * 親の "hidden" / "visible" を継承する。
 */
export function VerticalType({
  lines,
  className,
  lineClassName,
  vertical = true,
  stagger = 0.045,
  delay = 0,
  active,
}: VerticalTypeProps) {
  let counter = 0;
  const controlled = active !== undefined;

  return (
    <span
      className={cn(
        // vertical-rl では flex の column 方向が block 軸（右→左）になるため、
        // flex-col で「1 行目が最も右」の縦書きレイアウトになる
        vertical ? "writing-vertical flex flex-col gap-[0.6em]" : "flex flex-col",
        className,
      )}
    >
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className={cn("block whitespace-nowrap", lineClassName)}>
          {Array.from(line).map((char, charIndex) => {
            const order = counter++;
            return (
              <motion.span
                key={`${lineIndex}-${charIndex}`}
                variants={charVariants}
                custom={delay + order * stagger}
                initial={controlled ? "hidden" : undefined}
                animate={controlled ? (active ? "visible" : "hidden") : undefined}
                className="inline-block"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </span>
  );
}
