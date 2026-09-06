"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import { fadeUp } from "@/lib/motion";

export interface RevealItemProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  /** 既定は fadeUp（Y: 50 -> 0 / Opacity: 0 -> 1） */
  variants?: Variants;
}

/**
 * <Reveal> の子として置く要素。親の "hidden" / "visible" を継承して出現する。
 */
export function RevealItem({ variants = fadeUp, children, ...rest }: RevealItemProps) {
  return (
    <motion.div variants={variants} {...rest}>
      {children}
    </motion.div>
  );
}
