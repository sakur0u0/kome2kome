"use client";

import { useEffect, useState } from "react";

export type Tone = "dark" | "light";

/**
 * 固定ヘッダーの真下にある幕（data-tone を持つセクション）のトーンを返す。
 * 和紙の幕の上ではヘッダーの文字色・ガラス色を墨側へ切り替えるために使う。
 *
 * @param probeY ヘッダー内で判定に使う画面上の Y 座標(px)
 */
export function useHeaderTone(probeY = 44): Tone {
  const [tone, setTone] = useState<Tone>("dark");

  useEffect(() => {
    let frame = 0;
    const sections = () => Array.from(document.querySelectorAll<HTMLElement>("[data-tone]"));

    const measure = () => {
      frame = 0;
      let next: Tone = "dark";
      for (const section of sections()) {
        // ヘッダー自身は除外
        if (section.tagName === "HEADER") continue;
        const rect = section.getBoundingClientRect();
        if (rect.top <= probeY && rect.bottom > probeY) {
          next = section.dataset.tone === "light" ? "light" : "dark";
          break;
        }
      }
      setTone((current) => (current === next ? current : next));
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [probeY]);

  return tone;
}
