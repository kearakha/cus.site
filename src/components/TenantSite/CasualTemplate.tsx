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

      <footer className="px-5 py-6 text-center text-xs text-slate-400">
        <p className="inline-flex items-center justify-center gap-1">
          Dibuat otomatis oleh{" "}
          <a href="https://cus.site" className="hover:text-slate-600 underline">
            Cus.site
          </a>
          <Zap className="h-3 w-3" strokeWidth={2.5} />
        </p>
      </footer>
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
