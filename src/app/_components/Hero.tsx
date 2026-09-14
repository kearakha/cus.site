import Link from "next/link";
import { ArrowRight, ExternalLink, Zap } from "lucide-react";
import { ROOT_DOMAIN } from "@/lib/domain";
import { Reveal, Item } from "./motion";
import { Mockup } from "./Mockup";

/** Server component — motion cuma di Reveal/Item, Link + Image tetap SSR. */
export function Hero({ demoUrl }: { demoUrl: string }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 lg:py-32">
      <Reveal
        immediate
        className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10"
      >
        <div className="lg:col-span-5">
          <Item duration={0.45}>
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-ink-2">
              <Zap className="h-3.5 w-3.5 text-orange-deep" strokeWidth={2.5} />
              5 menit jadi · AI yang nulis
            </p>
          </Item>

          <Item duration={0.45}>
            <h1 className="mt-5 text-balance font-display text-[clamp(2.5rem,4vw+1rem,4rem)] font-extrabold leading-[1.05] tracking-tight">
              Website untuk bisnis kamu,{" "}
              <span className="text-orange-deep">tanpa ribet.</span>
            </h1>
          </Item>

          <Item duration={0.45}>
            <p className="mt-6 max-w-[60ch] text-xl leading-normal text-ink-2">
              Isi 5 langkah singkat. AI yang nulis copywriting-nya. Website UMKM
              kamu langsung jadi di{" "}
              <code className="font-mono text-base text-navy">
                nama.{ROOT_DOMAIN}
              </code>
              .
            </p>
          </Item>

          <Item duration={0.45}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/buat"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-orange px-6 py-3 font-semibold text-navy transition duration-200 ease-out hover:-translate-y-1 hover:shadow-card-hover active:translate-y-0 active:bg-orange-deep"
              >
                Mulai Bikin Website Gratis
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </Link>
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-navy px-6 py-3 font-semibold text-navy transition duration-200 ease-out hover:-translate-y-1 hover:bg-navy hover:text-white"
              >
                Lihat Contoh Live
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
              </a>
            </div>
          </Item>

          <Item duration={0.45}>
            <p className="mt-6 text-sm text-ink-2">
              Tidak butuh kartu kredit · Langsung jadi · Bisa edit kapan aja
            </p>
          </Item>
        </div>

        <Item duration={0.45} className="lg:col-span-7">
          <Mockup
            src="/landing/barber-in.png"
            alt="Website Barber In yang dibuat dengan Cus.site"
            priority
            sizes="(min-width: 1024px) 640px, 100vw"
          />
        </Item>
      </Reveal>
    </section>
  );
}
