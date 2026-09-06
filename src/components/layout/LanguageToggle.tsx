"use client";

import { motion } from "framer-motion";
import { Fragment } from "react";
import { LOCALES, LOCALE_META, useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils/cn";

interface LanguageToggleProps {
  className?: string;
  /** 複数配置する場合にインジケーターの layoutId を分けるための識別子 */
  id?: string;
}

/**
 * JP / EN / CN の言語切り替えトグル（ガラスのピル型）。
 * 選択中の背景が layoutId によって滑らかに移動する。
 */
export function LanguageToggle({ className, id = "header" }: LanguageToggleProps) {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t.a11y.languageSwitcher}
      className={cn(
        "glass flex items-center rounded-full border border-(--tone-line) bg-(--tone-glass) px-1.5 py-1 transition-colors duration-700",
        className,
      )}
    >
      {LOCALES.map((code, index) => {
        const active = code === locale;
        const meta = LOCALE_META[code];

        return (
          <Fragment key={code}>
            {index > 0 && <span aria-hidden className="mx-0.5 h-3 w-px bg-(--tone-line)" />}
            <button
              type="button"
              lang={meta.htmlLang}
              aria-label={meta.nativeName}
              aria-pressed={active}
              onClick={() => setLocale(code)}
              className={cn(
                "relative px-3 py-1.5 font-latin text-[11px] tracking-[0.25em] transition-colors duration-500",
                active ? "text-(--tone-accent)" : "text-(--tone-fg-muted) hover:text-(--tone-fg)",
              )}
            >
              {active && (
                <motion.span
                  layoutId={`lang-indicator-${id}`}
                  aria-hidden
                  className="absolute inset-0 rounded-full border border-(--tone-accent) opacity-40"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                />
              )}
              <span className="relative">{meta.label}</span>
            </button>
          </Fragment>
        );
      })}
    </div>
  );
}
