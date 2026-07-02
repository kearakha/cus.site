import type { TemplateProps } from "./types";
import { buildWhatsappUrl } from "./types";
import { Phone } from "lucide-react";
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
 * ProfessionalTemplate — untuk Bimbel, Klinik, Jasa Hukum, Konsultan.
 * Vibe: sopan, terpercaya, terstruktur.
 * Font: sans-serif clean. Accent: blue/slate.
 * Copy: pakai "Anda".
 */
export function ProfessionalTemplate({ data, siteUrl }: TemplateProps) {
  const { namaBisnis, lokasi, whatsapp, kontenAI, layanan, logoUrl, coverUrl } =
    data;
  const accent = data.kontenAI?.accentColor || "1e40af";

  if (!kontenAI) {
    return <NoContentPlaceholder nama={namaBisnis} logoUrl={logoUrl} />;
  }

  const waUrl = buildWhatsappUrl(whatsapp, namaBisnis);
  const socialLinks = getSocialLinks(data);

  return (
    <div
      className="min-h-screen bg-white text-slate-900 font-professional"
      style={{ ["--accent" as never]: `#${accent}` }}
    >
      {/* Hero — flat, clean, trust badges */}
      <section className="px-5 py-16 md:py-24 border-b border-slate-100">
        <div className="max-w-3xl mx-auto">
          {logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={`Logo ${namaBisnis}`}
              className="h-14 w-14 mb-6 rounded-lg object-cover ring-2 ring-slate-100"
            />
          )}
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
              href={`https://wa.me/${whatsapp.replace(/^0/, "62")}`}
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

      {coverUrl && (
        <section className="border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-5 py-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverUrl}
              alt={`Suasana ${namaBisnis}`}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>
        </section>
      )}

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
            <h3 className="text-2xl md:text-3xl font-bold mb-8">
              Solusi untuk Kebutuhan Anda
            </h3>
            <div className="divide-y divide-slate-200 bg-white rounded-lg border border-slate-200">
              {layanan.map((s, i) => (
                <div key={s.id} className="p-6 flex gap-4">
                  {s.imageUrl ? (
                    <div className="flex-shrink-0 h-20 w-20 rounded-md overflow-hidden bg-slate-100">
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
                      className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-md text-sm font-bold text-white self-start mt-1"
                      style={{ backgroundColor: `var(--accent)` }}
                    >
                      0{i + 1}
                    </span>
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{s.title}</h4>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                      {s.description}
                    </p>
                    {s.harga && (
                      <p
                        className="mt-1.5 text-sm font-semibold"
                        style={{ color: `var(--accent)` }}
                      >
                        {s.harga}
                      </p>
                    )}
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

      {/* Testimoni */}
      {Array.isArray(kontenAI.testimoni) && kontenAI.testimoni.length > 0 && (
        <section className="px-5 py-14 md:py-20 bg-slate-50 border-y border-slate-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">
              Testimoni
            </h2>
            <h3 className="text-2xl md:text-3xl font-bold mb-8">
              Yang Pelanggan Kami Rasakan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(kontenAI.testimoni as { nama: string; teks: string }[]).map(
                (t, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg border border-slate-200 p-5"
                  >
                    <p className="text-sm text-slate-700 leading-relaxed">
                      &ldquo;{t.teks}&rdquo;
                    </p>
                    <p
                      className="mt-3 text-xs font-semibold"
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

      {/* Contact */}
      <section className="px-5 py-14 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Siap melayani Anda
          </h2>
          <p className="text-slate-600 mb-6 max-w-xl mx-auto">
            Hubungi kami untuk konsultasi atau informasi lebih lanjut.
          </p>

          <OperatingHours
            hariOperasional={data.hariOperasional}
            jamBuka={data.jamBuka}
            jamTutup={data.jamTutup}
            className="justify-center text-slate-600 mb-6"
          />

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md px-7 py-3.5 text-base font-semibold text-white hover:opacity-90 transition"
            style={{ backgroundColor: `var(--accent)` }}
          >
            Hubungi Kami Sekarang
          </a>

          {socialLinks.length > 0 && (
            <div className="mt-6 flex items-center justify-center gap-2">
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
                    className="rounded-md border border-slate-300 p-2 text-slate-600 hover:border-slate-400 hover:bg-slate-50 transition"
                    aria-label={kind}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          )}

          <p className="mt-6 text-xs text-slate-500">{lokasi}</p>
        </div>
      </section>

      {/* Map */}
      {(data.latitude != null || data.lokasi) && (
        <section className="px-5 py-14 md:py-20 bg-slate-50 border-t border-slate-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">
              Lokasi
            </h2>
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              Temukan Kami
            </h3>
            <MapEmbed
              latitude={data.latitude}
              longitude={data.longitude}
              lokasi={data.lokasi}
              className="h-80"
            />
          </div>
        </section>
      )}

      <footer className="px-5 py-6 text-center text-xs text-slate-400 border-t border-slate-100">
        <p>
          &copy; {new Date().getFullYear()} {namaBisnis}. Dibuat otomatis oleh{" "}
          <a href="https://cus.site" className="hover:text-slate-600 underline">
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
            className="mx-auto h-14 w-14 mb-4 rounded-lg object-cover"
          />
        )}
        <h1 className="text-2xl font-bold">{nama}</h1>
        <p className="mt-2 text-slate-600">
          Website ini sedang dalam persiapan.
        </p>
      </div>
    </div>
  );
}
