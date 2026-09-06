import type { Variants } from "framer-motion";
import {
  EASE_ELEGANT,
  heroTransition,
  imageRevealTransition,
  revealTransition,
} from "./transitions";

/**
 * 共通の Variants 定義。
 * 親コンテナが "hidden" / "visible" を制御し、子はラベルを継承する。
 */

/** 下から上へスリップイン（Y: 50 -> 0, Opacity: 0 -> 1） */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: revealTransition },
};

/** 控えめなフェード */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.2, ease: "easeInOut" } },
};

/** ヒーロー用：ゆっくり浮き上がる（1.5s / EaseInOut） */
export const heroRise: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: heroTransition },
};

/** 子要素を順番に出現させるコンテナ */
export function staggerContainer(
  staggerChildren = 0.18,
  delayChildren = 0,
): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren, delayChildren },
    },
  };
}

/** 水平のヘアラインが中央から伸びる */
export const lineGrow: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 1.3, ease: EASE_ELEGANT },
  },
};

/** 垂直のヘアラインが上から伸びる */
export const lineGrowY: Variants = {
  hidden: { scaleY: 0, opacity: 0 },
  visible: {
    scaleY: 1,
    opacity: 1,
    transition: { duration: 1.3, ease: EASE_ELEGANT },
  },
};

/** 画像フレーム：下から浮上 */
export const imageFrame: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: imageRevealTransition },
};

/** 画像本体：少し拡大した状態から等倍へ（ホバーの 1.05 は CSS 側で重ねる） */
export const imageZoom: Variants = {
  hidden: { scale: 1.18 },
  visible: { scale: 1, transition: imageRevealTransition },
};

/** 画像を覆う幕：上へ退く */
export const curtain: Variants = {
  hidden: { scaleY: 1 },
  visible: {
    scaleY: 0,
    transition: { duration: 1.3, ease: EASE_ELEGANT, delay: 0.15 },
  },
};

/** 背景の装飾文字：薄く浮かび上がる */
export const motifReveal: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 2.2, ease: EASE_ELEGANT },
  },
};
