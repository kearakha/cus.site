"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

// Token motion — sumber: .docs/DESIGN.md §Motion
const EASE = [0.22, 1, 0.36, 1] as const;
const STAGGER = 0.08;
const DISTANCE = 24;

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Animate saat mount (above-the-fold), bukan nunggu masuk viewport. */
  immediate?: boolean;
};

/**
 * Container reveal. Variants nyebar ke `Item` di bawahnya lewat context
 * Framer, jadi child yang server-rendered (Link, Image) tetap bisa ikut.
 */
export function Reveal({ children, className, immediate }: RevealProps) {
  const reduced = useReducedMotion();
  const variants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : STAGGER } },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      {...(immediate
        ? { animate: "show" }
        : { whileInView: "show", viewport: { once: true, amount: 0.2 } })}
    >
      {children}
    </motion.div>
  );
}

type ItemProps = {
  children: ReactNode;
  className?: string;
  /** Detik. Reveal 0.35 (default), hero entrance 0.45. */
  duration?: number;
};

/** Anak `Reveal`: fade-up 24px. Reduced motion → cuma fade 150ms. */
export function Item({ children, className, duration = 0.35 }: ItemProps) {
  const reduced = useReducedMotion();
  const variants: Variants = reduced
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.15 } },
      }
    : {
        hidden: { opacity: 0, y: DISTANCE },
        show: { opacity: 1, y: 0, transition: { duration, ease: EASE } },
      };

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
