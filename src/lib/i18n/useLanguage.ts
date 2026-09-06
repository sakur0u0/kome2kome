"use client";

import { useContext } from "react";
import { LanguageContext, type LanguageContextValue } from "./LanguageContext";

/** 現在の言語・辞書・切り替え関数を取得するフック */
export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage は <LanguageProvider> の内側で使用してください。");
  }
  return context;
}
