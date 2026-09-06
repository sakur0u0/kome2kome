"use client";

import { useReducedMotion, useScroll } from "framer-motion";
import { useEffect, useRef } from "react";

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
}

const MAX_FLAKES = 90;
const MIN_FLAKES = 0;
/** 金箔が舞い始めるページ位置（0〜1）と最大密度に達する位置 */
const START = 0.42;
const FULL = 0.8;

function createFlake(width: number, height: number, fromTop = false): Flake {
  return {
    x: Math.random() * width,
    y: fromTop ? -10 : Math.random() * height,
    size: 1.6 + Math.random() * 3.2,
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 0.03,
    vy: 0.18 + Math.random() * 0.42,
    vx: (Math.random() - 0.5) * 0.25,
    phase: Math.random() * Math.PI * 2,
    alpha: 0.35 + Math.random() * 0.55,
  };
}

/**
 * 画面全体に舞う金箔。
 * ページのスクロール進捗に応じて密度が増し、「墨から金へ」豪華さが増していく。
 * 描画は Canvas。reduced-motion / 非表示タブでは停止する。
 */
export function GoldLeafCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
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
    const flakes: Flake[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
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
      const max = Math.round(MAX_FLAKES * (0.35 + 0.65 * area));
      // easeInQuad で後半に一気に増える
      return Math.round(MIN_FLAKES + (max - MIN_FLAKES) * t * t);
    };

    const draw = (now: number) => {
      if (!running) return;
      frame = requestAnimationFrame(draw);

      const desired = targetCount();
      if (flakes.length < desired) {
        flakes.push(createFlake(width, height, true));
      } else if (flakes.length > desired && flakes.length > 0 && Math.random() < 0.08) {
        flakes.pop();
      }

      ctx.clearRect(0, 0, width, height);
      const time = now / 1000;

      for (const flake of flakes) {
        flake.y += flake.vy;
        flake.x += flake.vx + Math.sin(time * 0.8 + flake.phase) * 0.18;
        flake.rotation += flake.spin;

        if (flake.y > height + 12) {
          Object.assign(flake, createFlake(width, height, true));
        }
        if (flake.x < -12) flake.x = width + 12;
        if (flake.x > width + 12) flake.x = -12;

        // 傾きで光が反射するように明滅
        const twinkle = 0.55 + 0.45 * Math.abs(Math.sin(flake.rotation * 2 + time * 1.4 + flake.phase));
        ctx.save();
        ctx.translate(flake.x, flake.y);
        ctx.rotate(flake.rotation);
        ctx.globalAlpha = flake.alpha * twinkle;
        const gradient = ctx.createLinearGradient(-flake.size, 0, flake.size, 0);
        gradient.addColorStop(0, "#9a7b22");
        gradient.addColorStop(0.5, "#f3e3ac");
        gradient.addColorStop(1, "#d4af37");
        ctx.fillStyle = gradient;
        ctx.fillRect(-flake.size, -flake.size * 0.55, flake.size * 2, flake.size * 1.1);
        ctx.restore();
      }
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      } else if (!running) {
        running = true;
        frame = requestAnimationFrame(draw);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    frame = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced, scrollYProgress]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 mix-blend-screen"
    />
  );
}
