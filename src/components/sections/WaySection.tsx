"use client";

import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLanguage } from "@/lib/i18n";
import { fadeIn, fadeUp, lineGrow, staggerContainer } from "@/lib/motion";
import { siteConfig } from "@/lib/site.config";
import { BrushKanji } from "@/components/motion/BrushKanji";
import { FadeSwap } from "@/components/motion/FadeSwap";
import { ChapterHeading } from "@/components/ui/ChapterHeading";
import { GoldButton } from "@/components/ui/GoldButton";
import { InkMap } from "@/components/ui/InkMap";

/**
 * 七 ── 道。
 * 墨線の地図が引かれ、店舗情報が並び、金の CTA（Google マップで経路）で締める。
 * 予約は受けていないため、予約導線は置かない。
 */
export function WaySection() {
  const { t, locale } = useLanguage();
  const { ref, state } = useScrollReveal<HTMLElement>({ amount: 0.15 });

  return (
    <motion.section
      id={siteConfig.sections.way}
      ref={ref}
      data-tone="dark"
      variants={staggerContainer(0.18, 0.1)}
      initial="hidden"
      animate={state}
      className="relative scroll-mt-24 overflow-hidden bg-base py-section text-ivory"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[36rem] bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(212,175,55,0.12),transparent_70%)]"
      />
      <div aria-hidden className="pointer-events-none absolute -left-10 bottom-10 w-[18rem] opacity-[0.05] md:w-[24rem]">
        <BrushKanji kanji="michi" strokeWidth={5} strokeDuration={0.35} className="h-auto w-full text-gold" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <ChapterHeading index={6} label={t.way.label} heading={t.way.heading} lead={t.way.lead} />

        <div className="mt-20 grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-16">
          {/* 墨線の地図 */}
          <motion.div variants={fadeIn} className="lg:col-span-7">
            <div className="relative border border-line bg-base-soft/60 p-4 md:p-8">
              <InkMap labels={t.way.map} ariaLabel={t.a11y.inkMap} />
              <span aria-hidden className="absolute left-4 top-4 h-3 w-3 border-l border-t border-gold/60" />
              <span aria-hidden className="absolute right-4 top-4 h-3 w-3 border-r border-t border-gold/60" />
              <span aria-hidden className="absolute bottom-4 left-4 h-3 w-3 border-b border-l border-gold/60" />
              <span aria-hidden className="absolute bottom-4 right-4 h-3 w-3 border-b border-r border-gold/60" />
            </div>
          </motion.div>

          {/* 店舗情報 */}
          <div className="flex flex-col lg:col-span-5">
            <motion.p variants={fadeUp} className="font-display text-lg leading-relaxed tracking-display text-ivory">
              <FadeSwap id={locale}>{t.way.address}</FadeSwap>
            </motion.p>

            <motion.dl variants={staggerContainer(0.1, 0.2)} className="mt-8 flex flex-col divide-y divide-line border-y border-line">
              {t.way.rows.map((row, index) => (
                <motion.div key={index} variants={fadeUp} className="grid grid-cols-[6.5rem_1fr] gap-4 py-4 md:grid-cols-[7.5rem_1fr]">
                  <dt className="font-display text-[11px] tracking-[0.25em] text-gold/80">
                    <FadeSwap id={locale}>{row.label}</FadeSwap>
                  </dt>
                  <dd className="font-body text-[14px] leading-relaxed text-ivory/80">
                    <FadeSwap id={locale}>{row.value}</FadeSwap>
                  </dd>
                </motion.div>
              ))}
            </motion.dl>

            <motion.div variants={fadeUp} className="mt-8">
              <p className="flex items-center gap-3 font-display text-[11px] tracking-[0.25em] text-gold/80">
                <motion.span aria-hidden variants={lineGrow} className="h-px w-6 origin-left bg-gold/60" />
                <FadeSwap id={locale}>{t.way.accessLabel}</FadeSwap>
              </p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {t.way.access.map((line, index) => (
                  <li key={index} className="font-body text-[14px] leading-relaxed text-ivory/75">
                    <FadeSwap id={locale}>{line}</FadeSwap>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-12 flex flex-col items-start gap-5 sm:flex-row sm:flex-wrap sm:items-center">
              <GoldButton href={siteConfig.links.directions} external variant="solid" size="lg">
                <FadeSwap id={locale}>{t.common.directions}</FadeSwap>
              </GoldButton>
              <a
                href={siteConfig.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 font-latin text-xs tracking-[0.3em] text-ivory/70 transition-colors duration-500 hover:text-gold"
              >
                <span>@{siteConfig.brand.instagramHandle}</span>
                <span aria-hidden className="h-px w-6 bg-current transition-all duration-500 group-hover:w-10" />
              </a>
            </motion.div>

            <motion.p variants={fadeIn} className="mt-8 font-body text-xs leading-relaxed tracking-[0.06em] text-ivory/40">
              <FadeSwap id={locale}>{t.way.note}</FadeSwap>
            </motion.p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
