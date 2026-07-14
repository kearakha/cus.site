import type { TemplateProps, Vibe } from './types';
import { CasualTemplate } from './CasualTemplate';
import { ProfessionalTemplate } from './ProfessionalTemplate';
import { ElegantTemplate } from './ElegantTemplate';
import { BoldTemplate } from './BoldTemplate';
import { MinimalTemplate } from './MinimalTemplate';

/**
 * Switch komponen template berdasarkan `vibe` di Bisnis.
 * Fallback ke CasualTemplate kalau vibe tidak dikenali.
 */
export function TemplateRenderer(props: TemplateProps) {
  switch (props.data.vibe as Vibe) {
    case 'professional':
      return <ProfessionalTemplate {...props} />;
    case 'elegant':
      return <ElegantTemplate {...props} />;
    case 'bold':
      return <BoldTemplate {...props} />;
    case 'minimal':
      return <MinimalTemplate {...props} />;
    case 'casual':
    default:
      return <CasualTemplate {...props} />;
  }
}
