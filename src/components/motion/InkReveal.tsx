"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils/cn";

interface InkRevealProps {
  children: ReactNode;
  className?: string;
  /** 滲みが広がる時間（秒） */
  duration?: number;
  /** 表示までの遅延（秒） */
  delay?: number;
  /** 要素のどれだけが見えたら発火するか */
  amount?: number;
  /** 一度表示したら戻さない */
  once?: boolean;
  /** 親の Reveal 等から状態を受け取る場合 */
  active?: boolean;
  as?: "div" | "span";
}

/**
 * 墨が紙に落ちて滲むように中身を現す。
 *
 * - PC（fine pointer）: feTurbulence で歪ませた円を mask-image に使い、mask-size を 0% → 320% へ遷移
 * - タッチ端末: mask-size のアニメーションは Safari で毎フレーム CPU 再生成になるため、
 *   合成のみで済む clip-path: circle() + opacity にフォールバック
 */
export function InkReveal({
  children,
  className,
  duration = 1.8,
  delay = 0,
  amount = 0.3,
  once = true,
  active,
  as = "div",
}: InkRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once, amount });
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const shown = (active ?? inView) || reduced;

  const vars: Record<string, string | number> = finePointer
    ? {
        "--ink-size": shown ? "320%" : "0%",
        "--ink-duration": `${duration}s`,
        transitionDelay: `${delay}s`,
      }
    : {
        "--ink-clip": shown ? "75%" : "0%",
        "--ink-opacity": shown ? 1 : 0,
        "--ink-duration": `${duration}s`,
        transitionDelay: `${delay}s`,
      };
  const style = vars as CSSProperties;

  const mode = finePointer ? "ink-mask" : "ink-clip";

  const setRef = (node: HTMLElement | null) => {
    ref.current = node;
  };

  if (as === "span") {
    return (
      <span ref={setRef} style={style} className={cn(mode, "inline-block", className)}>
        {children}
      </span>
    );
  }
  return (
    <div ref={setRef} style={style} className={cn(mode, className)}>
      {children}
    </div>
  );
}
