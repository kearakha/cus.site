import type { TemplateProps } from './types';
import { buildWhatsappUrl } from './types';
import { Sparkles } from 'lucide-react';

/**
 * ElegantTemplate — untuk Spa premium, Butik, Fine dining, Galeri seni.
 * Vibe: mewah, eksklusif, sophisticated.
 * Font: serif (Cormorant Garamond). Accent: gold/earth.
 * Copy: pakai "Anda", puitis tapi understated.
 * Layout: generous whitespace, slow scroll, gallery feel.
 */
export function ElegantTemplate({ data, siteUrl }: TemplateProps) {
  const { namaBisnis, lokasi, whatsapp, kontenAI, layanan } = data;
  const accent = data.kontenAI?.accentColor || '92400e';

  if (!kontenAI) {
    return <NoContentPlaceholder nama={namaBisnis} />;
  }

  const waUrl = buildWhatsappUrl(whatsapp, namaBisnis);

  return (
    <div
      className="min-h-screen bg-stone-50 text-stone-900 font-elegant"
      style={{ ['--accent' as never]: `#${accent}` }}
    >
      {/* Hero — minimal, asymmetric, generous spacing */}
      <section className="px-6 py-24 md:py-40">
        <div className="max-w-4xl mx-auto">
          <p className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.3em] uppercase text-stone-500 mb-8">
            <Sparkles className="h-3 w-3" strokeWidth={1.5} />
            {lokasi}
          </p>
          <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] tracking-tight font-light">
            {kontenAI.heroHeadline}
          </h1>
          <div className="mt-2 h-px w-16 bg-stone-900" />
          <p className="mt-8 text-lg md:text-xl text-stone-600 max-w-2xl font-light italic leading-relaxed">
            {kontenAI.heroSubtext}
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-12 inline-block text-sm tracking-widest uppercase border-b border-stone-900 pb-1 hover:opacity-60 transition-opacity"
          >
            {kontenAI.ctaText}
          </a>
        </div>
      </section>

      {/* About */}
      <section className="px-6 py-20 md:py-32 bg-white border-y border-stone-100">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-stone-500 mb-6 text-center">
            Filosofi
          </p>
          <p className="text-lg md:text-xl leading-relaxed text-stone-700 text-center font-light italic">
            {kontenAI.aboutParagraph}
          </p>
        </div>
      </section>

      {/* Services — gallery-style cards */}
      {layanan.length > 0 && (
        <section className="px-6 py-20 md:py-32">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-stone-500 mb-3 text-center">
              Koleksi
            </p>
            <h2 className="text-3xl md:text-5xl font-serif font-light text-center mb-16">
              Yang Kami Hadirkan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-stone-200">
              {layanan.map((s) => (
                <article
                  key={s.id}
                  className="bg-stone-50 p-10 md:p-12 hover:bg-white transition-colors duration-500"
                >
                  <h3 className="font-serif text-2xl md:text-3xl mb-4 font-light">
                    {s.title}
                  </h3>
                  <div className="h-px w-8 bg-stone-900 mb-6" />
                  <p className="text-stone-600 leading-relaxed font-light">
                    {s.description}
                  </p>
                  <a
                    href={buildWhatsappUrl(whatsapp, namaBisnis, s.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-block text-xs tracking-widest uppercase border-b border-stone-900 pb-0.5 hover:opacity-60 transition-opacity"
                  >
                    Reservasi
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact — minimal */}
      <section className="px-6 py-20 md:py-32 bg-stone-900 text-stone-100">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-stone-400 mb-6">
            Kontak
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-light leading-tight mb-8">
            Saatnya untuk pengalaman yang berbeda
          </h2>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm tracking-widest uppercase border-b border-stone-100 pb-1 hover:opacity-60 transition-opacity"
          >
            Hubungi Kami
          </a>
          <p className="mt-12 text-sm text-stone-400 font-light">{lokasi}</p>
        </div>
      </section>

      <footer className="px-6 py-8 text-center text-xs text-stone-400 tracking-wide">
        <p>
          {namaBisnis} — Dibuat otomatis oleh{' '}
          <a href="https://cus.site" className="hover:text-stone-600 underline">
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
        <h1 className="font-serif text-3xl font-light">{nama}</h1>
        <p className="mt-2 text-slate-600 font-light italic">Sedang dalam persiapan...</p>
      </div>
    </div>
  );
}
