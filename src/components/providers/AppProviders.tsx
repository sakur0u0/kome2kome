"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { LanguageProvider } from "@/lib/i18n";

/**
 * アプリ全体のクライアントプロバイダー。
 * - LanguageProvider: 3ヶ国語の状態管理
 * - MotionConfig: OS の「視差効果を減らす」設定を尊重（reducedMotion="user"）
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LanguageProvider>
  );
}
