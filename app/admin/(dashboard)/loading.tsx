export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 rounded-2xl bg-slate-200" />
        <div className="h-11 w-28 rounded-2xl bg-slate-200" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="h-12 w-12 rounded-2xl bg-slate-200 mb-4" />
            <div className="h-9 w-16 rounded-xl bg-slate-200 mb-2" />
            <div className="h-4 w-24 rounded-xl bg-slate-200" />
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="h-6 w-40 rounded-xl bg-slate-200" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="px-6 py-4 flex items-center gap-4 border-b border-slate-100 last:border-0">
            <div className="flex-1">
              <div className="h-4 w-32 rounded-xl bg-slate-200 mb-2" />
              <div className="h-3 w-48 rounded-xl bg-slate-200" />
            </div>
            <div className="h-8 w-16 rounded-xl bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  )
}
