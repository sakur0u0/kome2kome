/**
 * サイト全体で共有する定数。
 * 店舗情報は食べログ / Instagram / 紙面記事（2026-09 時点）に基づく。
 * 画像は実写真の受領までの仮素材（Wikimedia Commons / Unsplash）。
 */

const MAPS_QUERY = "米と米 京都祇園店 京都府京都市東山区祇園町南側524-2 祇園和喜ビル2F";
/**
 * public/ 配下の画像パス。GitHub Pages（/<repo>/ 配下で配信）では basePath を前置する。
 * next/image は unoptimized 時に basePath を付けないため、ここで吸収する。
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const PLACEHOLDER = `${BASE_PATH}/img/placeholder`;

export const siteConfig = {
  brand: {
    /** ラテン表記（ヘッダー・フッター） */
    name: "KOME TO KOME",
    /** 和文表記 */
    nameJa: "米と米",
    /** 正式店名 */
    fullNameJa: "米と米 京都祇園店",
    /** ロゴ中央の筆文字 */
    emblem: "米",
    /** 落款に入れる文字 */
    seal: "祇園",
    tagline: "米の美味しさを、五感で。",
    instagramHandle: "kometokome_gion",
  },

  location: {
    city: "KYOTO",
    area: "GION",
    address: "京都府京都市東山区祇園町南側524-2 祇園和喜ビル 2F",
    addressEn: "Gion Waki Bldg. 2F, 524-2 Gionmachi Minamigawa, Higashiyama-ku, Kyoto",
    addressZh: "京都府京都市东山区祇园町南侧524-2 祇园和喜大厦 2F",
    hours: "10:00 – 20:00",
    opened: "2026-03-11",
  },

  links: {
    instagram: "https://www.instagram.com/kometokome_gion/",
    /** 主 CTA: Google マップで経路 */
    directions: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAPS_QUERY)}`,
    map: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAPS_QUERY)}`,
    tabelog: "https://tabelog.com/kyoto/A2601/A260301/26044617/",
    kanjivg: "https://kanjivg.tagaini.net/",
  },

  /**
   * 画像。Wikimedia Commons 由来の仮素材は public/img/placeholder/ に同梱
   * （出典は同ディレクトリの CREDITS.md）。実写真の受領後に差し替える。
   */
  images: {
    hero: {
      src: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000&auto=format&fit=crop",
    },
    /** 和紙の質感タイル（自前生成・継ぎ目なし） */
    washiTile: { src: `${BASE_PATH}/img/texture/washi-tile.webp` },
    /** 壱: 水墨画の気配（長谷川等伯「松林図屏風」Public Domain） */
    sumie: { src: `${PLACEHOLDER}/sumie-pine-trees.jpg` },
    /** 弐: こだわり 3 柱 */
    craftRice: { src: `${PLACEHOLDER}/craft-rice-paddy.jpg` },
    craftCrepe: { src: `${PLACEHOLDER}/menu-crepe.jpg` },
    craftRitual: { src: `${PLACEHOLDER}/menu-montblanc.jpg` },
    /** 参: 品書き */
    menuMontblanc: { src: `${PLACEHOLDER}/menu-montblanc.jpg` },
    menuDaifuku: { src: `${PLACEHOLDER}/menu-daifuku.jpg` },
    menuSesame: { src: `${PLACEHOLDER}/menu-sesame.jpg` },
    menuSakura: { src: `${PLACEHOLDER}/menu-crepe.jpg` },
    menuDango: { src: `${PLACEHOLDER}/menu-dango.jpg` },
    /** 五: お米 */
    rice: { src: `${PLACEHOLDER}/rice-koshihikari.jpg` },
    /** 六: 空気（祇園の路地・八坂神社） */
    air: [
      { src: `${PLACEHOLDER}/air-hanamikoji-1.jpg` },
      { src: `${PLACEHOLDER}/air-hanamikoji-2.jpg` },
      { src: `${PLACEHOLDER}/air-yasaka-gate.jpg` },
      { src: `${PLACEHOLDER}/air-gion-evening.jpg` },
      { src: `${PLACEHOLDER}/air-gion-street.jpg` },
      { src: `${PLACEHOLDER}/air-yasaka-lanterns.jpg` },
    ],
  },

  /** 品書き（名称・説明は辞書側。価格は税込・2026-09 時点の公開情報） */
  menu: [
    { id: "montblanc", price: 1650, signature: true, seasonal: false, image: "menuMontblanc" },
    { id: "daifuku", price: null, signature: false, seasonal: false, image: "menuDaifuku" },
    { id: "sesame", price: null, signature: false, seasonal: false, image: "menuSesame" },
    { id: "sakura", price: 1650, signature: false, seasonal: true, image: "menuSakura" },
    { id: "dango", price: null, signature: false, seasonal: false, image: "menuDango" },
  ],

  /** 章の装飾漢字（言語共通の意匠） */
  motifs: {
    manifesto: "米",
    craft: "極",
    menu: "味",
    ritual: "静",
    rice: "米",
    air: "縁",
    way: "道",
  },

  /** 章番号（筆文字） */
  numerals: ["壱", "弐", "参", "四", "五", "六", "七"],

  sections: {
    manifesto: "manifesto",
    craft: "craft",
    menu: "menu",
    ritual: "ritual",
    rice: "rice",
    air: "air",
    way: "way",
  },
} as const;

export type SectionKey = keyof typeof siteConfig.sections;
export type MenuId = (typeof siteConfig.menu)[number]["id"];
export type ImageKey = keyof typeof siteConfig.images;
