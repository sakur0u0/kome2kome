"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { hoverTransition } from "@/lib/motion";
import { cn } from "@/lib/utils/cn";

type Variant = "outline" | "solid";
type Size = "md" | "lg";

interface GoldButtonProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** 新しいタブで開く */
  external?: boolean;
  className?: string;
  onClick?: () => void;
}

const GLOW_REST = "0 0 0px rgba(212, 175, 55, 0)";
const GLOW_HOVER = "0 0 44px rgba(212, 175, 55, 0.38)";

const variantClasses: Record<Variant, string> = {
  outline:
    "border border-gold/60 text-gold hover:border-gold hover:bg-gold/10",
  solid:
    "border border-gold bg-[linear-gradient(115deg,#b8942a_0%,#e9d18a_45%,#d4af37_70%,#b8942a_100%)] text-base",
};

const sizeClasses: Record<Size, string> = {
  md: "px-8 py-3.5 text-[13px]",
  lg: "px-12 py-5 text-sm md:text-[15px]",
};

/**
 * ゴールドのボタン。
 * ホバーで Scale 1.05 + 金のグロー、光沢がスッと横切るシマーを備える。
 */
export function GoldButton({
  href,
  children,
  variant = "outline",
  size = "md",
  external = false,
  className,
  onClick,
}: GoldButtonProps) {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "group relative inline-flex items-center justify-center gap-4 overflow-hidden",
        "font-display tracking-[0.22em] transition-colors duration-500",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      initial={{ boxShadow: GLOW_REST }}
      whileHover={{ scale: 1.05, boxShadow: GLOW_HOVER }}
      whileTap={{ scale: 0.98 }}
      transition={hoverTransition}
    >
      {/* シマー（光沢） */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 -translate-x-full",
          "bg-[linear-gradient(105deg,transparent_30%,rgba(255,255,255,0.28)_50%,transparent_70%)]",
          "transition-transform duration-[1100ms] ease-elegant group-hover:translate-x-full",
        )}
      />
      <span className="relative whitespace-nowrap">{children}</span>
      <span
        aria-hidden
        className={cn(
          "relative h-px w-6 transition-all duration-500 ease-elegant group-hover:w-10",
          variant === "solid" ? "bg-base/70" : "bg-gold",
        )}
      />
    </motion.a>
  );
}
