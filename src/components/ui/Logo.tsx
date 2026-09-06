"use client";

import { siteConfig } from "@/lib/site.config";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  className?: string;
  /** ヒーロー中央などで使う大きめの表示 */
  size?: "sm" | "lg";
  /** モバイル幅ではワードマークを隠しエンブレムのみにする（固定ヘッダー用） */
  compact?: boolean;
  onClick?: () => void;
}

/**
 * ブランドロゴ。実店舗のマーク（白い円 × 筆文字「米」× 朱の落款）を HTML で再現。
 * 文字色は --tone-fg 系の変数に従い、和紙の幕の上では自動的に墨色になる。
 */
export function Logo({ className, size = "sm", compact = false, onClick }: LogoProps) {
  const { brand, location } = siteConfig;
  const large = size === "lg";

  return (
    <a
      href="#top"
      onClick={onClick}
      aria-label={brand.fullNameJa}
      className={cn(
        "group inline-flex items-center gap-3 whitespace-nowrap",
        large && "flex-col gap-5 md:gap-6",
        className,
      )}
    >
      {/* 円形エンブレム */}
      <span
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-full bg-ivory text-sumi",
          "shadow-[0_0_0_1px_rgba(26,26,26,0.12)] transition-all duration-700 ease-elegant",
          "group-hover:shadow-gold-glow-sm",
          large ? "h-24 w-24 md:h-28 md:w-28" : "h-11 w-11",
        )}
      >
        <span
          className={cn(
            "font-brush leading-none",
            large ? "text-[3.4rem] md:text-[4rem]" : "text-[1.55rem]",
          )}
          style={{ transform: "translateY(-2%)" }}
        >
          {brand.emblem}
        </span>
        {/* 落款 */}
        <span
          aria-hidden
          className={cn(
            "absolute flex items-center justify-center bg-shu font-brush leading-none text-ivory",
            large
              ? "bottom-3 right-2 h-5 w-5 rounded-[2px] text-[8px] md:bottom-3.5 md:right-2.5 md:h-6 md:w-6 md:text-[9px]"
              : "bottom-1 right-0.5 h-2.5 w-2.5 rounded-[1px] text-[5px]",
          )}
        >
          {large ? brand.seal : ""}
        </span>
      </span>

      {/* ワードマーク */}
      <span
        className={cn(
          "flex-col leading-none",
          large && "items-center gap-2.5",
          compact && !large ? "hidden sm:flex" : "flex",
        )}
      >
        <span
          className={cn(
            "font-kanji text-(--tone-fg) transition-colors duration-700",
            large ? "text-2xl tracking-[0.5em] md:text-3xl" : "text-[15px] tracking-[0.4em]",
          )}
        >
          {brand.nameJa}
        </span>
        <span
          className={cn(
            "font-latin text-(--tone-fg-muted) transition-colors duration-700",
            large ? "text-[10px] tracking-[0.5em] md:text-[11px]" : "mt-1 text-[9px] tracking-[0.4em]",
          )}
        >
          {location.area} · {location.city}
        </span>
      </span>
    </a>
  );
}
