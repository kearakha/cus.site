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
  YoutubeIcon,
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
                      loading="lazy"
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
                      : kind === "youtube"
                        ? YoutubeIcon
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

      <footer className="px-6 py-8 pb-24 text-center text-xs text-stone-400 tracking-wide">
        <p>
          &copy; {new Date().getFullYear()} {namaBisnis} &mdash; Dibuat otomatis
          oleh{" "}
          <a href="https://cus.site" className="hover:text-stone-600 underline">
            Cus.site
          </a>{" "}
          ⚡
        </p>
      </footer>

      {/* Sticky floating WA button */}
      {waUrl && (
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat WhatsApp"
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition hover:scale-110 print:hidden"
          style={{ backgroundColor: `#${accent}` }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="white"
            className="h-7 w-7"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.535 5.848L0 24l6.335-1.506A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.368l-.36-.213-3.76.894.938-3.651-.234-.374A9.818 9.818 0 1 1 12 21.818z" />
          </svg>
        </a>
      )}
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
