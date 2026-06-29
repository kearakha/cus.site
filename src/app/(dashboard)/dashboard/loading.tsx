export default function DashboardLoading() {
  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-36 rounded-lg bg-slate-200 animate-pulse" />
          <div className="h-4 w-48 rounded-md bg-slate-100 animate-pulse" />
        </div>
        <div className="hidden sm:block h-9 w-28 rounded-lg bg-slate-200 animate-pulse" />
      </div>

      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-white border border-slate-200 overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-48 h-20 sm:h-auto bg-slate-100 animate-pulse" />
              <div className="flex-1 p-5 space-y-3">
                <div className="h-5 w-40 rounded-md bg-slate-200 animate-pulse" />
                <div className="h-4 w-64 rounded-md bg-slate-100 animate-pulse" />
                <div className="h-3 w-32 rounded-md bg-slate-100 animate-pulse" />
                <div className="pt-2 border-t border-slate-100 flex gap-3">
                  <div className="h-4 w-12 rounded-md bg-slate-200 animate-pulse" />
                  <div className="h-4 w-12 rounded-md bg-slate-200 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
