import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Rocket, Sparkles } from 'lucide-react';
import { getOwnedBusinesses, buildAccessLink } from '@/lib/auth';
import { buildSiteUrl } from '@/components/TenantSite/types';
import { HapusButton } from '@/components/HapusButton';
import { AccessLinkCard } from '@/components/AccessLinkCard';

export const metadata = {
  title: 'Dashboard — Cus.site',
};

const VIBE_LABEL: Record<string, string> = {
  casual: 'Santai',
  professional: 'Profesional',
  elegant: 'Elegan',
};

const VIBE_COLOR: Record<string, string> = {
  casual: 'bg-amber-100 text-amber-800',
  professional: 'bg-blue-100 text-blue-800',
  elegant: 'bg-stone-200 text-stone-800',
};

export default async function DashboardPage() {
  const businesses = await getOwnedBusinesses();
  if (!businesses) redirect('/');

  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Website kamu
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {businesses.length === 0
              ? 'Kamu belum punya website.'
              : `${businesses.length} website${businesses.length > 1 ? '' : ''} aktif.`}
          </p>
        </div>
        <Link
          href="/buat"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-slate-800 transition"
        >
          + Bikin Lagi
        </Link>
      </div>

      {businesses.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {businesses.map((b) => (
            <article
              key={b.id}
              className="rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Preview header dengan accent color */}
                <div
                  className="sm:w-48 h-20 sm:h-auto flex sm:flex-col items-center sm:items-start justify-between sm:justify-center p-5"
                  style={{
                    backgroundColor: `#${b.kontenAI?.accentColor || '64748b'}15`,
                    borderBottom: `2px solid #${b.kontenAI?.accentColor || '64748b'}`,
                  }}
                >
                  <p className="text-xs font-mono text-slate-700 font-semibold truncate">
                    {b.subdomain}
                  </p>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      VIBE_COLOR[b.vibe] || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {VIBE_LABEL[b.vibe] || b.vibe}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 p-5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="font-semibold text-slate-900 truncate">
                        {b.namaBisnis}
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        {b.kontenAI?.heroHeadline || 'Belum ada konten'}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 truncate">
                    {b.lokasi} · {b._count.layanan} layanan
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <a
                        href={buildSiteUrl(b)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-slate-600 hover:text-slate-900"
                      >
                        Lihat ↗
                      </a>
                      <Link
                        href={`/dashboard/${b.subdomain}`}
                        className="text-xs font-semibold text-slate-900 hover:underline"
                      >
                        Edit →
                      </Link>
                    </div>
                    <HapusButton subdomain={b.subdomain} namaBisnis={b.namaBisnis} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Tip: simpan access link */}
      {businesses.length > 0 && (
        <div className="mt-10 p-4 rounded-2xl bg-amber-50 border border-amber-200">
          <h3 className="text-sm font-semibold text-amber-900 inline-flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" strokeWidth={2} />
            Tips: Simpan link akses kamu
          </h3>
          <p className="text-xs text-amber-800 mt-1 mb-3">
            Kalau clear cookies / ganti device, pakai link ini untuk balik ke dashboard tanpa perlu daftar ulang.
          </p>
          <AccessLinkCard link={buildAccessLink(businesses[0].ownerToken)} />
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
      <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
        <Rocket className="h-6 w-6 text-slate-700" strokeWidth={1.75} />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-900">
        Belum ada website
      </h2>
      <p className="mt-2 text-sm text-slate-600 max-w-sm mx-auto">
        Mulai bikin website pertama kamu. AI yang nulis, kamu tinggal approve.
      </p>
      <Link
        href="/buat"
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition"
      >
        Bikin Website Pertama →
      </Link>
    </div>
  );
}
