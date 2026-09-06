"use client";

import { splitSentences } from "@/lib/i18n/text";
import { FadeSwap } from "@/components/motion/FadeSwap";

interface SentenceLinesProps {
  /** 言語切り替えのキー（locale） */
  id: string;
  text: string;
  className?: string;
}

/**
 * 本文を 1 文ずつ改行して表示し、言語切り替え時はクロスフェードする。
 */
export function SentenceLines({ id, text, className }: SentenceLinesProps) {
  return (
    <FadeSwap id={id} block className={className}>
      {splitSentences(text).map((sentence, index) => (
        <span key={index} className="block">
          {sentence}
        </span>
      ))}
    </FadeSwap>
  );
}
