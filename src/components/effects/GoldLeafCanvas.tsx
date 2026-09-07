"use client";

import { useReducedMotion, useScroll } from "framer-motion";
import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface Flake {
  x: number;
  y: number;
  size: number;
  rotation: number;
  spin: number;
  vy: number;
  vx: number;
  phase: number;
  alpha: number;
  /** 金箔の色。位置に依存しないので生成時に一度だけ作る */
  paint: CanvasGradient | string;
}

const MAX_FLAKES = 90;
const MIN_FLAKES = 0;
/** 金箔が舞い始めるページ位置（0〜1）と最大密度に達する位置 */
const START = 0.42;
const FULL = 0.8;

function createFlake(ctx: CanvasRenderingContext2D, width: number, height: number, fromTop = false): Flake {
  const size = 1.6 + Math.random() * 3.2;
  const gradient = ctx.createLinearGradient(-size, 0, size, 0);
  gradient.addColorStop(0, "#9a7b22");
  gradient.addColorStop(0.5, "#f3e3ac");
  gradient.addColorStop(1, "#d4af37");
  return {
    x: Math.random() * width,
    y: fromTop ? -10 : Math.random() * height,
    size,
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 0.03,
    vy: 0.18 + Math.random() * 0.42,
    vx: (Math.random() - 0.5) * 0.25,
    phase: Math.random() * Math.PI * 2,
    alpha: 0.35 + Math.random() * 0.55,
    paint: gradient,
  };
}

/**
 * 画面全体に舞う金箔。
 * ページのスクロール進捗に応じて密度が増し、「墨から金へ」豪華さが増していく。
 *
 * 負荷対策:
 * - mix-blend-mode は使わない（固定レイヤーのブレンドは Safari でスクロールごとに全画面再合成になる）
 * - タッチ端末は dpr 1・枚数を抑える
 * - 金箔が 1 枚もない区間（ページ前半）は rAF を止め、スクロールで目覚める
 * - reduced-motion / 非表示タブでは停止
 */
export function GoldLeafCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const coarse = useMediaQuery("(pointer: coarse)");
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let running = true;
    let idle = false;
    const flakes: Flake[] = [];

    const resize = () => {
      dpr = coarse ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const targetCount = () => {
      const p = scrollYProgress.get();
      const t = Math.min(1, Math.max(0, (p - START) / (FULL - START)));
      // 画面面積に比例させ、小さな画面で密度が過剰にならないようにする
      const area = Math.min(1, (width * height) / (1440 * 900));
      const max = Math.round(MAX_FLAKES * (0.35 + 0.65 * area) * (coarse ? 0.6 : 1));
      // easeInQuad で後半に一気に増える
      return Math.round(MIN_FLAKES + (max - MIN_FLAKES) * t * t);
    };

    const draw = (now: number) => {
      if (!running) return;

      const desired = targetCount();
      if (flakes.length < desired) {
        flakes.push(createFlake(ctx, width, height, true));
      } else if (flakes.length > desired && flakes.length > 0 && Math.random() < 0.08) {
        flakes.pop();
      }

      // 描くものがなければ休眠。スクロールで再開する
      if (flakes.length === 0 && desired === 0) {
        ctx.clearRect(0, 0, width, height);
        idle = true;
        return;
      }
      frame = requestAnimationFrame(draw);

      ctx.clearRect(0, 0, width, height);
      const time = now / 1000;

      for (const flake of flakes) {
        flake.y += flake.vy;
        flake.x += flake.vx + Math.sin(time * 0.8 + flake.phase) * 0.18;
        flake.rotation += flake.spin;

        if (flake.y > height + 12) {
          Object.assign(flake, createFlake(ctx, width, height, true));
        }
        if (flake.x < -12) flake.x = width + 12;
        if (flake.x > width + 12) flake.x = -12;

        // 傾きで光が反射するように明滅
        const twinkle = 0.55 + 0.45 * Math.abs(Math.sin(flake.rotation * 2 + time * 1.4 + flake.phase));
        ctx.save();
        ctx.translate(flake.x, flake.y);
        ctx.rotate(flake.rotation);
        ctx.globalAlpha = flake.alpha * twinkle;
        ctx.fillStyle = flake.paint;
        ctx.fillRect(-flake.size, -flake.size * 0.55, flake.size * 2, flake.size * 1.1);
        ctx.restore();
      }
    };

    const wake = () => {
      if (!running || !idle) return;
      if (targetCount() > 0) {
        idle = false;
        frame = requestAnimationFrame(draw);
      }
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      } else if (!running) {
        running = true;
        idle = false;
        frame = requestAnimationFrame(draw);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    const unsubscribe = scrollYProgress.on("change", wake);
    frame = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      unsubscribe();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced, coarse, scrollYProgress]);

  if (reduced) return null;

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-40" />;
}
