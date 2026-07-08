import type { TemplateProps } from "./types";
import { buildWhatsappUrl } from "./types";
import { Coffee, Sparkles, Zap } from "lucide-react";
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
 * CasualTemplate — untuk Kafe, Laundry, Barbershop casual, Jajanan.
 * Vibe: santai, kekinian, hangat.
 * Font: sans-serif modern. Accent: warm color.
 * Copy: pakai "kamu".
 */
export function CasualTemplate({ data, siteUrl }: TemplateProps) {
  const { namaBisnis, lokasi, whatsapp, kontenAI, layanan, logoUrl, coverUrl } =
    data;
  const accent = data.kontenAI?.accentColor || "f59e0b";

  if (!kontenAI) {
    return <NoContentPlaceholder nama={namaBisnis} logoUrl={logoUrl} />;
  }

  const waUrl = buildWhatsappUrl(whatsapp, namaBisnis);
  const socialLinks = getSocialLinks(data);

  return (
    <div
      className="min-h-screen bg-white text-slate-900 font-casual"
      style={{ ["--accent" as never]: `#${accent}` }}
    >
      {/* Hero */}
      <section className="relative overflow-hidden">
        {coverUrl ? (
          // === Cover sebagai background hero ===
          <div className="relative h-72 sm:h-96 md:h-[28rem]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverUrl}
              alt={`Cover ${namaBisnis}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 px-5 pb-8">
              <HeroContent
                namaBisnis={namaBisnis}
                logoUrl={logoUrl}
                lokasi={lokasi}
                kontenAI={kontenAI}
                accent={accent}
                waUrl={waUrl}
              />
            </div>
          </div>
        ) : (
          // === Hero tanpa cover, layout default ===
          <div className="relative px-5 py-16 md:py-24">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background: `radial-gradient(circle at top right, #${accent}, transparent 60%)`,
              }}
            />
            <div className="relative max-w-2xl mx-auto text-center">
              <HeroContent
                namaBisnis={namaBisnis}
                logoUrl={logoUrl}
                lokasi={lokasi}
                kontenAI={kontenAI}
                accent={accent}
                waUrl={waUrl}
              />
            </div>
          </div>
        )}
      </section>

      {/* About */}
      <section className="px-5 py-12 md:py-16 bg-slate-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Tentang Kita</h2>
          <p className="text-slate-700 leading-relaxed">
            {kontenAI.aboutParagraph}
          </p>
        </div>
      </section>

      {/* Services */}
      {layanan.length > 0 && (
        <section className="px-5 py-12 md:py-16">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Yang Bisa Kamu Nikmati
            </h2>
            <div className="space-y-3">
              {layanan.map((s, i) => {
                const wa = buildWhatsappUrl(whatsapp, namaBisnis, s.title);
                return (
                  <a
                    key={s.id}
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 hover:border-slate-900 hover:shadow-md transition"
                  >
                    {s.imageUrl && (
                      <div className="flex-shrink-0 h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-xl bg-slate-100">
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
                      <div className="flex items-center gap-2">
                        <span
                          className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white flex-shrink-0"
                          style={{ backgroundColor: `var(--accent)` }}
                        >
                          {i + 1}
                        </span>
                        <h3 className="font-semibold text-slate-900 truncate">
                          {s.title}
                        </h3>
                      </div>
                      <p className="mt-1.5 text-sm text-slate-600 line-clamp-3">
                        {s.description}
                      </p>
                      {s.harga && (
                        <p
                          className="mt-2 text-sm font-semibold"
                          style={{ color: `var(--accent)` }}
                        >
                          {s.harga}
                        </p>
                      )}
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-900 transition text-lg self-center">
                      →
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Testimoni */}
      {Array.isArray(kontenAI.testimoni) && kontenAI.testimoni.length > 0 && (
        <section className="px-5 py-12 md:py-16 bg-slate-50">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Kata Mereka 💬
            </h2>
            <div className="space-y-3">
              {(kontenAI.testimoni as { nama: string; teks: string }[]).map(
                (t, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <p className="text-sm text-slate-700 leading-relaxed">
                      &ldquo;{t.teks}&rdquo;
                    </p>
                    <p
                      className="mt-2 text-xs font-semibold"
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
      <section className="px-5 py-12 md:py-16 bg-slate-900 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 inline-flex items-center gap-2">
            Yuk mampir!
            <Sparkles className="h-6 w-6" strokeWidth={2} />
          </h2>
          <p className="text-slate-300 mb-2">{lokasi}</p>
          <OperatingHours
            hariOperasional={data.hariOperasional}
            jamBuka={data.jamBuka}
            jamTutup={data.jamTutup}
            className="justify-center text-slate-300 mb-6"
            iconClassName="h-4 w-4 mt-0.5"
          />
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-base font-semibold hover:scale-105 transition-transform"
            style={{ backgroundColor: `var(--accent)`, color: "white" }}
          >
            Chat WhatsApp Kita →
          </a>

          {socialLinks.length > 0 && (
            <div className="mt-6 flex items-center justify-center gap-3">
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
                    className="rounded-full bg-slate-800 p-2.5 hover:bg-slate-700 transition"
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
        <section className="px-5 py-12 md:py-16 bg-slate-50">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Lokasi Kita</h2>
            <MapEmbed
              latitude={data.latitude}
              longitude={data.longitude}
              lokasi={data.lokasi}
              className="h-72"
            />
          </div>
        </section>
      )}

      <footer className="px-5 py-6 pb-24 text-center text-xs text-slate-400">
        <p className="inline-flex items-center justify-center gap-1">
          &copy; {new Date().getFullYear()} {namaBisnis} &mdash; Dibuat otomatis
          oleh{" "}
          <a href="https://cus.site" className="hover:text-slate-600 underline">
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
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition hover:scale-110"
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

// === Sub-component: HeroContent ===
// Di-share antara mode dengan cover (overlay bottom) dan tanpa cover (centered).
// Dipakai untuk mengurangi duplikasi.
function HeroContent({
  namaBisnis,
  logoUrl,
  lokasi,
  kontenAI,
  accent,
  waUrl,
}: {
  namaBisnis: string;
  logoUrl: string | null | undefined;
  lokasi: string;
  kontenAI: { heroHeadline: string; heroSubtext: string; ctaText: string };
  accent: string;
  waUrl: string;
}) {
  return (
    <>
      {logoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt={`Logo ${namaBisnis}`}
          className="mx-auto h-16 w-16 sm:h-20 sm:w-20 mb-4 rounded-2xl object-cover bg-white shadow-lg ring-4 ring-white"
        />
      )}
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4"
        style={{ backgroundColor: `#${accent}`, color: "white" }}
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
          backgroundColor: `#${accent}`,
          boxShadow: `0 10px 25px -5px #${accent}`,
        }}
      >
        {kontenAI.ctaText} →
      </a>
    </>
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
            className="mx-auto h-16 w-16 mb-4 rounded-xl object-cover"
          />
        )}
        <h1 className="text-2xl font-bold">{nama}</h1>
        <p className="mt-2 text-slate-600">Website ini sedang disiapkan...</p>
      </div>
    </div>
  );
}
