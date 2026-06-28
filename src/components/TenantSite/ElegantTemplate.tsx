import type { TemplateProps } from "./types";
import { buildWhatsappUrl } from "./types";
import { Sparkles } from "lucide-react";
import { OperatingHours } from "./OperatingHours";
import { MapEmbed } from "./MapEmbed";
import {
  getSocialLinks,
  InstagramIcon,
  FacebookIcon,
  TiktokIcon,
} from "./social";

/**
 * ElegantTemplate — untuk Spa premium, Butik, Fine dining, Galeri seni.
 * Vibe: mewah, eksklusif, sophisticated.
 * Font: serif (Cormorant Garamond). Accent: gold/earth.
 * Copy: pakai "Anda", puitis tapi understated.
 * Layout: generous whitespace, slow scroll, gallery feel.
 */
export function ElegantTemplate({ data, siteUrl }: TemplateProps) {
  const { namaBisnis, lokasi, whatsapp, kontenAI, layanan, logoUrl, coverUrl } =
    data;
  const accent = data.kontenAI?.accentColor || "92400e";

  if (!kontenAI) {
    return <NoContentPlaceholder nama={namaBisnis} logoUrl={logoUrl} />;
  }

  const waUrl = buildWhatsappUrl(whatsapp, namaBisnis);
  const socialLinks = getSocialLinks(data);

  return (
    <div
      className="min-h-screen bg-stone-50 text-stone-900 font-elegant"
      style={{ ["--accent" as never]: `#${accent}` }}
    >
      {/* Hero — minimal, asymmetric, generous spacing */}
      <section className="px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={`Logo ${namaBisnis}`}
              className="mx-auto h-16 w-16 mb-8 rounded-full object-cover ring-2 ring-stone-200"
            />
          )}
          <p className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.3em] uppercase text-stone-500 mb-8">
            <Sparkles className="h-3 w-3" strokeWidth={1.5} />
            {lokasi}
          </p>
          <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] tracking-tight font-light">
            {kontenAI.heroHeadline}
          </h1>
          <div className="mt-2 mx-auto h-px w-16 bg-stone-900" />
          <p className="mt-8 text-lg md:text-xl text-stone-600 max-w-2xl mx-auto font-light italic leading-relaxed">
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

      {/* Cover — full-bleed, gallery style */}
      {coverUrl && (
        <section className="px-6 pb-20">
          <div className="max-w-5xl mx-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverUrl}
              alt={`Suasana ${namaBisnis}`}
              className="w-full h-[28rem] md:h-[36rem] object-cover"
            />
          </div>
        </section>
      )}

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
                  className="bg-stone-50 hover:bg-white transition-colors duration-500"
                >
                  {s.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.imageUrl}
                      alt={s.title}
                      className="w-full aspect-[4/3] object-cover"
                    />
                  )}
                  <div className="p-10 md:p-12">
                    <h3 className="font-serif text-2xl md:text-3xl mb-4 font-light">
                      {s.title}
                    </h3>
                    <div className="h-px w-8 bg-stone-900 mb-6" />
                    <p className="text-stone-600 leading-relaxed font-light">
                      {s.description}
                    </p>
                    {s.harga && (
                      <p
                        className="mt-3 text-sm font-medium tracking-wide"
                        style={{ color: `var(--accent)` }}
                      >
                        {s.harga}
                      </p>
                    )}
                    <a
                      href={buildWhatsappUrl(whatsapp, namaBisnis, s.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-block text-xs tracking-widest uppercase border-b border-stone-900 pb-0.5 hover:opacity-60 transition-opacity"
                    >
                      Reservasi
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimoni */}
      {Array.isArray(kontenAI.testimoni) && kontenAI.testimoni.length > 0 && (
        <section className="px-6 py-20 md:py-28 bg-stone-100">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-stone-500 mb-4 text-center">
              Testimoni
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-center mb-14">
              Suara Pelanggan Kami
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone-300">
              {(kontenAI.testimoni as { nama: string; teks: string }[]).map(
                (t, i) => (
                  <div key={i} className="bg-stone-100 p-8 md:p-10">
                    <p className="text-stone-700 leading-relaxed font-light text-sm">
                      &ldquo;{t.teks}&rdquo;
                    </p>
                    <p
                      className="mt-4 text-xs tracking-widest uppercase font-medium"
                      style={{ color: `var(--accent)` }}
                    >
                      — {t.nama}
                    </p>
                  </div>
                ),
              )}
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

          <OperatingHours
            hariOperasional={data.hariOperasional}
            jamBuka={data.jamBuka}
            jamTutup={data.jamTutup}
            className="justify-center text-stone-300 mb-8"
            iconClassName="h-4 w-4 mt-0.5"
          />

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm tracking-widest uppercase border-b border-stone-100 pb-1 hover:opacity-60 transition-opacity"
          >
            Hubungi Kami
          </a>

          {socialLinks.length > 0 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              {socialLinks.map(({ kind, url }) => {
                const Icon =
                  kind === "instagram"
                    ? InstagramIcon
                    : kind === "facebook"
                      ? FacebookIcon
                      : TiktokIcon;
                return (
                  <a
                    key={kind}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-400 hover:text-stone-100 transition"
                    aria-label={kind}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          )}

          <p className="mt-12 text-sm text-stone-400 font-light">{lokasi}</p>
        </div>
      </section>

      {/* Map */}
      {(data.latitude != null || data.lokasi) && (
        <section className="px-6 py-20 md:py-32 bg-white">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-stone-500 mb-3 text-center">
              Lokasi
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-center mb-10">
              Temukan Kami
            </h2>
            <MapEmbed
              latitude={data.latitude}
              longitude={data.longitude}
              lokasi={data.lokasi}
              className="h-96"
            />
          </div>
        </section>
      )}

      <footer className="px-6 py-8 text-center text-xs text-stone-400 tracking-wide">
        <p>
          {namaBisnis} — Dibuat otomatis oleh{" "}
          <a href="https://cus.site" className="hover:text-stone-600 underline">
            Cus.site
          </a>{" "}
          ⚡
        </p>
      </footer>
    </div>
  );
}

function NoContentPlaceholder({
  nama,
  logoUrl,
}: {
  nama: string;
  logoUrl?: string | null;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        {logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt={nama}
            className="mx-auto h-14 w-14 mb-4 rounded-full object-cover"
          />
        )}
        <h1 className="font-serif text-3xl font-light">{nama}</h1>
        <p className="mt-2 text-slate-600 font-light italic">
          Sedang dalam persiapan...
        </p>
      </div>
    </div>
  );
}
