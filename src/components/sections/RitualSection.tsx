"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useRef, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLanguage } from "@/lib/i18n";
import { EASE_ELEGANT, fadeIn, staggerContainer } from "@/lib/motion";
import { siteConfig } from "@/lib/site.config";
import { cn } from "@/lib/utils/cn";
import { BrushKanji } from "@/components/motion/BrushKanji";
import { FadeSwap } from "@/components/motion/FadeSwap";
import { ChapterHeading } from "@/components/ui/ChapterHeading";
import { MonbranDrawing } from "@/components/ui/MonbranDrawing";

/** 各工程が担当する進捗の範囲 */
const STEP_RANGES: readonly [number, number][] = [
  [0, 0.12],
  [0.12, 0.74],
  [0.74, 0.9],
  [0.9, 1.01],
];

function stepFor(progress: number): number {
  const index = STEP_RANGES.findIndex(([start, end]) => progress >= start && progress < end);
  return index === -1 ? 3 : index;
}

/**
 * 四 ── 体験。
 * 漆黒の幕、ここから金が入る。画面を固定し、スクロール量だけで
 * お米のクリームが器に積み重なっていく。右側では工程が一つずつ灯る。
 */
export function RitualSection() {
  const { t, locale } = useLanguage();
  const { ref, state } = useScrollReveal<HTMLElement>({ amount: 0.1 });
  const outerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: outerRef, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = stepFor(value);
    if (next !== active) setActive(next);
  });
  return (
    <motion.section
      id={siteConfig.sections.ritual}
      ref={ref}
      data-tone="dark"
      variants={staggerContainer(0.2, 0.1)}
      initial="hidden"
      animate={state}
      className="relative scroll-mt-24 bg-base text-ivory"
    >
      {/* 墨 → 漆黒 の継ぎ目 */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-sumi to-transparent" />

      <div ref={outerRef} className="relative h-[420vh]">
        <div className="sticky top-0 flex h-svh flex-col overflow-hidden lg:grid lg:grid-cols-12 lg:items-center lg:gap-8 lg:px-10">
          {/* 背景の装飾漢字「静」 */}
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 w-[28rem] -translate-x-1/2 -translate-y-1/2 opacity-[0.045] lg:left-[30%]">
            <BrushKanji kanji="shizuka" strokeWidth={5} strokeDuration={0.4} className="h-auto w-full text-ivory" />
          </div>

          {/* 線描 */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-6 pt-24 lg:col-span-7 lg:h-full lg:flex-none lg:pt-0">
            <MonbranDrawing
              progress={scrollYProgress}
              label={t.a11y.ritualDrawing}
              className="max-h-[52svh] lg:mt-10 lg:max-h-[74vh]"
            />
            <motion.p
              initial={false}
              animate={{ opacity: active >= 2 ? 0 : 1 }}
              transition={{ duration: 0.8, ease: EASE_ELEGANT }}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap font-latin text-[10px] tracking-[0.4em] text-gold/60 lg:bottom-10"
            >
              <FadeSwap id={locale}>{t.ritual.caption}</FadeSwap>
            </motion.p>
          </div>

          {/* 章題と工程 */}
          <div className="relative z-10 flex flex-col px-6 pb-8 pt-4 lg:col-span-5 lg:px-0 lg:pb-0 lg:pt-0">
            <div className="hidden lg:block">
              <ChapterHeading index={3} label={t.ritual.label} heading={t.ritual.heading} lead={t.ritual.lead} />
            </div>

            {/* デスクトップ：全工程を縦に並べ、進行中のものだけ灯す */}
            <motion.ol variants={fadeIn} className="mt-12 hidden flex-col gap-7 lg:flex">
              {t.ritual.steps.map((step, index) => {
                const on = index === active;
                const done = index < active;
                return (
                  <li key={index} className="flex gap-6">
                    <span className="relative mt-1 flex h-10 w-10 shrink-0 items-center justify-center">
                      <motion.span
                        aria-hidden
                        className="absolute inset-0 rounded-full border"
                        animate={{
                          borderColor: on ? "rgba(212,175,55,0.9)" : done ? "rgba(212,175,55,0.45)" : "rgba(245,245,245,0.14)",
                          boxShadow: on ? "0 0 24px rgba(212,175,55,0.35)" : "0 0 0 rgba(0,0,0,0)",
                          scale: on ? 1.08 : 1,
                        }}
                        transition={{ duration: 0.6, ease: EASE_ELEGANT }}
                      />
                      <span className={cn("font-brush text-lg transition-colors duration-500", on || done ? "text-gold-light" : "text-ivory/40")}>
                        {siteConfig.numerals[index]}
                      </span>
                    </span>
                    <div className="flex flex-col">
                      <h3
                        className={cn(
                          "font-display text-lg tracking-display transition-colors duration-500",
                          on ? "text-ivory" : done ? "text-ivory/70" : "text-ivory/35",
                        )}
                      >
                        <FadeSwap id={locale}>{step.title}</FadeSwap>
                      </h3>
                      <motion.p
                        initial={false}
                        animate={{ opacity: on ? 1 : 0.28, height: "auto" }}
                        transition={{ duration: 0.6 }}
                        className="mt-2 max-w-md font-body text-[14px] leading-[1.9] text-ivory/70"
                      >
                        <FadeSwap id={locale}>{step.body}</FadeSwap>
                      </motion.p>
                    </div>
                  </li>
                );
              })}
            </motion.ol>

            {/* モバイル：進行中の工程だけを入れ替え表示 */}
            <div className="relative min-h-[8.5rem] lg:hidden">
              <div className="mb-4 flex items-center gap-3">
                <span className="font-latin text-[10px] tracking-[0.4em] text-gold">
                  {t.ritual.label}
                </span>
                <span className="flex gap-1.5">
                  {t.ritual.steps.map((_, index) => (
                    <span
                      key={index}
                      className={cn(
                        "h-1 w-6 rounded-full transition-colors duration-500",
                        index <= active ? "bg-gold" : "bg-white/15",
                      )}
                    />
                  ))}
                </span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${active}-${locale}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: EASE_ELEGANT }}
                >
                  <h3 className="font-display text-xl tracking-display text-ivory">{t.ritual.steps[active].title}</h3>
                  <p className="mt-2 font-body text-[14px] leading-[1.85] text-ivory/70">{t.ritual.steps[active].body}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
