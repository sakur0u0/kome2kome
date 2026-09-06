"use client";

import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLanguage } from "@/lib/i18n";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { siteConfig } from "@/lib/site.config";
import { FadeSwap } from "@/components/motion/FadeSwap";
import { Logo } from "@/components/ui/Logo";
import { SealStamp } from "@/components/ui/SealStamp";
import { buildNavItems } from "./navigation";

/**
 * 結 ── フッター。ロゴ、章の一覧、落款で締める。
 * KanjiVG（CC BY-SA 3.0）と仮素材のクレジットをここに置く。
 */
export function Footer() {
  const { t, locale } = useLanguage();
  const { ref, state } = useScrollReveal<HTMLElement>({ amount: 0.3 });
  const navItems = buildNavItems(t);
  const year = new Date().getFullYear();

  return (
    <motion.footer
      ref={ref}
      data-tone="dark"
      variants={staggerContainer(0.15, 0.1)}
      initial="hidden"
      animate={state}
      className="relative border-t border-line bg-base text-ivory"
    >
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
        <div className="flex flex-col items-center gap-12 text-center md:flex-row md:items-start md:justify-between md:text-left">
          <motion.div variants={fadeIn} className="flex flex-col items-center gap-6 md:items-start">
            <Logo />
            <p className="font-display text-sm tracking-display text-mist">
              <FadeSwap id={locale}>{t.footer.tagline}</FadeSwap>
            </p>
            <a
              href={siteConfig.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="font-latin text-[11px] tracking-[0.3em] text-ivory/60 transition-colors duration-500 hover:text-gold"
            >
              @{siteConfig.brand.instagramHandle}
            </a>
          </motion.div>

          <motion.nav variants={fadeIn} aria-label="Footer" className="grid grid-cols-3 gap-x-10 gap-y-5 sm:grid-cols-6">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="group flex flex-col items-center gap-2 md:items-start">
                <span className="font-brush text-[1rem] text-gold/70 transition-colors duration-500 group-hover:text-gold">
                  {item.numeral}
                </span>
                <span className="font-display text-xs tracking-[0.2em] text-ivory/60 transition-colors duration-500 group-hover:text-ivory">
                  <FadeSwap id={locale}>{item.label}</FadeSwap>
                </span>
              </a>
            ))}
          </motion.nav>

          <div className="hidden lg:block">
            <SealStamp size="lg" tilt={-4}>
              {siteConfig.brand.seal}
            </SealStamp>
          </div>
        </div>

        <motion.div
          variants={fadeIn}
          className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 md:flex-row"
        >
          <p className="font-latin text-[11px] tracking-[0.3em] text-mist">
            <FadeSwap id={locale}>{t.footer.location}</FadeSwap>
          </p>
          <p className="font-latin text-[11px] tracking-[0.2em] text-mist">
            © {year} {siteConfig.brand.fullNameJa}. {t.footer.rights}
          </p>
        </motion.div>

        <motion.p variants={fadeIn} className="mt-6 text-center font-body text-[10px] leading-relaxed tracking-[0.06em] text-mist/70 md:text-left">
          <FadeSwap id={locale}>{t.footer.credits}</FadeSwap>{" "}
          <a
            href={siteConfig.links.kanjivg}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-mist/40 underline-offset-2 transition-colors hover:text-gold"
          >
            kanjivg.tagaini.net
          </a>
        </motion.p>
      </div>
    </motion.footer>
  );
}
