import Image from "next/image";

type MockupProps = {
  /** Path screenshot 1440×900 di public/landing/ */
  src: string;
  alt: string;
  /** Teks di URL bar, mis. "barber-in.cus.kearakha.me" */
  url: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

/** Frame browser mac — spec di .docs/DESIGN.md §Komponen. */
export function Mockup({
  src,
  alt,
  url,
  priority,
  sizes,
  className = "",
}: MockupProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl bg-white shadow-mockup ${className}`}
    >
      <div className="grid h-[34px] grid-cols-[3rem_1fr_3rem] items-center bg-[#F3EEE5] px-3">
        <span className="flex gap-1.5" aria-hidden>
          <i className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        </span>
        <span className="truncate rounded-md bg-white/70 px-3 py-0.5 text-center font-mono text-[13px] text-ink-3">
          {url}
        </span>
      </div>
      <Image
        src={src}
        alt={alt}
        width={1440}
        height={900}
        priority={priority}
        sizes={sizes}
        className="h-auto w-full"
      />
    </div>
  );
}
