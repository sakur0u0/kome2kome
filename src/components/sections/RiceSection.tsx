"use client";

import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLanguage } from "@/lib/i18n";
import { fadeIn, fadeUp, lineGrow, staggerContainer } from "@/lib/motion";
import { siteConfig } from "@/lib/site.config";
import { BrushKanji } from "@/components/motion/BrushKanji";
import { FadeSwap } from "@/components/motion/FadeSwap";
import { InkReveal } from "@/components/motion/InkReveal";
import { ChapterHeading } from "@/components/ui/ChapterHeading";
import { RevealImage } from "@/components/ui/RevealImage";
import { SentenceLines } from "@/components/ui/SentenceLines";

/**
 * 五 ── お米。
 * 「食べる米と、持ち帰る米」。店名の由来をここで回収する。
 * 金の額縁の写真と、金の筆で描かれる大きな「米」。
 */
export function RiceSection() {
  const { t, locale } = useLanguage();
  const { ref, state } = useScrollReveal<HTMLElement>({ amount: 0.2 });

  return (
    <motion.section
      id={siteConfig.sections.rice}
      ref={ref}
      data-tone="dark"
      variants={staggerContainer(0.2, 0.1)}
      initial="hidden"
      animate={state}
      className="relative scroll-mt-24 overflow-hidden bg-base py-section text-ivory"
    >
      {/* 金の気配 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_75%_50%,rgba(212,175,55,0.09),transparent_70%)]"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 md:px-10 lg:grid-cols-12 lg:gap-20">
        <div className="flex flex-col lg:col-span-6">
          <ChapterHeading index={4} label={t.rice.label} heading={t.rice.heading} />

          <motion.p
            variants={fadeUp}
            className="mt-10 font-display text-2xl leading-[1.5] tracking-display text-gold-light md:text-[1.9rem]"
          >
            <FadeSwap id={locale}>{t.rice.lead}</FadeSwap>
          </motion.p>

          <InkReveal className="mt-8 max-w-xl" duration={2} delay={0.2}>
            <p className="font-body text-[15px] leading-body text-pretty text-ivory/70 md:text-[1rem]">
              <SentenceLines id={locale} text={t.rice.body} />
            </p>
          </InkReveal>

          <motion.ul variants={staggerContainer(0.12, 0.3)} className="mt-10 flex flex-col gap-4">
            {t.rice.points.map((point, index) => (
              <motion.li key={index} variants={fadeUp} className="flex items-center gap-4">
                <motion.span aria-hidden variants={lineGrow} className="h-px w-8 origin-left bg-gold/70" />
                <span className="font-display text-[15px] tracking-display text-ivory/85">
                  <FadeSwap id={locale}>{point}</FadeSwap>
                </span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.p variants={fadeIn} className="mt-10 font-body text-xs leading-relaxed tracking-[0.06em] text-ivory/40">
            <FadeSwap id={locale}>{t.rice.note}</FadeSwap>
          </motion.p>
        </div>

        <div className="relative lg:col-span-6">
          {/* 金の筆で描く「米」 */}
          <div aria-hidden className="pointer-events-none absolute -right-6 -top-24 w-[16rem] opacity-30 md:w-[20rem] lg:-right-10 lg:-top-32">
            <BrushKanji kanji="kome" strokeWidth={4.5} strokeDuration={0.5} className="h-auto w-full text-gold" />
          </div>
          <RevealImage
            src={siteConfig.images.rice.src}
            alt={t.rice.imageAlt}
            aspectClassName="aspect-[4/5]"
            sizes="(min-width: 1024px) 45vw, 100vw"
            parallax={70}
            className="relative mx-auto max-w-md lg:max-w-none"
          />
        </div>
      </div>
    </motion.section>
  );
}
