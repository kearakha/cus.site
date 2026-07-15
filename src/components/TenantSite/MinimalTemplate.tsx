import type { TemplateProps } from "./types";
import { buildWhatsappUrl } from "./types";
import { OperatingHours } from "./OperatingHours";
import { MapEmbed } from "./MapEmbed";
import { JsonLd } from "./JsonLd";
import {
  getSocialLinks,
  InstagramIcon,
  FacebookIcon,
  TiktokIcon,
  YoutubeIcon,
} from "./social";

/**
 * MinimalTemplate — untuk Studio Desain, Freelancer, Personal Brand, Konsultan Kreatif.
 * Vibe: bersih, banyak white space, tipografi ringan.
 * Font: sans-serif clean. Accent: muted/earth tones.
 * Copy: pakai "Anda", understated tapi warm.
 * Layout: generous padding, single column, breathable.
 */
export function MinimalTemplate({ data, siteUrl }: TemplateProps) {
  const { namaBisnis, lokasi, whatsapp, kontenAI, layanan, logoUrl, coverUrl } =
    data;
  const accent = data.kontenAI?.accentColor || "059669";

  if (!kontenAI) {
    return <NoContentPlaceholder nama={namaBisnis} logoUrl={logoUrl} />;
  }

  const waUrl = buildWhatsappUrl(whatsapp, namaBisnis);
  const socialLinks = getSocialLinks(data);

  return (
    <div
      className="min-h-screen bg-white text-slate-800 font-professional"
      style={{ ["--accent" as never]: `#${accent}` }}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-slate-900 focus:rounded-lg focus:shadow-lg border border-slate-200"
      >
        Langsung ke konten
      </a>

      {/* Hero — extreme minimal, left-aligned, lots of space */}
      <section id="main-content" className="px-6 md:px-12 py-20 md:py-32 max-w-3xl">
        {logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt={`Logo ${namaBisnis}`}
            className="h-10 w-10 mb-10 rounded-lg object-cover"
          />
        )}
        <p className="text-xs text-slate-400 tracking-widest uppercase mb-4">
          {lokasi}
        </p>
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight text-slate-900">
          {kontenAI.heroHeadline}
        </h1>
        <p className="mt-6 text-base md:text-lg text-slate-500 max-w-lg leading-relaxed">
          {kontenAI.heroSubtext}
        </p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center text-sm font-medium border-b-2 pb-0.5 transition-colors hover:opacity-70"
          style={{ borderColor: `var(--accent)`, color: `var(--accent)` }}
        >
          {kontenAI.ctaText} →
        </a>
      </section>

      {/* Cover — contained, subtle */}
      {coverUrl && (
        <section className="px-6 md:px-12 pb-16">
          <div className="max-w-4xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverUrl}
              alt={`Suasana ${namaBisnis}`}
              className="w-full h-64 md:h-[28rem] object-cover rounded-lg"
            />
          </div>
        </section>
      )}

      {/* About — simple paragraph */}
      <section className="px-6 md:px-12 py-16 md:py-24 border-t border-slate-100">
        <div className="max-w-2xl">
          <p className="text-xs text-slate-400 tracking-widest uppercase mb-4">
            Tentang
          </p>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed">
            {kontenAI.aboutParagraph}
          </p>
        </div>
      </section>

      {/* Services — clean vertical list */}
      {layanan.length > 0 && (
        <section className="px-6 md:px-12 py-16 md:py-24 border-t border-slate-100">
          <div className="max-w-3xl">
            <p className="text-xs text-slate-400 tracking-widest uppercase mb-4">
              Layanan
            </p>
            <div className="space-y-0 divide-y divide-slate-100">
              {layanan.map((s) => (
                <div key={s.id} className="py-8 flex gap-6">
                  {s.imageUrl && (
                    <div className="flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden bg-slate-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.imageUrl}
                        alt={s.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900">{s.title}</h3>
                    <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                      {s.description}
                    </p>
                    <div className="mt-3 flex items-center gap-4">
                      {s.harga && (
                        <span
                          className="text-sm font-medium"
                          style={{ color: `var(--accent)` }}
                        >
                          {s.harga}
                        </span>
                      )}
                      <a
                        href={buildWhatsappUrl(whatsapp, namaBisnis, s.title)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-400 hover:text-slate-600 transition"
                      >
                        Tanya →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimoni */}
      {Array.isArray(kontenAI.testimoni) && kontenAI.testimoni.length > 0 && (
        <section className="px-6 md:px-12 py-16 md:py-24 border-t border-slate-100 bg-slate-50">
          <div className="max-w-3xl">
            <p className="text-xs text-slate-400 tracking-widest uppercase mb-8">
              Testimoni
            </p>
            <div className="space-y-8">
              {(kontenAI.testimoni as { nama: string; teks: string }[]).map(
                (t, i) => (
                  <blockquote key={i}>
                    <p className="text-base text-slate-600 leading-relaxed italic">
                      &ldquo;{t.teks}&rdquo;
                    </p>
                    <cite
                      className="mt-2 block text-xs font-medium not-italic"
                      style={{ color: `var(--accent)` }}
                    >
                      — {t.nama}
                    </cite>
                  </blockquote>
                ),
              )}
            </div>
          </div>
        </section>
      )}

      {/* Contact — simple, left-aligned */}
      <section className="px-6 md:px-12 py-16 md:py-24 border-t border-slate-100">
        <div className="max-w-2xl">
          <p className="text-xs text-slate-400 tracking-widest uppercase mb-4">
            Kontak
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4">
            Mari Berdiskusi
          </h2>
          <p className="text-slate-500 mb-2">{lokasi}</p>
          <OperatingHours
            hariOperasional={data.hariOperasional}
            jamBuka={data.jamBuka}
            jamTutup={data.jamTutup}
            className="text-slate-500 mb-6"
          />
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-medium border-b-2 pb-0.5 transition-colors hover:opacity-70"
            style={{ borderColor: `var(--accent)`, color: `var(--accent)` }}
          >
            Hubungi via WhatsApp →
          </a>

          {socialLinks.length > 0 && (
            <div className="mt-8 flex items-center gap-3">
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
                    className="text-slate-300 hover:text-slate-500 transition"
                    aria-label={kind}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Map */}
      {(data.latitude != null || data.lokasi) && (
        <section className="px-6 md:px-12 py-16 md:py-24 border-t border-slate-100">
          <div className="max-w-3xl">
            <p className="text-xs text-slate-400 tracking-widest uppercase mb-4">
              Lokasi
            </p>
            <MapEmbed
              latitude={data.latitude}
              longitude={data.longitude}
              lokasi={data.lokasi}
              className="h-72 rounded-lg overflow-hidden"
            />
          </div>
        </section>
      )}

      <footer className="px-6 md:px-12 py-8 pb-24 text-xs text-slate-300 border-t border-slate-100">
        <p>
          &copy; {new Date().getFullYear()} {namaBisnis} &mdash; Dibuat otomatis
          oleh{" "}
          <a href="https://cus.site" className="hover:text-slate-500 underline">
            Cus.site
          </a>
        </p>
      </footer>

      {/* Sticky floating WA button */}
      {waUrl && (
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat WhatsApp"
          className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-md transition hover:scale-110 print:hidden"
          style={{ backgroundColor: `#${accent}` }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="white"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.535 5.848L0 24l6.335-1.506A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.368l-.36-.213-3.76.894.938-3.651-.234-.374A9.818 9.818 0 1 1 12 21.818z" />
          </svg>
        </a>
      )}
      <JsonLd data={data} />
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
            className="mx-auto h-10 w-10 mb-4 rounded-lg object-cover"
          />
        )}
        <h1 className="text-2xl font-semibold text-slate-900">{nama}</h1>
        <p className="mt-2 text-slate-500">Sedang disiapkan...</p>
      </div>
    </div>
  );
}
