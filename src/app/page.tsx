import Link from 'next/link';
import { cookies } from 'next/headers';
import {
  Zap,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Edit3,
  Smartphone,
  Search,
  Rocket,
  Check,
  Mail,
  Phone,
  MapPin,
  Coffee,
  Scissors,
  Shirt,
  BookOpen,
  Stethoscope,
  ShoppingBag,
  Briefcase,
  Heart,
} from 'lucide-react';
import { OWNER_COOKIE_NAME, SESSION_COOKIE_NAME_EXPORT } from '@/lib/auth';
import { buildSiteUrl } from '@/components/TenantSite/types';

const DEMO_SUBDOMAIN = 'kopisrawung';

export default function HomePage() {
  // Check apakah user sudah login
  const isLoggedIn = Boolean(
    cookies().get(SESSION_COOKIE_NAME_EXPORT)?.value ||
    cookies().get(OWNER_COOKIE_NAME)?.value,
  );

  const demoUrl = buildSiteUrl({ subdomain: DEMO_SUBDOMAIN });

  return (
    <div className="min-h-screen flex flex-col">
      {/* === HEADER === */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Cus<span className="text-amber-500">.</span>site
            </span>
          </Link>
          <nav className="flex items-center gap-1.5 sm:gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1.5"
            >
              Login
            </Link>
            <Link
              href={isLoggedIn ? '/dashboard' : '/buat'}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition"
            >
              {isLoggedIn ? 'Dashboard' : 'Bikin Website'}
            </Link>
          </nav>
        </div>
      </header>

      {/* === HERO === */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-amber-50/30 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.08),transparent_50%)]" />
        <div className="relative mx-auto max-w-4xl px-4 py-16 sm:py-24 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 mb-6">
            <Zap className="h-3.5 w-3.5" strokeWidth={2.5} />
            5 menit jadi, AI yang nulis
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
            Website untuk bisnis kamu,
            <br />
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              tanpa ribet.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Isi 5 langkah singkat. AI yang nulis copywriting-nya. Website UMKM kamu
            langsung jadi di{' '}
            <code className="text-amber-700 font-mono text-base">nama.cus.site</code>.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/buat"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-7 py-3.5 text-base font-semibold text-white hover:bg-slate-800 transition shadow-lg shadow-slate-900/10"
            >
              <Rocket className="h-4 w-4" strokeWidth={2.5} />
              Mulai Bikin Website Gratis
            </Link>
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Lihat Contoh Live
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
            </a>
          </div>
          <p className="mt-6 text-xs text-slate-500">
            Tidak butuh kartu kredit · Langsung jadi · Bisa edit kapan aja
          </p>
        </div>
      </section>

      {/* === CARA KERJA === */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              3 langkah, website langsung jadi
            </h2>
            <p className="mt-3 text-slate-600">Gak perlu skill coding atau design.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Isi Form Wizard',
                desc: 'Nama bisnis, jenis, lokasi, WhatsApp, pilih vibe. Cuma 5 menit.',
                Icon: Edit3,
              },
              {
                step: '02',
                title: 'AI Generate Copy',
                desc: 'Cus Engine nulis headline, tentang bisnis, dan layanan sesuai vibe kamu.',
                Icon: Sparkles,
              },
              {
                step: '03',
                title: 'Langsung Live',
                desc: 'Website kamu otomatis online di nama.cus.site. Bisa langsung di-edit.',
                Icon: Rocket,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-6"
              >
                <span className="absolute -top-3 -left-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white text-xs font-bold">
                  {item.step}
                </span>
                <item.Icon className="h-8 w-8 text-slate-700 mb-3" strokeWidth={1.5} />
                <h3 className="font-semibold text-slate-900 mb-1.5">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === FITUR === */}
      <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200/60">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Bukan cuma jadi, tapi siap jualan
            </h2>
            <p className="mt-3 text-slate-600 max-w-xl mx-auto">
              Setiap website Cus.site punya fitur yang langsung bisa dipakai untuk
              jualan & dapat pelanggan.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                Icon: Sparkles,
                title: '3 Template Profesional',
                desc: 'Casual (kafe/laundry), Professional (klinik/bimbel), Elegant (spa/butik). Masing-masing dengan font & warna yang sesuai.',
              },
              {
                Icon: Heart,
                title: 'AI Copywriting Indonesia',
                desc: 'Bukan terjemahan feel. Cus Engine paham kultur lokal, pakai bahasa yang natural untuk target market kamu.',
              },
              {
                Icon: Edit3,
                title: 'Edit Langsung dari Website',
                desc: 'Owner punya Floating Admin Bar rahasia. Klik tombol, langsung edit copy & warna. Gak perlu login ke dashboard.',
              },
              {
                Icon: Smartphone,
                title: 'Mobile-First Design',
                desc: '90% traffic UMKM dari HP. Website otomatis optimal di semua ukuran layar, loading cepat, CTA WhatsApp langsung bisa diklik.',
              },
              {
                Icon: Search,
                title: 'SEO Lokal Ready',
                desc: 'Setiap website punya SEO title, description, dan struktur yang dioptimasi untuk "kafe di [kota kamu]" di Google.',
              },
              {
                Icon: Zap,
                title: 'Live dalam Hitungan Detik',
                desc: 'Begitu klik Generate, website langsung online. Share link ke customer, masuk WhatsApp, post IG — langsung bisa.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl bg-white border border-slate-200 p-5 hover:shadow-sm transition"
              >
                <f.Icon
                  className="h-7 w-7 text-slate-700 mb-3"
                  strokeWidth={1.5}
                />
                <h3 className="font-semibold text-slate-900 mb-1">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === UNTUK SIAPA === */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Untuk kamu yang lagi fokus jualan
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { Icon: Coffee, label: 'Kafe / Restoran' },
              { Icon: Scissors, label: 'Salon / Barbershop' },
              { Icon: Shirt, label: 'Laundry' },
              { Icon: BookOpen, label: 'Bimbel / Kursus' },
              { Icon: Stethoscope, label: 'Klinik' },
              { Icon: ShoppingBag, label: 'Toko Retail' },
              { Icon: Briefcase, label: 'Jasa Profesional' },
              { Icon: Sparkles, label: 'Spa / Butik' },
            ].map((c) => (
              <div
                key={c.label}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 hover:bg-white hover:border-slate-300 transition"
              >
                <c.Icon
                  className="h-8 w-8 mx-auto mb-2 text-slate-700"
                  strokeWidth={1.5}
                />
                <p className="text-sm font-medium text-slate-700">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === FINAL CTA === */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Website kamu nungguin.
          </h2>
          <p className="mt-3 text-slate-300 text-lg max-w-xl mx-auto">
            5 menit lagi, customer bisa klik WhatsApp kamu dari website yang baru.
          </p>
          <div className="mt-8">
            <Link
              href="/buat"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 hover:bg-amber-400 px-7 py-3.5 text-base font-semibold text-slate-900 transition shadow-lg shadow-amber-500/20"
            >
              <Rocket className="h-4 w-4" strokeWidth={2.5} />
              Bikin Website Sekarang
            </Link>
          </div>
          {isLoggedIn && (
            <p className="mt-4 text-sm text-slate-400">
              Sudah login ·{' '}
              <Link
                href="/dashboard"
                className="text-amber-300 hover:text-amber-200 underline"
              >
                Buka Dashboard
              </Link>
            </p>
          )}
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="font-bold text-slate-900">
                Cus<span className="text-amber-500">.</span>site
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Generator website instan untuk UMKM Indonesia.
              </p>
            </div>
            <div className="flex items-center gap-5 text-sm text-slate-600">
              <Link href="/buat" className="hover:text-slate-900">
                Bikin Website
              </Link>
              <Link href="/login" className="hover:text-slate-900">
                Login
              </Link>
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-slate-900"
              >
                Demo
                <ExternalLink className="h-3 w-3" strokeWidth={2} />
              </a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-100 text-xs text-slate-400 flex flex-col sm:flex-row justify-between gap-2">
            <p className="inline-flex items-center gap-1">
              © {new Date().getFullYear()} Cus.site. Made with
              <Zap className="h-3 w-3 fill-amber-400 text-amber-500" strokeWidth={2} />
              in Indonesia.
            </p>
            <p>Dibuat otomatis oleh Cus.site</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
