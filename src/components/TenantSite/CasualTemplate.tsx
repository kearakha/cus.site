import type { TemplateProps } from './types';
import { buildWhatsappUrl } from './types';
import { Coffee, ArrowRight, Sparkles, Zap } from 'lucide-react';

/**
 * CasualTemplate — untuk Kafe, Laundry, Barbershop casual, Jajanan.
 * Vibe: santai, kekinian, hangat.
 * Font: sans-serif modern. Accent: warm color.
 * Copy: pakai "kamu".
 */
export function CasualTemplate({ data, siteUrl }: TemplateProps) {
  const { namaBisnis, lokasi, whatsapp, kontenAI, layanan } = data;
  const accent = data.kontenAI?.accentColor || 'f59e0b';

  if (!kontenAI) {
    return <NoContentPlaceholder nama={namaBisnis} />;
  }

  const waUrl = buildWhatsappUrl(whatsapp, namaBisnis);

  return (
    <div
      className="min-h-screen bg-white text-slate-900 font-casual"
      style={{ ['--accent' as never]: `#${accent}` }}
    >
      {/* Hero */}
      <section className="relative px-5 py-16 md:py-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(circle at top right, #${accent}, transparent 60%)`,
          }}
        />
        <div className="relative max-w-2xl mx-auto text-center">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ backgroundColor: `var(--accent)`, color: 'white' }}
          >
            <Coffee className="h-3.5 w-3.5" strokeWidth={2.5} />
            {lokasi}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            {kontenAI.heroHeadline}
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-xl mx-auto">
            {kontenAI.heroSubtext}
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center rounded-full px-7 py-3.5 text-base font-semibold text-white shadow-lg hover:scale-105 transition-transform"
            style={{
              backgroundColor: `var(--accent)`,
              boxShadow: `0 10px 25px -5px var(--accent)`,
            }}
          >
            {kontenAI.ctaText} →
          </a>
        </div>
      </section>

      {/* About */}
      <section className="px-5 py-12 md:py-16 bg-slate-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Tentang Kita</h2>
          <p className="text-slate-700 leading-relaxed">{kontenAI.aboutParagraph}</p>
        </div>
      </section>

      {/* Services */}
      {layanan.length > 0 && (
        <section className="px-5 py-12 md:py-16">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Yang Bisa Kamu Nikmati</h2>
            <div className="space-y-3">
              {layanan.map((s, i) => {
                const wa = buildWhatsappUrl(whatsapp, namaBisnis, s.title);
                return (
                  <a
                    key={s.id}
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 hover:border-slate-900 hover:shadow-md transition"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: `var(--accent)` }}
                        >
                          {i + 1}
                        </span>
                        <h3 className="font-semibold text-slate-900">{s.title}</h3>
                      </div>
                      <p className="mt-1.5 text-sm text-slate-600 ml-9">{s.description}</p>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-900 transition text-lg">→</span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Contact / CTA */}
      <section className="px-5 py-12 md:py-16 bg-slate-900 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 inline-flex items-center gap-2">
            Yuk mampir!
            <Sparkles className="h-6 w-6" strokeWidth={2} />
          </h2>
          <p className="text-slate-300 mb-6">{lokasi}</p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-base font-semibold hover:scale-105 transition-transform"
            style={{ backgroundColor: `var(--accent)`, color: 'white' }}
          >
            Chat WhatsApp Kita →
          </a>
        </div>
      </section>

      <footer className="px-5 py-6 text-center text-xs text-slate-400">
        <p className="inline-flex items-center justify-center gap-1">
          Dibuat otomatis oleh{' '}
          <a href="https://cus.site" className="hover:text-slate-600 underline">
            Cus.site
          </a>
          <Zap className="h-3 w-3" strokeWidth={2.5} />
        </p>
      </footer>
    </div>
  );
}

function NoContentPlaceholder({ nama }: { nama: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold">{nama}</h1>
        <p className="mt-2 text-slate-600">Website ini sedang disiapkan...</p>
      </div>
    </div>
  );
}
