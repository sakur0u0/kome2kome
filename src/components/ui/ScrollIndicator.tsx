"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface ScrollIndicatorProps {
  label: string;
  className?: string;
}

/** ヒーロー下部のスクロール誘導。細い縦線の中を金の光が繰り返し滑り落ちる */
export function ScrollIndicator({ label, className }: ScrollIndicatorProps) {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <span className="font-latin text-[10px] uppercase tracking-[0.45em] text-ivory/55">
        {label}
      </span>
      <span className="relative block h-16 w-px overflow-hidden bg-white/15">
        <motion.span
          aria-hidden
          className="absolute left-0 top-0 block h-8 w-px bg-gold"
          animate={{ y: [-32, 64] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
        />
      </span>
    </div>
  );
}
