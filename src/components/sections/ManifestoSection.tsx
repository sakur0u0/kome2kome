"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useParallax } from "@/hooks/useParallax";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLanguage } from "@/lib/i18n";
import { fadeIn, fadeUp, lineGrow, staggerContainer } from "@/lib/motion";
import { siteConfig } from "@/lib/site.config";
import { BrushKanji } from "@/components/motion/BrushKanji";
import { FadeSwap } from "@/components/motion/FadeSwap";
import { InkReveal } from "@/components/motion/InkReveal";
import { VerticalType } from "@/components/motion/VerticalType";
import { ChapterHeading } from "@/components/ui/ChapterHeading";
import { WashiTexture } from "@/components/ui/WashiTexture";

/**
 * 壱 ── 宣言。
 * 漆黒のヒーローから一転、和紙の白へ。水墨画の松林が薄く浮かび、
 * 筆が「米」を一画ずつ書き、宣言文が一文字ずつ墨で置かれていく。
 */
export function ManifestoSection() {
  const { t, locale } = useLanguage();
  const { ref, state } = useScrollReveal<HTMLElement>({ amount: 0.25 });
  const bgRef = useRef<HTMLDivElement>(null);
  const bgY = useParallax(bgRef, 120);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const vertical = locale !== "en" && isDesktop;

  return (
    <motion.section
      id={siteConfig.sections.manifesto}
      ref={ref}
      data-tone="light"
      variants={staggerContainer(0.22, 0.1)}
      initial="hidden"
      animate={state}
      className="relative scroll-mt-24 overflow-hidden bg-washi py-section text-sumi"
    >
      {/*
       * 水墨画の気配：松林図（Public Domain）を薄く敷く。
       * 動くレイヤーに filter / mix-blend-mode を掛けると Safari で毎フレーム再合成になるため、
       * grayscale と multiply は使わない（原画がほぼ墨一色なので見た目はほとんど変わらない）。
       * パララックスは PC のみ。
       */}
      <div ref={bgRef} aria-hidden className="absolute inset-0">
        <motion.div
          style={{ y: isDesktop ? bgY : 0 }}
          className="absolute -inset-y-24 inset-x-0 opacity-[0.3] [mask-image:linear-gradient(to_bottom,transparent_0%,#000_20%,#000_80%,transparent_100%)]"
        >
          <Image
            src={siteConfig.images.sumie.src}
            alt=""
            fill
            sizes="100vw"
            quality={75}
            className="object-cover object-center"
          />
        </motion.div>
      </div>
      <WashiTexture opacity={0.15} />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 md:px-10 lg:grid-cols-12 lg:gap-12">
        {/* 筆文字「米」 */}
        <motion.div variants={fadeIn} className="flex justify-center lg:col-span-5 lg:justify-start">
          <div className="relative w-56 sm:w-64 md:w-72 lg:w-[22rem]">
            <BrushKanji
              kanji="kome"
              strokeWidth={6.5}
              strokeDuration={0.6}
              delay={0.3}
              className="relative z-10 h-auto w-full text-sumi"
              label={siteConfig.brand.emblem}
            />
            {/* 印 */}
            <motion.span
              aria-hidden
              variants={fadeIn}
              className="absolute -bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-[2px] bg-shu font-brush text-[11px] leading-none text-ivory md:h-11 md:w-11 md:text-[13px]"
            >
              {siteConfig.brand.seal}
            </motion.span>
          </div>
        </motion.div>

        {/* 宣言 */}
        <div className="flex flex-col lg:col-span-7">
          <ChapterHeading index={0} label={t.manifesto.label} heading={t.manifesto.heading} />

          <motion.p
            variants={fadeIn}
            className={
              vertical
                ? "mt-12 h-[26rem] font-display text-[2.35rem] leading-[1.45] tracking-[0.12em] text-sumi xl:text-[2.75rem]"
                : "mt-10 font-display text-[1.75rem] leading-[1.45] tracking-display text-sumi sm:text-4xl md:text-[2.6rem]"
            }
          >
            <FadeSwap id={`${locale}-${vertical}`} block>
              <VerticalType
                lines={t.manifesto.statement}
                vertical={vertical}
                stagger={0.04}
                delay={0.4}
                active={state === "visible"}
              />
            </FadeSwap>
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex items-center gap-4">
            <motion.span aria-hidden variants={lineGrow} className="h-px w-14 origin-left bg-shu/80" />
            <span className="font-accent text-sm tracking-[0.2em] text-shu md:text-[15px]">
              <FadeSwap id={locale}>{t.manifesto.tagline}</FadeSwap>
            </span>
          </motion.div>

          <InkReveal className="mt-8 max-w-2xl" duration={2.2} delay={0.2}>
            <p className="font-body text-[15px] leading-body text-pretty text-sumi/75 md:text-[1rem]">
              <FadeSwap id={locale}>{t.manifesto.body}</FadeSwap>
            </p>
          </InkReveal>
        </div>
      </div>
    </motion.section>
  );
}
