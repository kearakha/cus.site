"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ROOT_DOMAIN } from "@/lib/domain";
import { Reveal, Item } from "./motion";
import { Mockup } from "./Mockup";

type Vibe = "casual" | "professional" | "elegant";

const TABS: { vibe: Vibe; label: string; src: string; subdomain: string }[] = [
  {
    vibe: "casual",
    label: "Santai & Kekinian",
    src: "/landing/kopisrawung.png",
    subdomain: "kopisrawung",
  },
  {
    vibe: "professional",
    label: "Profesional & Tepercaya",
    src: "/landing/klinik-pratama.png",
    subdomain: "klinik-pratama",
  },
  {
    vibe: "elegant",
    label: "Elegan & Mewah",
    src: "/landing/spa-bali.png",
    subdomain: "spa-bali",
  },
];

/** Tab vibe → crossfade mockup. Spec: .docs/DESIGN.md §Komponen (tab switcher) + §Motion (crossfade 300ms). */
export function TemplateSwitcher() {
  const [active, setActive] = useState<Vibe>("casual");
  const reduced = useReducedMotion();
  const current = TABS.find((t) => t.vibe === active)!;

  return (
    <section className="bg-cream py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="text-center">
          <Item>
            <h2 className="font-display text-4xl font-bold tracking-tight">
              3 template, pilih yang paling cocok
            </h2>
          </Item>
          <Item>
            <p className="mt-3 text-ink-2">
              Ganti tab, lihat gimana vibe-nya berubah total.
            </p>
          </Item>
        </Reveal>

        <Reveal className="mt-10 flex justify-center">
          <Item>
            <div
              role="tablist"
              aria-label="Pilih vibe template"
              className="inline-flex gap-1 rounded-full border border-line bg-cream p-1"
            >
              {TABS.map((tab) => (
                <button
                  key={tab.vibe}
                  type="button"
                  role="tab"
                  aria-selected={active === tab.vibe}
                  onClick={() => setActive(tab.vibe)}
                  className={`min-h-11 rounded-full px-5 py-2 text-sm font-semibold transition duration-200 ease-out ${
                    active === tab.vibe
                      ? "bg-navy text-white"
                      : "text-ink-2 hover:text-navy"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </Item>
        </Reveal>

        <Reveal className="mt-10">
          <Item>
            <div className="mx-auto max-w-3xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.vibe}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduced ? 0.15 : 0.3 }}
                >
                  <Mockup
                    src={current.src}
                    alt={`Contoh website vibe ${current.label}`}
                    url={`${current.subdomain}.${ROOT_DOMAIN}`}
                    sizes="(min-width: 1024px) 768px, 100vw"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </Item>
        </Reveal>
      </div>
    </section>
  );
}
