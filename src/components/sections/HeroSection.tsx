"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { useParallaxZoom } from "@/hooks/useParallaxZoom";
import { useLanguage } from "@/lib/i18n";
import {
  EASE_ELEGANT,
  heroRise,
  lineGrow,
  lineGrowY,
  slowZoomTransition,
  staggerContainer,
} from "@/lib/motion";
import { siteConfig } from "@/lib/site.config";
import { FadeSwap } from "@/components/motion/FadeSwap";
import { GoldButton } from "@/components/ui/GoldButton";
import { Logo } from "@/components/ui/Logo";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";

/**
 * ファーストビュー。
 * - 背景: 極めてゆっくりズームインし続ける + スクロールに追従するパララックス
 * - ロゴ / 肩書き / キャッチコピー / CTA が 1.5s (EaseInOut) で順に浮き上がる
 */
export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { y, scale, contentOpacity, contentY } = useParallaxZoom(sectionRef, {
    distance: 200,
    zoom: 0.1,
  });
  const { t, locale } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section
      id="top"
      ref={sectionRef}
      data-tone="dark"
      className="relative flex min-h-svh items-center justify-center overflow-hidden bg-base"
    >
      {/* ---- 背景レイヤー（スクロール連動） ---- */}
      <motion.div style={{ y, scale }} className="absolute inset-0 will-change-transform">
        {/* 時間経過でゆっくりズームインし続けるレイヤー */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1 }}
          animate={{ scale: 1.2 }}
          transition={slowZoomTransition}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoaded ? 1 : 0 }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          >
            <Image
              src={siteConfig.images.hero.src}
              alt={t.a11y.heroImage}
              fill
              priority
              quality={90}
              sizes="100vw"
              className="object-cover"
              onLoad={() => setImageLoaded(true)}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ---- 階調を整えるオーバーレイ ---- */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,10,0.6)_0%,rgba(10,10,10,0.3)_38%,rgba(10,10,10,0.55)_72%,#0a0a0a_100%)]"
      />
      {/* 周縁を落とすビネット */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,10,10,0.75)_100%)]"
      />
      {/* 文字の背後だけをそっと沈める */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_42%_46%_at_50%_50%,rgba(10,10,10,0.5)_0%,transparent_100%)]"
      />

      {/* ---- 右端の縦書き装飾 ---- */}
      <motion.div
        aria-hidden
        className="absolute right-8 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-6 lg:flex xl:right-14"
        variants={staggerContainer(0.3, 2)}
        initial="hidden"
        animate="visible"
      >
        <motion.span variants={lineGrowY} className="h-20 w-px origin-top bg-gold/50" />
        <motion.span
          variants={heroRise}
          className="writing-vertical font-display text-[11px] tracking-[0.5em] text-ivory/50"
        >
          <FadeSwap id={locale}>{t.hero.side}</FadeSwap>
        </motion.span>
        <motion.span variants={lineGrowY} className="h-20 w-px origin-bottom bg-gold/50" />
      </motion.div>

      {/* ---- 左端の座標的な装飾 ---- */}
      <motion.div
        aria-hidden
        className="absolute left-8 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-6 lg:flex xl:left-14"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 2.2 }}
      >
        <span className="writing-vertical font-latin text-[10px] tracking-[0.5em] text-ivory/40">
          {siteConfig.location.area} · {siteConfig.location.city}
        </span>
      </motion.div>

      {/* ---- 前景コンテンツ ---- */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 flex w-full flex-col items-center px-6 pb-36 pt-28 text-center md:pb-40 md:pt-32"
      >
        <motion.div
          variants={staggerContainer(0.28, 0.35)}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.div variants={heroRise}>
            <Logo size="lg" />
          </motion.div>

          <motion.p
            variants={heroRise}
            className="mt-8 font-display text-[11px] tracking-[0.42em] text-gold-light [text-shadow:0_1px_18px_rgba(0,0,0,0.9)] sm:text-xs md:mt-10 md:text-sm"
          >
            <FadeSwap id={locale}>{t.hero.eyebrow}</FadeSwap>
          </motion.p>

          <motion.h1
            variants={heroRise}
            className="mt-5 font-display text-hero tracking-display text-ivory [text-shadow:0_2px_28px_rgba(0,0,0,0.6)] md:mt-6"
          >
            {t.hero.catchcopy.map((line, index) => (
              <span key={index} className="block">
                <FadeSwap id={`${locale}-${index}`}>{line}</FadeSwap>
              </span>
            ))}
          </motion.h1>

          <motion.span
            aria-hidden
            variants={lineGrow}
            className="mt-8 h-px w-28 hairline-gold md:mt-10"
          />

          <motion.div variants={heroRise} className="mt-8 flex flex-col items-center gap-5 md:mt-10">
            <GoldButton href={siteConfig.links.directions} external>
              <FadeSwap id={locale}>{t.hero.cta}</FadeSwap>
            </GoldButton>
            <a
              href={`#${siteConfig.sections.menu}`}
              className="group inline-flex items-center gap-3 font-display text-[12px] tracking-[0.3em] text-ivory/70 transition-colors duration-500 hover:text-gold-light"
            >
              <FadeSwap id={locale}>{t.hero.ctaSecondary}</FadeSwap>
              <span aria-hidden className="h-px w-5 bg-current transition-all duration-500 group-hover:w-9" />
            </a>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ---- スクロール誘導 ---- */}
      <motion.div
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 md:bottom-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: EASE_ELEGANT, delay: 2.8 }}
      >
        <ScrollIndicator label={t.hero.scroll} />
      </motion.div>
    </section>
  );
}
