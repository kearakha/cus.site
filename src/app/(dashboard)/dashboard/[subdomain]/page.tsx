import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
import { prisma } from "@/lib/db";
import {
  OWNER_COOKIE_NAME,
  SESSION_COOKIE_NAME_EXPORT,
  isOwner,
} from "@/lib/auth";
import { buildSiteUrl } from "@/components/TenantSite/types";
import { EditForm } from "./_components/EditForm";
import { VIBE_DESCRIPTIONS } from "@/app/(marketing)/buat/_components/steps";
import { AnalyticsWidget } from "@/components/AnalyticsWidget";

type Props = {
  params: { subdomain: string };
};

export async function generateMetadata({ params }: Props) {
  const bisnis = await prisma.bisnis.findUnique({
    where: { subdomain: params.subdomain },
    select: { namaBisnis: true },
  });
  return {
    title: bisnis
      ? `Edit ${bisnis.namaBisnis} — Dashboard`
      : "Edit — Dashboard",
  };
}

export default async function EditBisnisPage({ params }: Props) {
  const { subdomain } = params;

  // 1. Verifikasi ada session (email atau ownerToken)
  const hasSession =
    cookies().get(OWNER_COOKIE_NAME)?.value ||
    cookies().get(SESSION_COOKIE_NAME_EXPORT)?.value;
  if (!hasSession) {
    redirect("/login");
  }

  // 2. Fetch bisnis + konten + layanan
  const bisnis = await prisma.bisnis.findUnique({
    where: { subdomain },
    include: {
      kontenAI: true,
      layanan: { orderBy: { order: "asc" } },
    },
  });

  if (!bisnis || !bisnis.kontenAI) {
    notFound();
  }

  // 3. Verify ownership (email match ATAU ownerToken match)
  if (!isOwner(bisnis)) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Akses ditolak</h1>
        <p className="mt-2 text-sm text-slate-600">
          Kamu bukan owner dari website ini.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center text-sm font-medium text-slate-900 hover:underline"
        >
          ← Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  // 4. Render edit form
  const vibe = bisnis.vibe as keyof typeof VIBE_DESCRIPTIONS;
  const vibeInfo = VIBE_DESCRIPTIONS[vibe];

  return (
    <div>
      {/* Breadcrumb + header */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          ← Dashboard
        </Link>
        <div className="mt-2 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {bisnis.namaBisnis}
            </h1>
            <p className="mt-1 text-sm text-slate-500 font-mono">
              {bisnis.subdomain}.cus.site ·{" "}
              <span className="text-slate-700">
                {vibeInfo?.title || bisnis.vibe}
              </span>
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              Terakhir diubah:{" "}
              {bisnis.kontenAI.updatedAt.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <a
            href={buildSiteUrl(bisnis)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Lihat Live ↗
          </a>
        </div>
      </div>

      {/* Grid Layout for Form & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          {/* Edit form */}
          <EditForm
            subdomain={bisnis.subdomain}
            bisnisId={bisnis.id}
            published={bisnis.published}
            initialData={{
              namaBisnis: bisnis.namaBisnis,
              logoUrl: bisnis.logoUrl,
              coverUrl: bisnis.coverUrl,
              lokasi: bisnis.lokasi,
              whatsapp: bisnis.whatsapp,
              instagram: bisnis.instagram,
              tiktok: bisnis.tiktok,
              facebook: bisnis.facebook,
              youtubeUrl: bisnis.youtubeUrl,
              jamBuka: bisnis.jamBuka,
              jamTutup: bisnis.jamTutup,
              hariOperasional: bisnis.hariOperasional,
              heroHeadline: bisnis.kontenAI.heroHeadline,
              heroSubtext: bisnis.kontenAI.heroSubtext,
              aboutParagraph: bisnis.kontenAI.aboutParagraph,
              ctaText: bisnis.kontenAI.ctaText,
              seoTitle: bisnis.kontenAI.seoTitle,
              seoDescription: bisnis.kontenAI.seoDescription,
              accentColor: bisnis.kontenAI.accentColor || "f59e0b",
              services: bisnis.layanan.map((l) => ({
                title: l.title,
                description: l.description,
                harga: l.harga,
                imageUrl: l.imageUrl,
              })),
            }}
          />
        </div>
        <div className="space-y-6">
          <AnalyticsWidget bisnisId={bisnis.id} />
        </div>
      </div>
    </div>
  );
}
