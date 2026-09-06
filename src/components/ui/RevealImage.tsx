"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { useParallax } from "@/hooks/useParallax";
import { EASE_ELEGANT, curtain, imageFrame, imageZoom } from "@/lib/motion";
import { cn } from "@/lib/utils/cn";

interface RevealImageProps {
  src: string;
  alt: string;
  className?: string;
  /** アスペクト比のクラス（既定 4:5） */
  aspectClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** スクロール通過中の上下移動量(px)。0 で無効 */
  parallax?: number;
  /** 外側に金のオフセット枠を描く */
  frame?: boolean;
}

/** 金のオフセット枠：少し遅れて浮かび上がる */
const frameOffset: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.6, ease: EASE_ELEGANT, delay: 0.5 },
  },
};

/**
 * スクロールで「幕が上がる」ように現れる画像。
 * - 親の <Reveal> / セクションから hidden / visible を継承（Framer Motion の variants 伝播）
 * - ホバーで Scale 1.05 + 金のグロー。
 *   ※ ホバーは CSS の `scale` / `box-shadow` で実装している。
 *     whileHover にバリアント名を渡すと、その要素が「バリアント制御ノード」になり
 *     子要素への hidden / visible の伝播が途切れるため。
 * - スクロールに追従する控えめなパララックス
 */
export function RevealImage({
  src,
  alt,
  className,
  aspectClassName = "aspect-[4/5]",
  sizes = "(min-width: 1024px) 45vw, 100vw",
  priority = false,
  parallax = 48,
  frame = true,
}: RevealImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const y = useParallax(ref, parallax);

  return (
    <motion.div ref={ref} style={{ y }} className={cn("relative", className)}>
      <motion.div variants={imageFrame} className="group relative">
        {frame && (
          <motion.div
            aria-hidden
            variants={frameOffset}
            className={cn(
              "pointer-events-none absolute -inset-3 border border-gold/30 md:-inset-4",
              "transition-[scale,border-color] duration-700 ease-elegant",
              "group-hover:scale-[1.02] group-hover:border-gold/60",
            )}
          />
        )}

        <div
          className={cn(
            "relative overflow-hidden bg-base-soft",
            "transition-shadow duration-700 ease-elegant group-hover:shadow-gold-glow",
            aspectClassName,
          )}
        >
          <motion.div
            variants={imageZoom}
            className="absolute inset-0 will-change-transform transition-[scale] duration-700 ease-elegant group-hover:scale-105"
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes}
              priority={priority}
              className="object-cover"
            />
          </motion.div>

          {/* 下辺を締めるグラデーション */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(10,10,10,0.45)_0%,transparent_45%)]"
          />

          {/* 幕 */}
          <motion.div
            aria-hidden
            variants={curtain}
            className="pointer-events-none absolute inset-0 origin-top bg-base"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
