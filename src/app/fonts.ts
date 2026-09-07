import { Cinzel, Inter, Noto_Serif_JP, Noto_Serif_SC, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";

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

/**
 * 筆文字（Yuji Syuku, SIL OFL）。章番号（壱・弐・参…）やロゴの「米」、落款の「祇園」に使う。
 * 使用する文字は「壱弐参四五六七一二三米祇園」の 13 字だけなので、
 * Google Fonts の text= API で切り出した 5.6KB のサブセットを同梱し、preload する
 * （フル CJK の分割配信では筆文字だけ遅れて「ポンと出る」ため）。
 *
 * 筆文字で新しい文字を使うときは、次のコマンドでサブセットを作り直すこと:
 *   curl "https://fonts.googleapis.com/css2?family=Yuji+Syuku&text=<使用文字を URL エンコード>" -A "Mozilla/5.0"
 *   → 返ってきた CSS 内の woff2 URL を src/app/fonts/yuji-syuku-subset.woff2 に保存
 */
export const yujiSyuku = localFont({
  src: "./fonts/yuji-syuku-subset.woff2",
  weight: "400",
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
