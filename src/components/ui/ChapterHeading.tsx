"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { fadeUp, lineGrow } from "@/lib/motion";
import { siteConfig } from "@/lib/site.config";
import { cn } from "@/lib/utils/cn";
import { FadeSwap } from "@/components/motion/FadeSwap";
import { SealStamp } from "./SealStamp";

interface ChapterHeadingProps {
  /** 0 始まりの章番号（壱＝0） */
  index: number;
  label: string;
  heading: string;
  lead?: string;
  align?: "left" | "center";
  className?: string;
}

/**
 * 章の見出し。朱の落款（壱・弐・参…）→ ラテン語キャプション → 章題 → リード の順に現れる。
 * 文字色はトーン変数に従うため、和紙の幕でも漆黒の幕でもそのまま使える。
 * 親の "hidden" / "visible" を継承する。
 */
export function ChapterHeading({ index, label, heading, lead, align = "left", className }: ChapterHeadingProps) {
  const { locale } = useLanguage();
  const numeral = siteConfig.numerals[index] ?? String(index + 1);
  const centered = align === "center";

  return (
    <div className={cn("flex flex-col", centered && "items-center text-center", className)}>
      <motion.div variants={fadeUp} className={cn("flex items-center gap-4", centered && "justify-center")}>
        <SealStamp size="sm">{numeral}</SealStamp>
        <motion.span aria-hidden variants={lineGrow} className="h-px w-10 origin-left bg-(--tone-accent) opacity-70" />
        <span className="font-latin text-[11px] uppercase tracking-[0.4em] text-(--tone-accent)">
          <FadeSwap id={locale}>{label}</FadeSwap>
        </span>
      </motion.div>

      <motion.h2
        variants={fadeUp}
        className="mt-7 font-display text-3xl leading-[1.35] tracking-display text-(--tone-fg) md:text-4xl lg:text-[2.75rem]"
      >
        <FadeSwap id={locale}>{heading}</FadeSwap>
      </motion.h2>

      {lead && (
        <motion.p
          variants={fadeUp}
          className={cn(
            "mt-5 max-w-xl font-accent text-[15px] leading-relaxed text-(--tone-fg-muted) md:text-[1rem]",
            centered && "mx-auto",
          )}
        >
          <FadeSwap id={locale}>{lead}</FadeSwap>
        </motion.p>
      )}
    </div>
  );
}
