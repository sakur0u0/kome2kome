"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import type { MouseEvent } from "react";
import { useLanguage } from "@/lib/i18n";
import type { MenuItemCopy } from "@/lib/i18n/types";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils/cn";
import { FadeSwap } from "@/components/motion/FadeSwap";

interface MenuCardProps {
  index: number;
  copy: MenuItemCopy;
  image: string;
  price: number | null;
  signature: boolean;
  seasonal: boolean;
  className?: string;
}

const yen = new Intl.NumberFormat("ja-JP");

/**
 * 品書きの一枚。
 * ホバーでカードがわずかに傾き（3D チルト）、金の縁が光る。
 * 親の "hidden" / "visible" を継承して浮かび上がる。
 */
export function MenuCard({ index, copy, image, price, signature, seasonal, className }: MenuCardProps) {
  const { t, locale } = useLanguage();
  const reduced = useReducedMotion();

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 180, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 180, damping: 18 });
  const glareX = useTransform(mx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(my, [0, 1], ["0%", "100%"]);

  const onMove = (event: MouseEvent<HTMLElement>) => {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width);
    my.set((event.clientY - rect.top) / rect.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.article
      variants={fadeUp}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY, transformPerspective: 1200 }}
      className={cn("group relative flex flex-col will-change-transform", className)}
    >
      {/* 写真 */}
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-2.5 border border-gold/25 transition-[border-color,box-shadow] duration-700 ease-elegant group-hover:border-gold/70 group-hover:shadow-gold-glow-sm"
        />
        <div className="relative aspect-[3/4] overflow-hidden bg-base-soft">
          <Image
            src={image}
            alt={copy.imageAlt}
            fill
            sizes="(min-width: 1024px) 22rem, 78vw"
            quality={75}
            className="object-cover transition-transform duration-[1400ms] ease-elegant group-hover:scale-105"
          />
          {/* 光沢 */}
          <motion.div
            aria-hidden
            style={{ left: glareX, top: glareY }}
            className="pointer-events-none absolute h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(243,227,172,0.25)_0%,transparent_55%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-sumi/70 via-transparent to-transparent" />

          {/* バッジ */}
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            {signature && (
              <span className="inline-flex items-center border border-gold/80 bg-sumi/70 px-2.5 py-1 font-latin text-[10px] tracking-[0.3em] text-gold-light backdrop-blur-sm">
                <FadeSwap id={locale}>{t.menu.signature}</FadeSwap>
              </span>
            )}
            {seasonal && (
              <span className="inline-flex items-center bg-shu px-2.5 py-1 font-display text-[10px] tracking-[0.3em] text-ivory">
                <FadeSwap id={locale}>{t.menu.seasonal}</FadeSwap>
              </span>
            )}
          </div>

          {/* 番号 */}
          <span
            aria-hidden
            className="absolute bottom-3 right-4 font-latin text-[11px] tracking-[0.35em] text-ivory/60"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* 文字 */}
      <div className="mt-7 flex flex-col">
        <h3 className="font-display text-xl leading-snug tracking-display text-ivory md:text-[1.35rem]">
          <FadeSwap id={locale}>{copy.name}</FadeSwap>
        </h3>
        <p className="mt-3 font-body text-[13.5px] leading-[1.9] text-ivory/60">
          <FadeSwap id={locale}>{copy.description}</FadeSwap>
        </p>
        <p className="mt-5 flex items-baseline gap-2 font-latin text-gold">
          {price !== null ? (
            <>
              <span className="text-lg tracking-[0.08em]">¥{yen.format(price)}</span>
              <span className="text-[10px] tracking-[0.25em] text-gold/70">
                <FadeSwap id={locale}>{t.common.taxIncluded}</FadeSwap>
              </span>
            </>
          ) : (
            <span className="text-[11px] tracking-[0.25em] text-gold/70">
              <FadeSwap id={locale}>{t.menu.priceAtCounter}</FadeSwap>
            </span>
          )}
        </p>
      </div>
    </motion.article>
  );
}
