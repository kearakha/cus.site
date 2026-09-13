import { Edit3, Heart, Search, Smartphone, Sparkles, Zap } from "lucide-react";
import { Reveal, Item } from "./motion";

type Feature = {
  Icon: typeof Sparkles;
  title: string;
  desc: string;
};

const LARGE: Feature = {
  Icon: Heart,
  title: "AI Copywriting Indonesia",
  desc: "Bukan terjemahan feel. Cus Engine paham kultur lokal, pakai bahasa yang natural untuk target market kamu — headline, tentang bisnis, sampai deskripsi tiap layanan.",
};

const SMALL: Feature[] = [
  {
    Icon: Sparkles,
    title: "3 Template Profesional",
    desc: "Casual, Professional, Elegant — font & warna beda tiap vibe.",
  },
  {
    Icon: Edit3,
    title: "Edit Langsung dari Website",
    desc: "Floating Admin Bar. Gak perlu login ke dashboard.",
  },
  {
    Icon: Smartphone,
    title: "Mobile-First Design",
    desc: "90% traffic UMKM dari HP. Optimal di semua layar.",
  },
  {
    Icon: Search,
    title: "SEO Lokal Ready",
    desc: 'SEO title & description dioptimasi untuk "[jenis bisnis] di [kota]".',
  },
  {
    Icon: Zap,
    title: "Live dalam Hitungan Detik",
    desc: "Klik Generate, langsung online. Share link, langsung bisa.",
  },
];

/** Bento: 1 kartu besar (AI Engine) + 5 kecil. Grid auto-flow ngisi sisa sel di sekitar kartu besar. */
export function Features() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="text-center">
          <Item>
            <h2 className="font-display text-4xl font-bold tracking-tight">
              Bukan cuma jadi, tapi siap jualan
            </h2>
          </Item>
          <Item>
            <p className="mx-auto mt-3 max-w-xl text-ink-2">
              Setiap website Cus.site punya fitur yang langsung bisa dipakai
              untuk jualan & dapat pelanggan.
            </p>
          </Item>
        </Reveal>

        <Reveal className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Item className="rounded-2xl border border-line bg-white p-8 shadow-card transition duration-200 ease-out hover:-translate-y-1 hover:shadow-card-hover sm:col-span-2 lg:col-span-2 lg:row-span-2">
            <LARGE.Icon
              className="h-9 w-9 text-orange-deep"
              strokeWidth={1.5}
            />
            <h3 className="mt-5 font-display text-2xl font-bold">
              {LARGE.title}
            </h3>
            <p className="mt-3 max-w-md text-base leading-relaxed text-ink-2">
              {LARGE.desc}
            </p>
          </Item>

          {SMALL.map((f) => (
            <Item
              key={f.title}
              className="rounded-2xl border border-line bg-white p-6 shadow-card transition duration-200 ease-out hover:-translate-y-1 hover:shadow-card-hover"
            >
              <f.Icon className="mb-3 h-7 w-7 text-navy" strokeWidth={1.5} />
              <h3 className="mb-1 font-display font-bold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-ink-2">{f.desc}</p>
            </Item>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
