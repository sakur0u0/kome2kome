"use client";

import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { useHeaderTone } from "@/hooks/useHeaderTone";
import { useScrolled } from "@/hooks/useScrolled";
import { useLanguage } from "@/lib/i18n";
import { EASE_ELEGANT } from "@/lib/motion";
import { cn } from "@/lib/utils/cn";
import { FadeSwap } from "@/components/motion/FadeSwap";
import { Logo } from "@/components/ui/Logo";
import { LanguageToggle } from "./LanguageToggle";
import { MobileMenu } from "./MobileMenu";
import { buildNavItems, primaryNavItems } from "./navigation";

/**
 * 固定ヘッダー（ガラスモーフィズム）。
 * - 最上部では極薄、スクロールすると透過ガラスが濃くなる
 * - 真下の幕が和紙（light）なら、文字とガラスを墨側に切り替える
 * - 右上に言語切り替えトグルを固定配置
 */
export function Header() {
  const scrolled = useScrolled(32);
  const tone = useHeaderTone();
  const { t, locale } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const navItems = buildNavItems(t);
  const primary = primaryNavItems(navItems);

  return (
    <>
      <motion.header
        data-tone={tone}
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: EASE_ELEGANT, delay: 1.4 }}
        className={cn(
          "glass fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-700 ease-elegant",
          scrolled ? "border-(--tone-line) bg-(--tone-glass)" : "border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:h-24 md:px-10">
          <Logo compact />

          <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
            {primary.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative flex items-center gap-2 py-2 font-display text-[13px] tracking-[0.22em] text-(--tone-fg-muted) transition-colors duration-500 hover:text-(--tone-fg)"
              >
                <span className="font-brush text-[13px] text-(--tone-accent) opacity-80">{item.numeral}</span>
                <FadeSwap id={locale}>{item.label}</FadeSwap>
                <span
                  aria-hidden
                  className="absolute bottom-0 left-0 h-px w-full origin-right scale-x-0 bg-(--tone-accent) transition-transform duration-500 ease-elegant group-hover:origin-left group-hover:scale-x-100"
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageToggle />

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t.a11y.openMenu}
              aria-expanded={menuOpen}
              className="flex h-11 w-11 flex-col items-center justify-center gap-[6px] text-(--tone-fg) transition-colors hover:text-(--tone-accent) md:hidden"
            >
              <span aria-hidden className="block h-px w-6 bg-current" />
              <span aria-hidden className="block h-px w-4 bg-current" />
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={closeMenu} items={navItems} />
    </>
  );
}
