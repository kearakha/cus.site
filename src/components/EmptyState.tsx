import Link from 'next/link';

type Props = {
  /** Judul utama empty state */
  title: string;
  /** Deskripsi di bawah judul */
  description: string;
  /** Label tombol CTA */
  actionLabel?: string;
  /** URL tujuan CTA */
  actionHref?: string;
  /** Varian ilustrasi */
  variant?: 'website' | 'service' | 'generic';
};

/**
 * EmptyState — reusable empty state with inline SVG illustration.
 * Dipakai di dashboard list (belum punya bisnis) dan layanan list (belum ada layanan).
 */
export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  variant = 'generic',
}: Props) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center transition-colors">
      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center">
        {variant === 'website' && <WebsiteIllustration />}
        {variant === 'service' && <ServiceIllustration />}
        {variant === 'generic' && <GenericIllustration />}
      </div>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
        {title}
      </h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-slate-900 dark:bg-white px-5 py-2.5 text-sm font-medium text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

/** SVG ilustrasi — website/browser window */
function WebsiteIllustration() {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      className="h-24 w-24 text-slate-300 dark:text-slate-600"
      aria-hidden="true"
    >
      {/* Browser window */}
      <rect
        x="8"
        y="16"
        width="80"
        height="64"
        rx="6"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* Title bar */}
      <line x1="8" y1="28" x2="88" y2="28" stroke="currentColor" strokeWidth="2" />
      {/* Dots */}
      <circle cx="16" cy="22" r="2" fill="currentColor" />
      <circle cx="23" cy="22" r="2" fill="currentColor" />
      <circle cx="30" cy="22" r="2" fill="currentColor" />
      {/* Content lines */}
      <rect x="16" y="36" width="40" height="3" rx="1.5" fill="currentColor" opacity="0.5" />
      <rect x="16" y="44" width="64" height="2" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="16" y="50" width="56" height="2" rx="1" fill="currentColor" opacity="0.3" />
      {/* Image placeholder */}
      <rect x="16" y="58" width="28" height="16" rx="3" fill="currentColor" opacity="0.15" />
      <rect x="50" y="58" width="28" height="16" rx="3" fill="currentColor" opacity="0.15" />
    </svg>
  );
}

/** SVG ilustrasi — layanan/produk list */
function ServiceIllustration() {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      className="h-24 w-24 text-slate-300 dark:text-slate-600"
      aria-hidden="true"
    >
      {/* Card stack */}
      <rect
        x="14"
        y="22"
        width="68"
        height="20"
        rx="4"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 3"
      />
      <rect
        x="14"
        y="48"
        width="68"
        height="20"
        rx="4"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 3"
      />
      {/* Plus icon di tengah */}
      <circle cx="48" cy="82" r="8" stroke="currentColor" strokeWidth="2" />
      <line x1="48" y1="78" x2="48" y2="86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="44" y1="82" x2="52" y2="82" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Decorative lines on cards */}
      <rect x="22" y="28" width="24" height="2" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="22" y="33" width="40" height="2" rx="1" fill="currentColor" opacity="0.2" />
      <rect x="22" y="54" width="24" height="2" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="22" y="59" width="40" height="2" rx="1" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

/** SVG ilustrasi — generic empty */
function GenericIllustration() {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      className="h-24 w-24 text-slate-300 dark:text-slate-600"
      aria-hidden="true"
    >
      {/* Folder */}
      <path
        d="M12 28h24l4-6h40a4 4 0 014 4v44a4 4 0 01-4 4H12a4 4 0 01-4-4V32a4 4 0 014-4z"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* Empty content */}
      <circle cx="48" cy="50" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
      <line x1="44" y1="50" x2="52" y2="50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
