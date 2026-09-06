"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * 墨点のカーソル（PC のみ）。
 * 中心の墨点はポインタに追従し、外側の金の輪はばねで少し遅れて追う。
 * リンクやボタンの上では輪が広がり、テキスト入力上では非表示にする。
 */
export function InkCursor() {
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery("(pointer: fine)");
  const enabled = finePointer && !reduced;
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.dataset.inkCursor = "on";

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
      const target = event.target as HTMLElement | null;
      setHovering(Boolean(target?.closest("a, button, [role='button'], [data-cursor='hover']")));
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.addEventListener("pointerenter", onEnter);

    return () => {
      delete document.documentElement.dataset.inkCursor;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.removeEventListener("pointerenter", onEnter);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[80] hidden md:block">
      {/* 金の輪（遅れて追う） */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: pressed ? 0.7 : hovering ? 1.9 : 1,
          borderColor: hovering ? "rgba(212,175,55,0.9)" : "rgba(212,175,55,0.55)",
        }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        className="absolute -left-4 -top-4 h-8 w-8 rounded-full border mix-blend-difference"
      />
      {/* 墨点 */}
      <motion.div
        style={{ x, y }}
        animate={{ opacity: visible ? 1 : 0, scale: pressed ? 1.6 : 1 }}
        transition={{ duration: 0.15 }}
        className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-ivory mix-blend-difference"
      />
    </div>
  );
}
