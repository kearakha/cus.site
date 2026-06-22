/**
 * Marketing layout — untuk landing page & wizard.
 * Beda dari root layout: tidak inject global nav Cus.app,
 * supaya tenant site (yang pakai root layout via middleware) tidak
 * kena nav marketing.
 *
 * Catatan: Tenant site di /_sites/[domain] TIDAK lewat layout ini
 * karena route group (marketing) tidak match URL /_sites/...
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {children}
    </div>
  );
}
