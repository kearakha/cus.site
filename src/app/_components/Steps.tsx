import { ROOT_DOMAIN } from "@/lib/domain";
import { Reveal, Item } from "./motion";
import { Mockup } from "./Mockup";

type StepDef = {
  number: string;
  title: string;
  desc: string;
  src: string;
  alt: string;
  url: string;
};

/** Server component — 3 baris bergantian kiri/kanan, tiap baris ada visual. */
export function Steps() {
  const steps: StepDef[] = [
    {
      number: "01",
      title: "Isi Form Wizard",
      desc: "Nama bisnis, jenis, lokasi, WhatsApp, pilih vibe. Cuma 5 menit.",
      src: "/landing/wizard-step1.png",
      alt: "Form wizard langkah 1: nama dan jenis bisnis",
      url: `${ROOT_DOMAIN}/buat`,
    },
    {
      number: "02",
      title: "AI Generate Copy",
      desc: "Cus Engine nulis headline, tentang bisnis, dan layanan sesuai vibe kamu.",
      src: "/landing/wizard-step3.png",
      alt: "Form wizard langkah 3: pilih vibe website",
      url: `${ROOT_DOMAIN}/buat`,
    },
    {
      number: "03",
      title: "Langsung Live",
      desc: `Website kamu otomatis online di nama.${ROOT_DOMAIN}. Bisa langsung di-edit.`,
      src: "/landing/kopisrawung.png",
      alt: "Website Kopi Srawung yang sudah live",
      url: `kopisrawung.${ROOT_DOMAIN}`,
    },
  ];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="text-center">
          <Item>
            <h2 className="font-display text-4xl font-bold tracking-tight">
              3 langkah, website langsung jadi
            </h2>
          </Item>
          <Item>
            <p className="mt-3 text-ink-2">
              Gak perlu skill coding atau design.
            </p>
          </Item>
        </Reveal>

        <div className="mt-16 flex flex-col gap-20">
          {steps.map((step, i) => (
            <Reveal
              key={step.number}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              <Item className={i % 2 === 1 ? "lg:order-2" : undefined}>
                <span className="font-mono text-sm font-semibold text-orange-deep">
                  {step.number}
                </span>
                <h3 className="mt-3 font-display text-xl font-bold">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-[60ch] text-base leading-relaxed text-ink-2">
                  {step.desc}
                </p>
              </Item>
              <Item className={i % 2 === 1 ? "lg:order-1" : undefined}>
                <Mockup
                  src={step.src}
                  alt={step.alt}
                  url={step.url}
                  sizes="(min-width: 1024px) 560px, 100vw"
                />
              </Item>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
