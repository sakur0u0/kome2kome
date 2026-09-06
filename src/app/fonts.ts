import {
  Cinzel,
  Inter,
  Noto_Serif_JP,
  Noto_Serif_SC,
  Playfair_Display,
  Yuji_Syuku,
} from "next/font/google";

/**
 * 言語ごとのフォント定義。
 * CJK フォントは unicode-range で分割配信されるため preload は行わず、
 * CSS 変数だけを公開して globals.css 側で言語別に組み替える。
 */

export const notoSerifJP = Noto_Serif_JP({
  weight: ["300", "400", "500", "600"],
  preload: false,
  display: "swap",
  variable: "--font-noto-serif-jp",
});

export const notoSerifSC = Noto_Serif_SC({
  weight: ["300", "400", "500", "600"],
  preload: false,
  display: "swap",
  variable: "--font-noto-serif-sc",
});

/** 筆文字。章番号（壱・弐・参…）やロゴの「米」に使う */
export const yujiSyuku = Yuji_Syuku({
  weight: "400",
  preload: false,
  display: "swap",
  variable: "--font-yuji-syuku",
});

export const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-cinzel",
});

export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-playfair",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-inter",
});

export const fontVariables = [
  notoSerifJP.variable,
  notoSerifSC.variable,
  yujiSyuku.variable,
  cinzel.variable,
  playfairDisplay.variable,
  inter.variable,
].join(" ");
