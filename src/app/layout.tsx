import type { Metadata } from "next";
import { Toaster } from "sonner";
import { BreadcrumbJsonLd } from "@/components/TenantSite/JsonLd";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cus.site — Bikin Website Bisnis Kamu dalam 5 Menit",
  description:
    "Generator website instan untuk UMKM Indonesia. Isi form, AI yang nulis, langsung jadi.",
  metadataBase: new URL("https://cus.site"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased bg-white text-slate-900">
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: "https://cus.site" },
            { name: "Buat Website", url: "https://cus.site/buat" },
          ]}
        />
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
