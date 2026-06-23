import { Clock } from 'lucide-react';

/**
 * Renders jam operasional bisnis.
 * Hanya tampil kalau minimal 1 field (hariOperasional, jamBuka, atau jamTutup) ada.
 */
type Props = {
  hariOperasional?: string | null;
  jamBuka?: string | null;
  jamTutup?: string | null;
  className?: string;
  /** Style: "default" = baris vertikal, "inline" = single line */
  variant?: 'default' | 'inline';
  iconClassName?: string;
};

export function OperatingHours({
  hariOperasional,
  jamBuka,
  jamTutup,
  className = '',
  variant = 'default',
  iconClassName = 'h-4 w-4',
}: Props) {
  const hasAny = Boolean(hariOperasional || jamBuka || jamTutup);
  if (!hasAny) return null;

  const parts: string[] = [];
  if (hariOperasional) parts.push(hariOperasional);
  if (jamBuka && jamTutup) {
    parts.push(`${jamBuka} - ${jamTutup} WIB`);
  } else if (jamBuka) {
    parts.push(`Buka ${jamBuka}`);
  } else if (jamTutup) {
    parts.push(`Tutup ${jamTutup}`);
  }

  if (variant === 'inline') {
    return (
      <p className={`inline-flex items-center gap-1.5 text-sm ${className}`}>
        <Clock className={iconClassName} strokeWidth={2} />
        {parts.join(' · ')}
      </p>
    );
  }

  return (
    <div className={`flex items-start gap-2 ${className}`}>
      <Clock className={`${iconClassName} mt-0.5 flex-shrink-0`} strokeWidth={2} />
      <div className="text-sm">
        {parts.map((p, i) => (
          <p key={i} className="leading-snug">{p}</p>
        ))}
      </div>
    </div>
  );
}
