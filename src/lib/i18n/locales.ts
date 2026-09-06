import { DEFAULT_LOCALE, type Locale } from "./types";

export interface LocaleMeta {
  /** トグルに表示する短いラベル */
  label: string;
  /** <html lang> に設定する値 */
  htmlLang: string;
  /** スクリーンリーダー向けの言語名 */
  nativeName: string;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  ja: { label: "JP", htmlLang: "ja", nativeName: "日本語" },
  en: { label: "EN", htmlLang: "en", nativeName: "English" },
  zh: { label: "CN", htmlLang: "zh-Hans", nativeName: "简体中文" },
};

/**
 * ブラウザの言語設定から最適なロケールを推定する。
 * 日本語 → ja / 中国語(簡体・繁体問わず) → zh / それ以外 → en
 * 訪日外国人が主ターゲットのため、判定不能時は英語を既定とする。
 */
export function detectLocale(languages: readonly string[]): Locale {
  for (const raw of languages) {
    const tag = raw.toLowerCase();
    if (tag.startsWith("ja")) return "ja";
    if (tag.startsWith("zh")) return "zh";
    if (tag.startsWith("en")) return "en";
  }
  return languages.length > 0 ? "en" : DEFAULT_LOCALE;
}
