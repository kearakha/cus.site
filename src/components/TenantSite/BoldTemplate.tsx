import type { TemplateProps } from "./types";
import { buildWhatsappUrl } from "./types";
import { Zap } from "lucide-react";
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
 * BoldTemplate — untuk Gym, Creative Agency, Streetfood, Barbershop Modern.
 * Vibe: berani, vibrant, high-energy.
 * Font: sans-serif tebal. Accent: saturasi tinggi.
 * Copy: pakai "kamu", energetic.
 * Layout: full-width hero, big typography, vivid gradient.
 */
export function BoldTemplate({ data, siteUrl }: TemplateProps) {
  const { namaBisnis, lokasi, whatsapp, kontenAI, layanan, logoUrl, coverUrl } =
    data;
  const accent = data.kontenAI?.accentColor || "e11d48";

  if (!kontenAI) {
    return <NoContentPlaceholder nama={namaBisnis} logoUrl={logoUrl} />;
  }

  const waUrl = buildWhatsappUrl(whatsapp, namaBisnis);
  const socialLinks = getSocialLinks(data);

  return (
    <div
      className="min-h-screen bg-slate-950 text-white font-casual"
      style={{ ["--accent" as never]: `#${accent}` }}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-slate-900 focus:rounded-lg focus:shadow-lg border border-slate-200"
      >
        Langsung ke konten
      </a>

      {/* Hero — full-screen, vivid gradient + big text */}
      <section id="main-content" className="relative min-h-[70vh] md:min-h-[80vh] flex items-end overflow-hidden">
        {coverUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverUrl}
              alt={`Cover ${namaBisnis}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, #${accent}cc 0%, rgba(15,23,42,0.9) 60%)`,
              }}
            />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, #${accent} 0%, #0f172a 70%)`,
            }}
          />
        )}

        <div className="relative z-10 w-full px-5 pb-12 md:pb-20 pt-20">
          <div className="max-w-4xl mx-auto">
            {logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt={`Logo ${namaBisnis}`}
                className="h-14 w-14 md:h-16 md:w-16 mb-6 rounded-xl object-cover ring-2 ring-white/30"
              />
            )}
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6"
              style={{ backgroundColor: `rgba(255,255,255,0.15)`, color: "white" }}
            >
              <Zap className="h-3.5 w-3.5" strokeWidth={2.5} />
              {lokasi}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]">
              {kontenAI.heroHeadline}
            </h1>
            <p className="mt-5 text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
              {kontenAI.heroSubtext}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-base font-bold text-white hover:scale-105 transition-transform shadow-xl"
                style={{
                  backgroundColor: `#${accent}`,
                  boxShadow: `0 12px 30px -8px #${accent}`,
                }}
              >
                {kontenAI.ctaText} →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About — dark bg, accent underline */}
      <section className="px-5 py-14 md:py-20 bg-slate-900">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="h-1 w-8 rounded-full"
              style={{ backgroundColor: `var(--accent)` }}
            />
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
              Cerita Kita
            </h2>
          </div>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed">
            {kontenAI.aboutParagraph}
          </p>
        </div>
      </section>

      {/* Services — card grid with accent hover */}
      {layanan.length > 0 && (
        <section className="px-5 py-14 md:py-20 bg-slate-950">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="h-1 w-8 rounded-full"
                style={{ backgroundColor: `var(--accent)` }}
              />
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
                Yang Kita Tawarkan
              </h2>
            </div>
            <h3 className="text-3xl md:text-4xl font-black mb-10">
              Pilih Favoritmu
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {layanan.map((s, i) => {
                const wa = buildWhatsappUrl(whatsapp, namaBisnis, s.title);
                return (
                  <a
                    key={s.id}
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative rounded-2xl border border-white/10 bg-slate-900 p-6 hover:border-white/30 transition-all duration-300 overflow-hidden"
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                      style={{ backgroundColor: `var(--accent)` }}
                    />
                    <div className="relative z-10 flex gap-4">
                      {s.imageUrl ? (
                        <div className="flex-shrink-0 h-16 w-16 rounded-xl overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={s.imageUrl}
                            alt={s.title}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <span
                          className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl text-lg font-black text-white"
                          style={{ backgroundColor: `var(--accent)` }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white group-hover:text-white/90 truncate">
                          {s.title}
                        </h4>
                        <p className="mt-1.5 text-sm text-white/50 line-clamp-2">
                          {s.description}
                        </p>
                        {s.harga && (
                          <p
                            className="mt-2 text-sm font-bold"
                            style={{ color: `var(--accent)` }}
                          >
                            {s.harga}
                          </p>
                        )}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Testimoni */}
      {Array.isArray(kontenAI.testimoni) && kontenAI.testimoni.length > 0 && (
        <section className="px-5 py-14 md:py-20 bg-slate-900">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="h-1 w-8 rounded-full"
                style={{ backgroundColor: `var(--accent)` }}
              />
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
                Real Talk
              </h2>
            </div>
            <h3 className="text-3xl md:text-4xl font-black mb-10">
              Kata Mereka
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(kontenAI.testimoni as { nama: string; teks: string }[]).map(
                (t, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-white/10 bg-slate-950 p-6"
                  >
                    <p className="text-sm text-white/70 leading-relaxed">
                      &ldquo;{t.teks}&rdquo;
                    </p>
                    <p
                      className="mt-3 text-xs font-bold uppercase tracking-wider"
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

      {/* Contact / CTA */}
      <section className="px-5 py-14 md:py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at center, #${accent}, transparent 70%)`,
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Gas, Langsung Aja! 🔥
          </h2>
          <p className="text-white/50 mb-2">{lokasi}</p>
          <OperatingHours
            hariOperasional={data.hariOperasional}
            jamBuka={data.jamBuka}
            jamTutup={data.jamTutup}
            className="justify-center text-white/50 mb-6"
            iconClassName="h-4 w-4 mt-0.5"
          />
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full px-8 py-4 text-lg font-bold text-white hover:scale-105 transition-transform shadow-xl"
            style={{
              backgroundColor: `#${accent}`,
              boxShadow: `0 12px 30px -8px #${accent}`,
            }}
          >
            Chat Sekarang →
          </a>

          {socialLinks.length > 0 && (
            <div className="mt-8 flex items-center justify-center gap-3">
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
                    className="rounded-full bg-white/10 p-2.5 hover:bg-white/20 transition"
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
        <section className="px-5 py-14 md:py-20 bg-slate-900">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="h-1 w-8 rounded-full"
                style={{ backgroundColor: `var(--accent)` }}
              />
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
                Lokasi
              </h2>
            </div>
            <h3 className="text-2xl md:text-3xl font-black mb-6">
              Temuin Kita di Sini
            </h3>
            <MapEmbed
              latitude={data.latitude}
              longitude={data.longitude}
              lokasi={data.lokasi}
              className="h-80 rounded-xl overflow-hidden"
            />
          </div>
        </section>
      )}

      <footer className="px-5 py-6 pb-24 text-center text-xs text-white/30">
        <p className="inline-flex items-center justify-center gap-1">
          &copy; {new Date().getFullYear()} {namaBisnis} &mdash; Dibuat otomatis
          oleh{" "}
          <a href="https://cus.site" className="hover:text-white/60 underline">
            Cus.site
          </a>
          <Zap className="h-3 w-3" strokeWidth={2.5} />
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        {logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt={nama}
            className="mx-auto h-16 w-16 mb-4 rounded-xl object-cover"
          />
        )}
        <h1 className="text-2xl font-black text-white">{nama}</h1>
        <p className="mt-2 text-white/50">Website ini sedang dipersiapkan...</p>
      </div>
    </div>
  );
}
