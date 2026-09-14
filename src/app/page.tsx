import Link from "next/link";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
import { Zap, ExternalLink, Rocket } from "lucide-react";
import { OWNER_COOKIE_NAME, SESSION_COOKIE_NAME_EXPORT } from "@/lib/auth";
import { buildSiteUrl } from "@/components/TenantSite/types";
import { Hero } from "./_components/Hero";
import { Steps } from "./_components/Steps";
import { Features } from "./_components/Features";
import { TemplateSwitcher } from "./_components/TemplateSwitcher";
import { Reveal, Item } from "./_components/motion";

const DEMO_SUBDOMAIN = "barber-in";

export default function HomePage() {
  // Check apakah user sudah login
  const isLoggedIn = Boolean(
    cookies().get(SESSION_COOKIE_NAME_EXPORT)?.value ||
    cookies().get(OWNER_COOKIE_NAME)?.value,
  );

  const demoUrl = buildSiteUrl({ subdomain: DEMO_SUBDOMAIN });

  return (
    <div className="flex min-h-screen flex-col bg-cream font-body text-navy">
      {/* === HEADER === */}
      <header className="sticky top-0 z-10 border-b border-line bg-cream/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Cus<span className="text-amber-500">.</span>site
            </span>
          </Link>
          <nav className="flex items-center gap-1.5 sm:gap-3">
            <Link
              href="/login"
              className="px-2.5 py-1.5 text-sm font-medium text-ink-2 transition duration-200 hover:text-navy"
            >
              Login
            </Link>
            <Link
              href={isLoggedIn ? "/dashboard" : "/buat"}
              className="inline-flex items-center justify-center rounded-full bg-orange px-4 py-2 text-sm font-semibold text-navy transition duration-200 ease-out hover:-translate-y-1 hover:shadow-card-hover active:translate-y-0 active:bg-orange-deep"
            >
              {isLoggedIn ? "Dashboard" : "Bikin Website"}
            </Link>
          </nav>
        </div>
      </header>

      {/* === HERO === */}
      <Hero demoUrl={demoUrl} />

      {/* === CARA KERJA === */}
      <Steps />

      {/* === FITUR === */}
      <Features />

      {/* === TEMPLATE SWITCHER === */}
      <TemplateSwitcher />

      {/* === FINAL CTA === */}
      <section className="bg-cream py-24">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <Item>
              <div className="rounded-3xl bg-orange px-6 py-14 text-center sm:p-14">
                <h2 className="font-display text-3xl font-bold tracking-tight text-navy sm:text-4xl">
                  Website kamu nungguin.
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-lg text-navy/80">
                  5 menit lagi, customer bisa klik WhatsApp kamu dari website
                  yang baru.
                </p>
                <div className="mt-8">
                  <Link
                    href="/buat"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-7 py-3.5 text-base font-semibold text-white transition duration-200 ease-out hover:-translate-y-1 hover:shadow-card-hover"
                  >
                    <Rocket className="h-4 w-4" strokeWidth={2.5} />
                    Bikin Website Sekarang
                  </Link>
                </div>
                {isLoggedIn && (
                  <p className="mt-4 text-sm text-navy/70">
                    Sudah login ·{" "}
                    <Link
                      href="/dashboard"
                      className="underline hover:text-navy"
                    >
                      Buka Dashboard
                    </Link>
                  </p>
                )}
              </div>
            </Item>
          </Reveal>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="bg-navy py-10 text-slate-300">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="font-display font-bold text-white">
                Cus<span className="text-orange">.</span>site
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Generator website instan untuk UMKM Indonesia.
              </p>
            </div>
            <div className="flex items-center gap-5 text-sm">
              <Link href="/buat" className="hover:text-white">
                Bikin Website
              </Link>
              <Link href="/login" className="hover:text-white">
                Login
              </Link>
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-white"
              >
                Demo
                <ExternalLink className="h-3 w-3" strokeWidth={2} />
              </a>
            </div>
          </div>
          <div className="mt-6 flex flex-col justify-between gap-2 border-t border-navy-2 pt-6 text-xs text-slate-400 sm:flex-row">
            <p className="inline-flex items-center gap-1">
              © {new Date().getFullYear()} Cus.site. Made with
              <Zap
                className="h-3 w-3 fill-orange text-orange"
                strokeWidth={2}
              />
              in Indonesia.
            </p>
            <p>Dibuat otomatis oleh Cus.site</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
