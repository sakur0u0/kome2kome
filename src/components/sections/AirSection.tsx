"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { useParallax } from "@/hooks/useParallax";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLanguage } from "@/lib/i18n";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { siteConfig } from "@/lib/site.config";
import { cn } from "@/lib/utils/cn";
import { BrushKanji } from "@/components/motion/BrushKanji";
import { FadeSwap } from "@/components/motion/FadeSwap";
import { InkReveal } from "@/components/motion/InkReveal";
import { ChapterHeading } from "@/components/ui/ChapterHeading";

/** 写真ごとの配置（12 カラム）とパララックス量 */
const LAYOUT = [
  { className: "col-span-2 md:col-span-5", aspect: "aspect-[4/5]", parallax: 70 },
  { className: "col-span-1 md:col-span-4 md:col-start-7 md:mt-28", aspect: "aspect-[3/4]", parallax: -50 },
  { className: "col-span-1 md:col-span-3 md:col-start-10 md:mt-56", aspect: "aspect-[4/5]", parallax: 90 },
  { className: "col-span-2 md:col-span-6 md:-mt-16", aspect: "aspect-[16/10]", parallax: -30 },
  { className: "col-span-1 md:col-span-3 md:mt-24", aspect: "aspect-[3/4]", parallax: 55 },
  { className: "col-span-1 md:col-span-3 md:mt-8", aspect: "aspect-[4/5]", parallax: -70 },
] as const;

/**
 * 六 ── 空気。
 * 祇園の路地と八坂神社。写真は墨の滲みで現れ、スクロールでそれぞれ異なる速さで漂う。
 */
export function AirSection() {
  const { t } = useLanguage();
  const { ref, state } = useScrollReveal<HTMLElement>({ amount: 0.1 });

  return (
    <motion.section
      id={siteConfig.sections.air}
      ref={ref}
      data-tone="dark"
      variants={staggerContainer(0.2, 0.1)}
      initial="hidden"
      animate={state}
      className="relative scroll-mt-24 overflow-hidden bg-base py-section text-ivory"
    >
      <div aria-hidden className="pointer-events-none absolute -right-8 top-16 w-[18rem] opacity-[0.05] md:w-[26rem]">
        <BrushKanji kanji="en" strokeWidth={5} strokeDuration={0.35} className="h-auto w-full text-gold" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <ChapterHeading index={5} label={t.air.label} heading={t.air.heading} lead={t.air.lead} />

        <motion.div variants={fadeIn} className="mt-20 grid grid-cols-2 gap-5 md:grid-cols-12 md:gap-8">
          {siteConfig.images.air.map((image, index) => (
            <Tile
              key={index}
              src={image.src}
              alt={t.air.photos[index]?.alt ?? ""}
              caption={t.air.photos[index]?.caption ?? ""}
              className={LAYOUT[index].className}
              aspect={LAYOUT[index].aspect}
              parallax={LAYOUT[index].parallax}
              delay={(index % 3) * 0.15}
            />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

interface TileProps {
  src: string;
  alt: string;
  caption: string;
  className: string;
  aspect: string;
  parallax: number;
  delay: number;
}

function Tile({ src, alt, caption, className, aspect, parallax, delay }: TileProps) {
  const { locale } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const y = useParallax(ref, parallax);

  return (
    <motion.figure ref={ref} style={{ y }} className={cn("group relative flex flex-col", className)}>
      <InkReveal duration={2} delay={delay} amount={0.25} className="relative">
        <div className={cn("relative overflow-hidden bg-base-soft", aspect)}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 768px) 40vw, 50vw"
            quality={75}
            className="object-cover transition-transform duration-[1600ms] ease-elegant group-hover:scale-105"
          />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(10,10,10,0.55)_0%,transparent_40%)]" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 border border-gold/0 transition-colors duration-700 group-hover:border-gold/40"
          />
        </div>
      </InkReveal>
      <figcaption className="mt-3 flex items-center gap-3 font-display text-[11px] tracking-[0.2em] text-ivory/55 md:text-xs">
        <span aria-hidden className="h-px w-5 bg-gold/60" />
        <FadeSwap id={locale}>{caption}</FadeSwap>
      </figcaption>
    </motion.figure>
  );
}
