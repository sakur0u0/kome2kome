"use client";

import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import { getDictionary } from "./dictionaries";
import { LanguageContext, type LanguageContextValue } from "./LanguageContext";
import { localeStore } from "./localeStore";
import { LOCALE_META } from "./locales";
import type { Locale } from "./types";

interface LanguageProviderProps {
  children: React.ReactNode;
}

/**
 * 3ヶ国語（ja / en / zh）の状態管理プロバイダー。
 * - useSyncExternalStore でロケールを購読（SSR は ja、クライアントで検出値へ）
 * - <html lang> と data-lang を同期し、言語別フォントスタックを CSS 側で切り替える
 */
export function LanguageProvider({ children }: LanguageProviderProps) {
  const locale = useSyncExternalStore(
    localeStore.subscribe,
    localeStore.getSnapshot,
    localeStore.getServerSnapshot,
  );

  const setLocale = useCallback((next: Locale) => {
    localeStore.set(next);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = LOCALE_META[locale].htmlLang;
    root.dataset.lang = locale;
  }, [locale]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      t: getDictionary(locale),
      meta: LOCALE_META[locale],
    }),
    [locale, setLocale],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}
