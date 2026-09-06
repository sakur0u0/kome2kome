import type { MenuId } from "@/lib/site.config";

export const LOCALES = ["ja", "en", "zh"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ja";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** 章の見出しに共通する要素 */
export interface ChapterCopy {
  /** ラテン文字のキャプション（Manifesto / Craft …） */
  label: string;
  /** 章題（宣言 / こだわり …） */
  heading: string;
}

export interface CraftPillar {
  /** 小さな主題（お米 / 米粉生地 / 体験） */
  title: string;
  heading: string;
  body: string;
  imageAlt: string;
}

export interface RitualStep {
  title: string;
  body: string;
}

export interface MenuItemCopy {
  name: string;
  description: string;
  imageAlt: string;
}

export interface InfoRow {
  label: string;
  value: string;
}

/** 画面上のすべての文言を型で保証する辞書スキーマ */
export interface Dictionary {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    craft: string;
    menu: string;
    ritual: string;
    rice: string;
    air: string;
    way: string;
  };
  common: {
    /** 「Google マップで経路」 */
    directions: string;
    instagram: string;
    /** 税込表記 */
    taxIncluded: string;
    /** 横スクロールの誘導 */
    dragHint: string;
  };
  hero: {
    eyebrow: string;
    catchcopy: readonly string[];
    side: string;
    cta: string;
    ctaSecondary: string;
    scroll: string;
  };
  manifesto: ChapterCopy & {
    /** 大きな宣言文（行ごと） */
    statement: readonly string[];
    tagline: string;
    body: string;
  };
  craft: ChapterCopy & {
    lead: string;
    pillars: readonly [CraftPillar, CraftPillar, CraftPillar];
  };
  menu: ChapterCopy & {
    lead: string;
    items: Record<MenuId, MenuItemCopy>;
    signature: string;
    seasonal: string;
    priceAtCounter: string;
    note: string;
  };
  ritual: ChapterCopy & {
    lead: string;
    steps: readonly [RitualStep, RitualStep, RitualStep, RitualStep];
    caption: string;
  };
  rice: ChapterCopy & {
    lead: string;
    body: string;
    points: readonly string[];
    note: string;
    imageAlt: string;
  };
  air: ChapterCopy & {
    lead: string;
    photos: readonly { caption: string; alt: string }[];
  };
  way: ChapterCopy & {
    lead: string;
    address: string;
    rows: readonly InfoRow[];
    accessLabel: string;
    access: readonly string[];
    map: {
      shijo: string;
      hanamikoji: string;
      yasaka: string;
      kamo: string;
      station: string;
      here: string;
    };
    note: string;
  };
  footer: {
    location: string;
    tagline: string;
    rights: string;
    credits: string;
  };
  a11y: {
    skipToContent: string;
    languageSwitcher: string;
    openMenu: string;
    closeMenu: string;
    heroImage: string;
    sumieImage: string;
    ritualDrawing: string;
    inkMap: string;
  };
}
