import type { Dictionary } from "@/lib/i18n";
import { siteConfig } from "@/lib/site.config";

export interface NavItem {
  href: string;
  label: string;
  /** 章番号（壱・弐…） */
  numeral: string;
}

const NAV_KEYS = ["craft", "menu", "ritual", "rice", "air", "way"] as const;

/** 現在の辞書からナビゲーション項目を組み立てる（壱「宣言」はヒーロー直下のため省く） */
export function buildNavItems(t: Dictionary): NavItem[] {
  return NAV_KEYS.map((key, index) => ({
    href: `#${siteConfig.sections[key]}`,
    label: t.nav[key],
    numeral: siteConfig.numerals[index + 1],
  }));
}

/** ヘッダー（PC）に出す主要 4 項目 */
export function primaryNavItems(items: NavItem[]): NavItem[] {
  const keep = new Set([
    `#${siteConfig.sections.craft}`,
    `#${siteConfig.sections.menu}`,
    `#${siteConfig.sections.ritual}`,
    `#${siteConfig.sections.way}`,
  ]);
  return items.filter((item) => keep.has(item.href));
}
