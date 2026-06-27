import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-7xl font-black text-slate-200 select-none">404</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Website ini belum tersedia atau sudah dihapus.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition"
        >
          ← Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
