import { prisma } from "@/lib/db";
import { Eye, TrendingUp } from "lucide-react";

type Props = {
  bisnisId: string;
};

/**
 * AnalyticsWidget — server component that shows simple page view stats.
 *
 * Displays:
 * - Total views (all time)
 * - Views last 7 days
 * - Simple daily sparkline (last 7 days)
 *
 * Used on the dashboard edit page.
 */
export async function AnalyticsWidget({ bisnisId }: Props) {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Parallel queries for efficiency
  const [totalViews, recentViews, topReferrers] = await Promise.all([
    prisma.pageView.count({
      where: { bisnisId },
    }),
    prisma.pageView.findMany({
      where: {
        bisnisId,
        createdAt: { gte: sevenDaysAgo },
      },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.pageView.groupBy({
      by: ["referrer"],
      where: { bisnisId, createdAt: { gte: sevenDaysAgo } },
      _count: { referrer: true },
      orderBy: { _count: { referrer: "desc" } },
      take: 5,
    }),
  ]);

  // Group views by day for sparkline
  const dailyCounts = getDailyCounts(
    recentViews.map((v) => v.createdAt),
    sevenDaysAgo,
  );
  const weekTotal = recentViews.length;
  const maxDaily = Math.max(...dailyCounts, 1);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30">
          <Eye
            className="h-4 w-4 text-blue-600 dark:text-blue-400"
            strokeWidth={2}
          />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Statistik Pengunjung
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {totalViews.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Total views
          </p>
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white inline-flex items-center gap-1.5">
            {weekTotal.toLocaleString("id-ID")}
            {weekTotal > 0 && (
              <TrendingUp
                className="h-4 w-4 text-emerald-500"
                strokeWidth={2}
              />
            )}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            7 hari terakhir
          </p>
        </div>
      </div>

      {/* Sparkline — simple bar chart */}
      <div className="flex items-end gap-1 h-10">
        {dailyCounts.map((count, i) => {
          const height = count === 0 ? 2 : Math.max(4, (count / maxDaily) * 40);
          return (
            <div
              key={i}
              className="flex-1 rounded-sm bg-blue-200 dark:bg-blue-800 transition-all"
              style={{ height: `${height}px` }}
              title={`${count} views`}
            />
          );
        })}
      </div>
      <p className="mt-1.5 text-[10px] text-slate-400 dark:text-slate-500 flex justify-between">
        <span>7 hari lalu</span>
        <span>Hari ini</span>
      </p>

      {/* Top referrer — 7 hari terakhir */}
      {topReferrers.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Sumber traffic
          </p>
          <ul className="space-y-1.5">
            {topReferrers.map(({ referrer, _count }) => (
              <li
                key={referrer ?? "direct"}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-slate-600 dark:text-slate-400 truncate">
                  {formatReferrer(referrer)}
                </span>
                <span className="text-slate-900 dark:text-white font-medium">
                  {_count.referrer}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Format referrer URL jadi hostname yang readable. Null/kosong → "Langsung".
 */
function formatReferrer(referrer: string | null): string {
  if (!referrer) return "Langsung";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return referrer;
  }
}

/**
 * Group dates into daily counts for the last 7 days.
 * Returns array of 7 numbers representing views per day.
 */
function getDailyCounts(dates: Date[], startDate: Date): number[] {
  const counts = new Array(7).fill(0);
  for (const date of dates) {
    const dayIndex = Math.floor(
      (date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000),
    );
    if (dayIndex >= 0 && dayIndex < 7) {
      counts[dayIndex]++;
    }
  }
  return counts;
}
