"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLanguage } from "@/lib/i18n";
import { fadeIn, fadeUp, staggerContainer } from "@/lib/motion";
import { siteConfig } from "@/lib/site.config";
import { BrushKanji } from "@/components/motion/BrushKanji";
import { FadeSwap } from "@/components/motion/FadeSwap";
import { ChapterHeading } from "@/components/ui/ChapterHeading";
import { MenuCard } from "@/components/ui/MenuCard";

/**
 * 参 ── 品書き。
 * 墨の幕。巻物をひらくように、縦スクロールが横方向の移動に変わる。
 * 左右に木軸、下に金の進捗線。モバイルではネイティブの横スワイプ。
 */
export function MenuSection() {
  const { t, locale } = useLanguage();
  const { ref, state } = useScrollReveal<HTMLElement>({ amount: 0.15 });
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <motion.section
      id={siteConfig.sections.menu}
      ref={ref}
      data-tone="dark"
      variants={staggerContainer(0.2, 0.1)}
      initial="hidden"
      animate={state}
      className="relative scroll-mt-24 bg-sumi pt-section text-ivory"
    >
      {/* 朱の気配 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[40rem] bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(179,38,46,0.12),transparent_70%)]"
      />
      <div aria-hidden className="pointer-events-none absolute -left-8 top-20 w-[16rem] opacity-[0.05] md:w-[22rem]">
        <BrushKanji kanji="aji" strokeWidth={5.5} strokeDuration={0.35} className="h-auto w-full text-ivory" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <ChapterHeading index={2} label={t.menu.label} heading={t.menu.heading} lead={t.menu.lead} align="center" />
      </div>

      {isDesktop ? <ScrollTrack /> : <SwipeTrack />}

      <div className="relative mx-auto max-w-7xl px-6 pb-section pt-10 md:px-10">
        <motion.p variants={fadeIn} className="text-center font-body text-xs leading-relaxed tracking-[0.08em] text-ivory/40">
          <FadeSwap id={locale}>{t.menu.note}</FadeSwap>
        </motion.p>
      </div>
    </motion.section>
  );
}

function useMenuCards() {
  const { t } = useLanguage();
  return siteConfig.menu.map((item, index) => ({
    id: item.id,
    index,
    copy: t.menu.items[item.id],
    image: siteConfig.images[item.image].src,
    price: item.price,
    signature: item.signature,
    seasonal: item.seasonal,
  }));
}

/** デスクトップ：sticky + 横移動（巻物） */
function ScrollTrack() {
  const { t, locale } = useLanguage();
  const cards = useMenuCards();
  const reduced = useReducedMotion();
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxX, setMaxX] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const overflow = track.scrollWidth - window.innerWidth;
      setMaxX(Math.max(0, overflow));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: outerRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -maxX]);
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={outerRef} className="relative mt-16" style={{ height: `calc(100vh + ${maxX}px)` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden pt-14">
        {/* 木軸 */}
        <span aria-hidden className="scroll-roller absolute left-5 top-1/2 z-20 h-[62%] w-3 -translate-y-1/2 rounded-full" />
        <span aria-hidden className="scroll-roller absolute right-5 top-1/2 z-20 h-[62%] w-3 -translate-y-1/2 rounded-full" />
        {/* 端を暗く落として巻物の奥行きを出す */}
        <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-sumi to-transparent" />
        <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-sumi to-transparent" />

        <motion.div
          ref={trackRef}
          style={{ x: reduced ? 0 : x }}
          className="flex items-stretch gap-12 pl-[max(6rem,calc((100vw-80rem)/2+2.5rem))] pr-24 will-change-transform"
        >
          {/* 巻物の題箋 */}
          <div className="flex w-56 shrink-0 flex-col justify-center">
            <span className="writing-vertical font-display text-2xl tracking-[0.35em] text-ivory/85">
              <FadeSwap id={locale}>{t.menu.heading}</FadeSwap>
            </span>
            <span className="mt-6 font-latin text-[10px] tracking-[0.45em] text-gold/70">
              <FadeSwap id={locale}>{t.common.dragHint}</FadeSwap> →
            </span>
          </div>

          {cards.map(({ id, ...card }) => (
            <MenuCard key={id} {...card} className="w-[22rem] shrink-0" />
          ))}

          {/* 末尾の余白（巻き終わり） */}
          <div aria-hidden className="w-16 shrink-0" />
        </motion.div>

        {/* 進捗線 */}
        <div className="absolute bottom-10 left-1/2 h-px w-64 -translate-x-1/2 bg-white/10">
          <motion.span style={{ scaleX: progressScale }} className="block h-full w-full origin-left bg-gold" />
        </div>
      </div>
    </div>
  );
}

/** モバイル・タブレット：ネイティブの横スワイプ */
function SwipeTrack() {
  const { t, locale } = useLanguage();
  const cards = useMenuCards();

  return (
    <div className="relative mt-14">
      <motion.p variants={fadeUp} className="mb-6 px-6 font-latin text-[10px] tracking-[0.45em] text-gold/70">
        <FadeSwap id={locale}>{t.common.dragHint}</FadeSwap> →
      </motion.p>
      <div className="scrollbar-none flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 pt-3">
        {cards.map(({ id, ...card }) => (
          <MenuCard key={id} {...card} className="w-[78vw] max-w-sm shrink-0 snap-center" />
        ))}
        <div aria-hidden className="w-2 shrink-0" />
      </div>
    </div>
  );
}
