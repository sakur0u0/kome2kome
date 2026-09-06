"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface SealStampProps {
  /** 印に入れる文字（壱・弐・参 など 1〜2 文字） */
  children: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  /** 落款を少し傾ける（度） */
  tilt?: number;
  /** 親の variants（hidden / visible）を継承せず即時表示する */
  static?: boolean;
}

const sizeClasses = {
  sm: "h-9 w-9 text-[15px]",
  md: "h-14 w-14 text-2xl",
  lg: "h-20 w-20 text-4xl",
} as const;

/** 印を押す：やや大きく浮いた状態から、ばね運動で紙に落ちる */
export const stampVariants: Variants = {
  hidden: { opacity: 0, scale: 1.5, rotate: -8 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 520, damping: 26, mass: 0.9 },
  },
};

/**
 * 朱の落款。章番号やバッジに使う。
 * 内側の放射グラデーションとノイズで、印肉の不均一なつき方を表現する。
 */
export function SealStamp({ children, className, size = "md", tilt = -3, static: isStatic = false }: SealStampProps) {
  return (
    <motion.span
      aria-hidden
      variants={isStatic ? undefined : stampVariants}
      style={{ rotate: isStatic ? tilt : undefined }}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-[3px] font-brush leading-none text-ivory",
        "bg-[radial-gradient(circle_at_35%_30%,#c9333c_0%,#b3262e_55%,#8e1c22_100%)]",
        "shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.18),0_1px_0_rgba(0,0,0,0.25)]",
        "[mask-image:radial-gradient(circle_at_50%_50%,#000_60%,rgba(0,0,0,0.85)_100%)]",
        sizeClasses[size],
        className,
      )}
    >
      <span style={{ transform: `rotate(${isStatic ? 0 : tilt}deg)` }}>{children}</span>
    </motion.span>
  );
}
