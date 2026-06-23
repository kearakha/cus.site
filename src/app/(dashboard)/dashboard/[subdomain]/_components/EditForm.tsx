'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { updateKontenAction, type UpdateKontenInput } from '../actions';
import { ImageUploader } from '@/components/ImageUploader';

type ServiceItem = { title: string; description: string; imageUrl?: string | null };

type Props = {
  subdomain: string;
  bisnisId: string;
  initialData: {
    namaBisnis: string;
    logoUrl?: string | null;
    coverUrl?: string | null;
    lokasi: string;
    whatsapp: string;
    instagram?: string | null;
    tiktok?: string | null;
    facebook?: string | null;
    jamBuka?: string | null;
    jamTutup?: string | null;
    hariOperasional?: string | null;
    heroHeadline: string;
    heroSubtext: string;
    aboutParagraph: string;
    ctaText: string;
    seoTitle: string;
    seoDescription: string;
    accentColor: string;
    services: ServiceItem[];
  };
};

const EMPTY_SERVICE: ServiceItem = { title: '', description: '', imageUrl: '' };

// Preset warna: 3 untuk casual, 3 untuk professional, 3 untuk elegant
const COLOR_PRESETS = [
  { hex: 'f59e0b', label: 'Amber', group: 'Casual' },
  { hex: 'ea580c', label: 'Orange', group: 'Casual' },
  { hex: 'dc2626', label: 'Red', group: 'Casual' },
  { hex: '2563eb', label: 'Blue', group: 'Professional' },
  { hex: '1e40af', label: 'Deep Blue', group: 'Professional' },
  { hex: '0f766e', label: 'Teal', group: 'Professional' },
  { hex: 'a16207', label: 'Gold', group: 'Elegant' },
  { hex: '92400e', label: 'Bronze', group: 'Elegant' },
  { hex: '78350f', label: 'Dark Earth', group: 'Elegant' },
];

const HARI_OPTIONS = [
  'Setiap Hari',
  'Senin - Sabtu',
  'Senin - Jumat',
  'Senin - Minggu',
  'Weekend Saja',
] as const;

export function EditForm({ subdomain, bisnisId, initialData }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<{
    status: 'idle' | 'success' | 'error';
    message?: string;
  }>({ status: 'idle' });

  // Form state
  const [namaBisnis, setNamaBisnis] = useState(initialData.namaBisnis);
  const [logoUrl, setLogoUrl] = useState(initialData.logoUrl || '');
  const [coverUrl, setCoverUrl] = useState(initialData.coverUrl || '');
  const [lokasi, setLokasi] = useState(initialData.lokasi);
  const [whatsapp, setWhatsapp] = useState(initialData.whatsapp);
  const [instagram, setInstagram] = useState(initialData.instagram || '');
  const [tiktok, setTiktok] = useState(initialData.tiktok || '');
  const [facebook, setFacebook] = useState(initialData.facebook || '');
  const [jamBuka, setJamBuka] = useState(initialData.jamBuka || '');
  const [jamTutup, setJamTutup] = useState(initialData.jamTutup || '');
  const [hariOperasional, setHariOperasional] = useState(
    (initialData.hariOperasional as typeof HARI_OPTIONS[number]) || '',
  );
  const [heroHeadline, setHeroHeadline] = useState(initialData.heroHeadline);
  const [heroSubtext, setHeroSubtext] = useState(initialData.heroSubtext);
  const [aboutParagraph, setAboutParagraph] = useState(initialData.aboutParagraph);
  const [ctaText, setCtaText] = useState(initialData.ctaText);
  const [seoTitle, setSeoTitle] = useState(initialData.seoTitle);
  const [seoDescription, setSeoDescription] = useState(initialData.seoDescription);
  const [accentColor, setAccentColor] = useState(initialData.accentColor);
  const [services, setServices] = useState<ServiceItem[]>(
    initialData.services.length > 0 ? initialData.services : [EMPTY_SERVICE],
  );

  // Validation hints
  const hints = {
    namaBisnis: { used: namaBisnis.length, max: 80 },
    lokasi: { used: lokasi.length, max: 120 },
    whatsapp: { used: whatsapp.length, max: 20 },
    heroHeadline: { used: heroHeadline.length, max: 80 },
    heroSubtext: { used: heroSubtext.length, max: 150 },
    aboutParagraph: { used: aboutParagraph.length, max: 500 },
    ctaText: { used: ctaText.length, max: 25 },
    seoTitle: { used: seoTitle.length, max: 60 },
    seoDescription: { used: seoDescription.length, max: 160 },
  };

  const addService = () => {
    if (services.length >= 8) return;
    setServices((arr) => [...arr, EMPTY_SERVICE]);
  };

  const removeService = (i: number) => {
    if (services.length <= 1) return;
    setServices((arr) => arr.filter((_, idx) => idx !== i));
  };

  const updateService = (i: number, patch: Partial<ServiceItem>) => {
    setServices((arr) =>
      arr.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setState({ status: 'idle' });

    startTransition(async () => {
      const payload: UpdateKontenInput = {
        subdomain,
        namaBisnis,
        logoUrl,
        coverUrl,
        lokasi,
        whatsapp,
        instagram,
        tiktok,
        facebook,
        jamBuka,
        jamTutup,
        hariOperasional,
        heroHeadline,
        heroSubtext,
        aboutParagraph,
        ctaText,
        seoTitle,
        seoDescription,
        accentColor,
        services: services.map((s) => ({
          title: s.title,
          description: s.description,
          imageUrl: s.imageUrl || '',
        })),
      };

      const result = await updateKontenAction(payload);

      if (!result.success) {
        setState({ status: 'error', message: result.error });
        return;
      }

      setState({ status: 'success', message: 'Perubahan tersimpan!' });
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Branding */}
      <Section title="Branding" desc="Logo & cover yang muncul di website kamu.">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ImageUploader
            label="Logo"
            value={logoUrl}
            onChange={setLogoUrl}
            aspect="square"
            hint="Square. Untuk header."
            // Kirim bisnisId supaya upload masuk folder yang benar (bukan draft)
            // Note: ImageUploader saat ini hardcoded panggil /api/upload tanpa body.
            // Untuk MVP ini OK — owner akan upload ke folder "draft" lalu kita move manual.
            // TODO: extend ImageUploader untuk terima bisnisId.
          />
          <div className="sm:col-span-2">
            <ImageUploader
              label="Cover / Banner"
              value={coverUrl}
              onChange={setCoverUrl}
              aspect="wide"
              hint="Banner lebar untuk hero."
            />
          </div>
        </div>
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          ⚠ Untuk MVP, upload dari dashboard masuk folder sementara. Setelah simpan,
          file di-relink otomatis ke folder bisnis kamu. Kalau gagal, ulangi upload lalu simpan ulang.
        </p>
      </Section>

      {/* Bisnis & Kontak */}
      <Section title="Bisnis & Kontak" desc="Info dasar yang muncul di website.">
        <Field
          label="Nama Bisnis"
          hint={hints.namaBisnis}
          value={namaBisnis}
          onChange={setNamaBisnis}
        />
        <Field
          label="Lokasi / Alamat"
          hint={hints.lokasi}
          value={lokasi}
          onChange={setLokasi}
          hint2="Kalau diubah, peta akan di-geocode ulang otomatis."
        />
        <Field
          label="WhatsApp"
          hint={hints.whatsapp}
          value={whatsapp}
          onChange={setWhatsapp}
          placeholder="6281234567890"
        />
      </Section>

      {/* Operasional */}
      <Section title="Jam Operasional" desc="Tampil di section kontak. Opsional.">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Hari</label>
            <select
              value={hariOperasional}
              onChange={(e) => setHariOperasional(e.target.value as typeof hariOperasional)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            >
              <option value="">Pilih...</option>
              {HARI_OPTIONS.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Jam Buka</label>
            <input
              type="time"
              value={jamBuka}
              onChange={(e) => setJamBuka(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Jam Tutup</label>
            <input
              type="time"
              value={jamTutup}
              onChange={(e) => setJamTutup(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
        </div>
      </Section>

      {/* Social Media */}
      <Section title="Social Media" desc="Username saja (tanpa @). Otomatis dijadikan link.">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Instagram</label>
            <div className="flex items-stretch">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">@</span>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="username"
                className="flex-1 rounded-r-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">TikTok</label>
            <div className="flex items-stretch">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">@</span>
              <input
                type="text"
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
                placeholder="username"
                className="flex-1 rounded-r-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Facebook</label>
            <input
              type="text"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="username atau page slug"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
        </div>
      </Section>

      {/* Tema & Warna Aksen */}
      <Section
        title="Tema Warna"
        desc="Warna utama tombol, link, dan highlight di website kamu."
      >
        <div className="flex items-start gap-4">
          {/* Preview bubble besar */}
          <div
            className="flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center text-white text-xs font-bold shadow-inner"
            style={{ backgroundColor: `#${accentColor}` }}
          >
            #{accentColor}
          </div>

          <div className="flex-1 space-y-3">
            {/* Preset swatches */}
            <div className="grid grid-cols-3 gap-2">
              {COLOR_PRESETS.map((p) => (
                <button
                  key={p.hex}
                  type="button"
                  onClick={() => setAccentColor(p.hex)}
                  className={`group flex items-center gap-2 rounded-lg border-2 px-2 py-1.5 text-left transition ${
                    accentColor === p.hex
                      ? 'border-slate-900 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  title={`${p.group}: ${p.label}`}
                >
                  <span
                    className="h-5 w-5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: `#${p.hex}` }}
                  />
                  <span className="text-xs font-medium text-slate-700 truncate">
                    {p.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom hex input */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Custom hex color (tanpa #)
              </label>
              <input
                type="text"
                value={accentColor}
                onChange={(e) =>
                  setAccentColor(e.target.value.toLowerCase().replace(/[^0-9a-f]/g, '').slice(0, 6))
                }
                placeholder="f59e0b"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
              {accentColor.length > 0 && accentColor.length !== 6 && (
                <p className="mt-1 text-xs text-amber-600">
                  Hex color harus tepat 6 karakter (saat ini: {accentColor.length})
                </p>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* Hero */}
      <Section title="Hero Section" desc="Tampil pertama di paling atas website.">
        <Field
          label="Headline"
          hint={hints.heroHeadline}
          value={heroHeadline}
          onChange={setHeroHeadline}
        />
        <Field
          label="Sub-headline"
          hint={hints.heroSubtext}
          value={heroSubtext}
          onChange={setHeroSubtext}
        />
        <Field
          label="Teks Tombol CTA"
          hint={hints.ctaText}
          value={ctaText}
          onChange={setCtaText}
        />
      </Section>

      {/* About */}
      <Section title="Tentang Bisnis" desc="Paragraf deskripsi tentang bisnis kamu.">
        <Field
          label="Paragraf About"
          hint={hints.aboutParagraph}
          as="textarea"
          rows={5}
          value={aboutParagraph}
          onChange={setAboutParagraph}
        />
      </Section>

      {/* Services */}
      <Section
        title="Layanan / Produk"
        desc="Daftar layanan yang kamu tawarkan. Minimal 1, maksimal 8."
      >
        <div className="space-y-3">
          {services.map((svc, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-slate-50/50 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500">
                  LAYANAN #{i + 1}
                </span>
                {services.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeService(i)}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Hapus
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-1">
                  <ImageUploader
                    label="Foto"
                    value={svc.imageUrl || ''}
                    onChange={(url) => updateService(i, { imageUrl: url })}
                    aspect="square"
                    hint="Opsional."
                  />
                </div>

                <div className="sm:col-span-3 space-y-2">
                  <input
                    type="text"
                    placeholder="Judul layanan"
                    value={svc.title}
                    onChange={(e) => updateService(i, { title: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                  <textarea
                    placeholder="Deskripsi singkat"
                    value={svc.description}
                    onChange={(e) =>
                      updateService(i, { description: e.target.value })
                    }
                    rows={2}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
          {services.length < 8 && (
            <button
              type="button"
              onClick={addService}
              className="w-full rounded-xl border-2 border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-400 hover:text-slate-900 transition"
            >
              + Tambah Layanan
            </button>
          )}
        </div>
      </Section>

      {/* SEO */}
      <Section
        title="SEO (Google & Social Media)"
        desc="Yang muncul di hasil pencarian Google & share link WhatsApp."
      >
        <Field
          label="Judul SEO"
          hint={hints.seoTitle}
          value={seoTitle}
          onChange={setSeoTitle}
        />
        <Field
          label="Deskripsi SEO"
          hint={hints.seoDescription}
          as="textarea"
          rows={2}
          value={seoDescription}
          onChange={setSeoDescription}
        />
      </Section>

      {/* Feedback */}
      {state.status === 'error' && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm font-medium text-red-900">Gagal menyimpan</p>
          <p className="text-sm text-red-700 mt-1">{state.message}</p>
        </div>
      )}
      {state.status === 'success' && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 inline-flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-600" strokeWidth={2.5} />
          <p className="text-sm font-medium text-emerald-900">{state.message}</p>
        </div>
      )}

      {/* Submit */}
      <div className="sticky bottom-0 -mx-4 sm:-mx-6 -mb-8 px-4 sm:px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
        <a
          href={`http://${subdomain}.localhost:3000`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          Preview ↗
        </a>
        <button
          type="submit"
          disabled={isPending || accentColor.length !== 6}
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition disabled:opacity-50"
        >
          {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </form>
  );
}

// === Helpers ===

function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 space-y-4">
      <div>
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

type FieldProps = {
  label: string;
  hint: { used: number; max: number };
  value: string;
  onChange: (v: string) => void;
  as?: 'input' | 'textarea';
  rows?: number;
  placeholder?: string;
  hint2?: string;
};

function Field({ label, hint, value, onChange, as = 'input', rows = 3, placeholder, hint2 }: FieldProps) {
  const overLimit = hint.used > hint.max;
  const inputClass =
    'w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10';

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-slate-700">{label}</label>
        <span
          className={`text-xs ${overLimit ? 'text-red-600 font-semibold' : 'text-slate-400'}`}
        >
          {hint.used}/{hint.max}
        </span>
      </div>
      {as === 'input' ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className={`${inputClass} resize-y`}
        />
      )}
      {hint2 && <p className="mt-1.5 text-xs text-slate-500">{hint2}</p>}
    </div>
  );
}
