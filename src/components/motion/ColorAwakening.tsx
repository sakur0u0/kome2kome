"use client";

import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { cn } from "@/lib/utils/cn";

interface ColorAwakeningProps {
  src: string;
  alt: string;
  className?: string;
  aspectClassName?: string;
  sizes?: string;
  /** 完全にカラーになるまでのスクロール量（0〜1: 要素が画面中央に達する位置） */
  wakeAt?: number;
  /** 額縁（墨）を付ける */
  frame?: boolean;
  priority?: boolean;
}

/**
 * 「色の目覚め」。
 * 画面下から現れるときは水墨画のようなモノクロで、
 * 画面中央へ近づくにつれて彩度とコントラストを取り戻す。
 */
export function ColorAwakening({
  src,
  alt,
  className,
  aspectClassName = "aspect-[4/5]",
  sizes = "(min-width: 1024px) 45vw, 100vw",
  wakeAt = 0.55,
  frame = true,
  priority = false,
}: ColorAwakeningProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    // 要素の上端が画面下端に来た時 0、要素の中央が画面中央に来た時 1
    offset: ["start end", "center center"],
  });

  const progress = useTransform(scrollYProgress, [0.08, wakeAt, 1], [0, 0.85, 1]);
  const gray = useTransform(progress, (p) => (reduced ? 0 : 1 - p));
  const sepia = useTransform(progress, (p) => (reduced ? 0 : (1 - p) * 0.35));
  const contrast = useTransform(progress, (p) => (reduced ? 1 : 1.12 - p * 0.12));
  const scale = useTransform(progress, (p) => (reduced ? 1 : 1.08 - p * 0.08));
  const filter = useMotionTemplate`grayscale(${gray}) sepia(${sepia}) contrast(${contrast})`;

  return (
    <div ref={ref} className={cn("group relative", className)}>
      {frame && (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-3 border border-(--tone-line) transition-[transform,border-color] duration-700 ease-elegant group-hover:scale-[1.02] group-hover:border-(--tone-accent) md:-inset-4"
        />
      )}
      <div className={cn("relative overflow-hidden bg-washi-deep", aspectClassName)}>
        <motion.div style={{ filter, scale }} className="absolute inset-0 will-change-transform">
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            quality={75}
            priority={priority}
            className="object-cover"
          />
        </motion.div>
        {/* 紙の質感を上から薄く重ねる */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(26,26,26,0.18)_100%)]"
        />
      </div>
    </div>
  );
}
