"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";

/**
 * ページが threshold(px) 以上スクロールされたかを返す。
 * 固定ヘッダーの背景（透過 → ガラス）切り替えに使用。
 */
export function useScrolled(threshold = 24): boolean {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > threshold);
  });

  return scrolled;
}
