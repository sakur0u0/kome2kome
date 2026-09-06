"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { useRef, type CSSProperties, type ReactNode } from "react";
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
 * feTurbulence で歪ませた円を mask-image に使い、mask-size を 0% → 320% へ遷移させる。
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
  const shown = active ?? inView;

  const style = {
    "--ink-size": shown || reduced ? "320%" : "0%",
    "--ink-duration": `${duration}s`,
    transitionDelay: `${delay}s`,
  } as CSSProperties;

  const setRef = (node: HTMLElement | null) => {
    ref.current = node;
  };

  if (as === "span") {
    return (
      <span ref={setRef} style={style} className={cn("ink-mask inline-block", className)}>
        {children}
      </span>
    );
  }
  return (
    <div ref={setRef} style={style} className={cn("ink-mask", className)}>
      {children}
    </div>
  );
}
