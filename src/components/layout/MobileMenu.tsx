"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useLanguage } from "@/lib/i18n";
import { EASE_ELEGANT, fadeUp, staggerContainer } from "@/lib/motion";
import { siteConfig } from "@/lib/site.config";
import { GoldButton } from "@/components/ui/GoldButton";
import { Logo } from "@/components/ui/Logo";
import type { NavItem } from "./navigation";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
}

const STRIPS = 3;

/**
 * モバイル用の全画面メニュー。
 * 暖簾（のれん）が上から三枚、わずかにずれて降りてくる。閉じるときは巻き上がる。
 */
export function MobileMenu({ open, onClose, items }: MobileMenuProps) {
  const { t } = useLanguage();

  // 開いている間は背面のスクロールを止め、Esc で閉じる
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
          role="dialog"
          aria-modal="true"
          data-tone="dark"
          className="fixed inset-0 z-[60] flex flex-col md:hidden"
          initial="closed"
          animate="open"
          exit="closed"
        >
          {/* 暖簾の布 */}
          <div aria-hidden className="absolute inset-0 flex overflow-hidden">
            {Array.from({ length: STRIPS }).map((_, index) => (
              <motion.div
                key={index}
                className="relative h-full flex-1 bg-sumi"
                variants={{
                  open: {
                    y: "0%",
                    transition: { duration: 0.75, ease: EASE_ELEGANT, delay: index * 0.07 },
                  },
                  closed: {
                    y: "-102%",
                    transition: { duration: 0.55, ease: EASE_ELEGANT, delay: (STRIPS - 1 - index) * 0.05 },
                  },
                }}
                style={{ transformOrigin: "top" }}
              >
                {/* 布の縁と陰 */}
                <span className="absolute inset-y-0 right-0 w-px bg-white/8" />
                <span className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
                {index === 1 && (
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-brush text-[14rem] leading-none text-ivory/[0.05]">
                    {siteConfig.brand.emblem}
                  </span>
                )}
              </motion.div>
            ))}
            {/* 暖簾の掛け棒 */}
            <motion.span
              className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,#3a2a1c,#8b6a45,#3a2a1c)]"
              variants={{ open: { opacity: 1 }, closed: { opacity: 0 } }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* 中身 */}
          <motion.div
            className="relative flex h-full flex-col"
            variants={{
              open: { opacity: 1, transition: { duration: 0.5, delay: 0.5 } },
              closed: { opacity: 0, transition: { duration: 0.2 } },
            }}
          >
            <div className="flex h-20 items-center justify-between px-6">
              <Logo onClick={onClose} />
              <button
                type="button"
                onClick={onClose}
                aria-label={t.a11y.closeMenu}
                className="relative flex h-11 w-11 items-center justify-center text-ivory/80 transition-colors hover:text-gold"
              >
                <span aria-hidden className="absolute h-px w-6 rotate-45 bg-current" />
                <span aria-hidden className="absolute h-px w-6 -rotate-45 bg-current" />
              </button>
            </div>

            <motion.nav
              aria-label="Mobile"
              variants={staggerContainer(0.08, 0.6)}
              initial="hidden"
              animate="visible"
              className="flex flex-1 flex-col items-center justify-center gap-7 px-6 pb-16"
            >
              {items.map((item) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  variants={fadeUp}
                  className="group flex items-center gap-5"
                >
                  <span className="font-brush text-xl text-gold/80">{item.numeral}</span>
                  <span className="font-display text-2xl tracking-display text-ivory transition-colors duration-500 group-hover:text-gold">
                    {item.label}
                  </span>
                </motion.a>
              ))}

              <motion.div variants={fadeUp} className="mt-6 flex flex-col items-center gap-5">
                <GoldButton href={siteConfig.links.directions} external onClick={onClose}>
                  {t.common.directions}
                </GoldButton>
                <a
                  href={siteConfig.links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-latin text-[11px] tracking-[0.3em] text-ivory/60 transition-colors hover:text-gold"
                >
                  @{siteConfig.brand.instagramHandle}
                </a>
              </motion.div>
            </motion.nav>

            <motion.div
              aria-hidden
              className="absolute bottom-10 left-1/2 h-px w-24 -translate-x-1/2 hairline-gold"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, ease: EASE_ELEGANT, delay: 0.9 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
