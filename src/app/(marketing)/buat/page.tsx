import type { Metadata } from 'next';
import { Wizard } from './_components/Wizard';

export const metadata: Metadata = {
  title: 'Bikin Website Bisnis Kamu — Cus.site',
  description:
    '5 langkah mudah. AI yang nulis. Website UMKM langsung jadi dalam 5 menit.',
};

export default function BuatPage() {
  return (
    <main className="min-h-screen px-4 py-10 md:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <a
            href="/"
            className="inline-block text-sm text-slate-500 hover:text-slate-700"
          >
            ← Kembali ke beranda
          </a>
          <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
            Mari bikin website bisnis kamu
          </h1>
          <p className="mt-2 text-slate-600">
            Isi 5 langkah singkat. AI yang kerjain copywriting-nya.
          </p>
        </div>
        <Wizard />
      </div>
    </main>
  );
}
