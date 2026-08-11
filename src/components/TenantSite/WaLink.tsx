"use client";

type Props = {
  href: string;
  bisnisId: string;
  className?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
  children: React.ReactNode;
};

/**
 * WaLink — pengganti <a href={waUrl}> biasa, ngirim event "wa_click" ke
 * /api/track sebelum user pindah ke WhatsApp.
 *
 * Pakai sendBeacon, bukan fetch: browser langsung navigasi keluar saat klik,
 * fetch biasa bisa kebatalin sebelum request kekirim.
 */
export function WaLink({
  href,
  bisnisId,
  className,
  style,
  "aria-label": ariaLabel,
  children,
}: Props) {
  function handleClick() {
    if (typeof navigator === "undefined" || !navigator.sendBeacon) return;
    const blob = new Blob(
      [
        JSON.stringify({
          bisnisId,
          path: window.location.pathname,
          type: "wa_click",
        }),
      ],
      { type: "application/json" },
    );
    navigator.sendBeacon("/api/track", blob);
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
      aria-label={ariaLabel}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
