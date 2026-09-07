"use client";

import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLanguage } from "@/lib/i18n";
import type { CraftPillar } from "@/lib/i18n/types";
import { fadeIn, fadeUp, lineGrow, staggerContainer } from "@/lib/motion";
import { siteConfig } from "@/lib/site.config";
import { cn } from "@/lib/utils/cn";
import { BrushKanji } from "@/components/motion/BrushKanji";
import { ColorAwakening } from "@/components/motion/ColorAwakening";
import { FadeSwap } from "@/components/motion/FadeSwap";
import { InkReveal } from "@/components/motion/InkReveal";
import { ChapterHeading } from "@/components/ui/ChapterHeading";
import { InkEdge } from "@/components/ui/InkEdge";
import { WashiTexture } from "@/components/ui/WashiTexture";

const PILLAR_NUMERALS = ["一", "二", "三"] as const;
const PILLAR_IMAGES = [
  siteConfig.images.craftRice.src,
  siteConfig.images.craftCrepe.src,
  siteConfig.images.craftRitual.src,
] as const;

/**
 * 弐 ── こだわり。
 * 和紙の上に三つの柱。写真はモノクロで現れ、画面中央に近づくほど色を取り戻す。
 * 三本目の柱の下から墨が滲み出し、次の幕（品書き）へ暗転する。
 */
export function CraftSection() {
  const { t } = useLanguage();
  const { ref, state } = useScrollReveal<HTMLElement>({ amount: 0.12 });

  return (
    <motion.section
      id={siteConfig.sections.craft}
      ref={ref}
      data-tone="light"
      variants={staggerContainer(0.2, 0.05)}
      initial="hidden"
      animate={state}
      className="relative scroll-mt-24 overflow-hidden bg-washi pb-40 pt-section text-sumi md:pb-56"
    >
      <WashiTexture opacity={0.13} />

      {/* 背景の装飾漢字「極」 */}
      <div aria-hidden className="pointer-events-none absolute -right-10 top-24 w-[18rem] opacity-[0.06] md:w-[26rem]">
        <BrushKanji kanji="kiwami" strokeWidth={5.5} strokeDuration={0.35} className="h-auto w-full text-sumi" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <ChapterHeading index={1} label={t.craft.label} heading={t.craft.heading} lead={t.craft.lead} />

        <div className="mt-24 flex flex-col gap-28 md:mt-32 md:gap-40">
          {t.craft.pillars.map((pillar, index) => (
            <Pillar key={index} index={index} pillar={pillar} image={PILLAR_IMAGES[index]} />
          ))}
        </div>
      </div>

      {/* 墨の縁 → 次の幕（品書き）へ */}
      <InkEdge fill="#1a1a1a" />
    </motion.section>
  );
}

interface PillarProps {
  index: number;
  pillar: CraftPillar;
  image: string;
}

function Pillar({ index, pillar, image }: PillarProps) {
  const { locale } = useLanguage();
  const { ref, state } = useScrollReveal<HTMLDivElement>({ amount: 0.3 });
  const reversed = index % 2 === 1;

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer(0.18, 0.1)}
      initial="hidden"
      animate={state}
      className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16"
    >
      <motion.div
        variants={fadeIn}
        className={cn("lg:col-span-6", reversed ? "lg:order-2 lg:col-start-7" : "lg:order-1")}
      >
        <ColorAwakening
          src={image}
          alt={pillar.imageAlt}
          aspectClassName={index === 1 ? "aspect-[5/4]" : "aspect-[4/5]"}
          sizes="(min-width: 1024px) 45vw, 100vw"
        />
      </motion.div>

      <div
        className={cn(
          "relative flex flex-col lg:col-span-5",
          reversed ? "lg:order-1 lg:col-start-1 lg:pr-6" : "lg:order-2 lg:col-start-8 lg:pl-2",
        )}
      >
        {/* 大きな筆数字 */}
        <motion.span
          aria-hidden
          variants={fadeIn}
          className="pointer-events-none absolute -top-16 -left-3 select-none font-brush text-[8rem] leading-none text-shu/[0.14] md:-top-20 md:text-[10rem]"
        >
          {PILLAR_NUMERALS[index]}
        </motion.span>

        <motion.p variants={fadeUp} className="relative flex items-center gap-3 font-latin text-[11px] tracking-[0.4em] text-shu">
          <span className="font-brush text-[1rem] tracking-normal">{PILLAR_NUMERALS[index]}</span>
          <motion.span aria-hidden variants={lineGrow} className="h-px w-8 origin-left bg-shu/70" />
          <FadeSwap id={locale}>{pillar.title}</FadeSwap>
        </motion.p>

        <motion.h3
          variants={fadeUp}
          className="relative mt-6 text-balance font-display text-[1.7rem] leading-[1.4] tracking-display text-sumi md:text-4xl"
        >
          <FadeSwap id={locale}>{pillar.heading}</FadeSwap>
        </motion.h3>

        <InkReveal className="relative mt-7 max-w-xl" duration={2} delay={0.25}>
          <p className="font-body text-[15px] leading-body text-pretty text-sumi/72 md:text-[1rem]">
            <FadeSwap id={locale}>{pillar.body}</FadeSwap>
          </p>
        </InkReveal>
      </div>
    </motion.div>
  );
}
