import type { Transition } from "framer-motion";

/** 上質な減速カーブ（easeOutQuint 相当） */
export const EASE_ELEGANT = [0.22, 1, 0.36, 1] as const;

/** ゆったりとした S 字カーブ */
export const EASE_SILK = [0.65, 0, 0.35, 1] as const;

/** ヒーロー：ロゴ・キャッチコピーの浮上（仕様: 1.5s / EaseInOut） */
export const heroTransition: Transition = {
  duration: 1.5,
  ease: "easeInOut",
};

/** スクロール連動の出現 */
export const revealTransition: Transition = {
  duration: 1.1,
  ease: EASE_ELEGANT,
};

/** 画像の出現（少し長めに） */
export const imageRevealTransition: Transition = {
  duration: 1.6,
  ease: EASE_ELEGANT,
};

/** ホバー（スケール 1.05 + グロー） */
export const hoverTransition: Transition = {
  duration: 0.6,
  ease: EASE_ELEGANT,
};

/** 言語切り替え時のテキストのクロスフェード */
export const swapTransition: Transition = {
  duration: 0.5,
  ease: "easeInOut",
};

/** 背景画像の極めてゆっくりとしたズーム */
export const slowZoomTransition: Transition = {
  duration: 45,
  ease: "linear",
};
