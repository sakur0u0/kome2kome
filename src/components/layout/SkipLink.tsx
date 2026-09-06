"use client";

import { useLanguage } from "@/lib/i18n";

/** キーボード操作時のみ現れる「本文へスキップ」リンク */
export function SkipLink() {
  const { t } = useLanguage();

  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:border focus:border-gold focus:bg-base focus:px-4 focus:py-2 focus:font-latin focus:text-xs focus:tracking-[0.2em] focus:text-gold"
    >
      {t.a11y.skipToContent}
    </a>
  );
}
