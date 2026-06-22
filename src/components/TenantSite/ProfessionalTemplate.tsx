import type { TemplateProps } from './types';
import { buildWhatsappUrl } from './types';
import { Phone } from 'lucide-react';

/**
 * ProfessionalTemplate — untuk Bimbel, Klinik, Jasa Hukum, Konsultan.
 * Vibe: sopan, terpercaya, terstruktur.
 * Font: sans-serif clean. Accent: blue/slate.
 * Copy: pakai "Anda".
 */
export function ProfessionalTemplate({ data, siteUrl }: TemplateProps) {
  const { namaBisnis, lokasi, whatsapp, kontenAI, layanan } = data;
  const accent = data.kontenAI?.accentColor || '1e40af';

  if (!kontenAI) {
    return <NoContentPlaceholder nama={namaBisnis} />;
  }

  const waUrl = buildWhatsappUrl(whatsapp, namaBisnis);

  return (
    <div
      className="min-h-screen bg-white text-slate-900 font-professional"
      style={{ ['--accent' as never]: `#${accent}` }}
    >
      {/* Hero — flat, clean, trust badges */}
      <section className="px-5 py-16 md:py-24 border-b border-slate-100">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-block h-px w-8 bg-slate-900" />
            <span className="text-xs font-semibold tracking-widest uppercase text-slate-600">
              {lokasi}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            {kontenAI.heroHeadline}
          </h1>
          <p className="mt-5 text-lg text-slate-600 max-w-2xl leading-relaxed">
            {kontenAI.heroSubtext}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition"
              style={{ backgroundColor: `var(--accent)` }}
            >
              {kontenAI.ctaText}
            </a>
            <a
              href={`https://wa.me/${whatsapp.replace(/^0/, '62')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <Phone className="h-4 w-4" strokeWidth={2} />
              Telepon / WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="px-5 py-14 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">
            Tentang Kami
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed">
            {kontenAI.aboutParagraph}
          </p>
        </div>
      </section>

      {/* Services — table-style list, structured */}
      {layanan.length > 0 && (
        <section className="px-5 py-14 md:py-20 bg-slate-50 border-y border-slate-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">
              Layanan Kami
            </h2>
            <h3 className="text-2xl md:text-3xl font-bold mb-8">Solusi untuk Kebutuhan Anda</h3>
            <div className="divide-y divide-slate-200 bg-white rounded-lg border border-slate-200">
              {layanan.map((s, i) => (
                <div key={s.id} className="p-6 flex gap-4">
                  <span
                    className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-md text-sm font-bold text-white"
                    style={{ backgroundColor: `var(--accent)` }}
                  >
                    0{i + 1}
                  </span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{s.title}</h4>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                      {s.description}
                    </p>
                    <a
                      href={buildWhatsappUrl(whatsapp, namaBisnis, s.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center text-xs font-semibold hover:underline"
                      style={{ color: `var(--accent)` }}
                    >
                      Konsultasi {s.title} →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="px-5 py-14 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Siap melayani Anda</h2>
          <p className="text-slate-600 mb-6 max-w-xl mx-auto">
            Hubungi kami untuk konsultasi atau informasi lebih lanjut.
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md px-7 py-3.5 text-base font-semibold text-white hover:opacity-90 transition"
            style={{ backgroundColor: `var(--accent)` }}
          >
            Hubungi Kami Sekarang
          </a>
          <p className="mt-6 text-xs text-slate-500">{lokasi}</p>
        </div>
      </section>

      <footer className="px-5 py-6 text-center text-xs text-slate-400 border-t border-slate-100">
        <p>
          &copy; {new Date().getFullYear()} {namaBisnis}. Dibuat otomatis oleh{' '}
          <a href="https://cus.site" className="hover:text-slate-600 underline">
            Cus.site
          </a>{' '}
          ⚡
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
        <p className="mt-2 text-slate-600">Website ini sedang dalam persiapan.</p>
      </div>
    </div>
  );
}
