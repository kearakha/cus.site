export default function EditBisnisLoading() {
  return (
    <div>
      <div className="mb-6">
        <div className="h-3 w-24 rounded-md bg-slate-200 animate-pulse" />
        <div className="mt-2 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-52 rounded-lg bg-slate-200 animate-pulse" />
            <div className="h-4 w-40 rounded-md bg-slate-100 animate-pulse" />
          </div>
          <div className="h-9 w-24 rounded-lg bg-slate-200 animate-pulse" />
        </div>
      </div>

      <div className="space-y-6">
        {/* Published banner */}
        <div className="h-16 rounded-2xl bg-slate-100 animate-pulse" />
        {/* AI regen banner */}
        <div className="h-24 rounded-2xl bg-slate-800/10 animate-pulse" />
        {/* Form sections */}
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4"
          >
            <div className="h-5 w-32 rounded-md bg-slate-200 animate-pulse" />
            <div className="h-10 rounded-lg bg-slate-100 animate-pulse" />
            <div className="h-10 rounded-lg bg-slate-100 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
