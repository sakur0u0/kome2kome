"use client";

import { createContext } from "react";
import type { LocaleMeta } from "./locales";
import type { Dictionary, Locale } from "./types";

export interface LanguageContextValue {
  /** 現在のロケール */
  locale: Locale;
  /** ロケールを切り替える（localStorage に永続化） */
  setLocale: (locale: Locale) => void;
  /** 現在のロケールの辞書 */
  t: Dictionary;
  /** 現在のロケールのメタ情報（ラベル・lang 属性など） */
  meta: LocaleMeta;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);
