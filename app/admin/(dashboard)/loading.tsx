export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-7 w-48 bg-white/5 rounded" />
        <div className="h-9 w-28 bg-white/5 rounded" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#0a1f0a] border border-[#d4a017]/10 p-6">
            <div className="h-10 w-10 bg-white/5 rounded mb-4" />
            <div className="h-8 w-16 bg-white/5 rounded mb-2" />
            <div className="h-3 w-24 bg-white/5 rounded" />
          </div>
        ))}
      </div>
      <div className="bg-[#0a1f0a] border border-[#d4a017]/10">
        <div className="px-6 py-4 border-b border-[#d4a017]/10">
          <div className="h-5 w-40 bg-white/5 rounded" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="px-6 py-4 flex items-center gap-4 border-b border-white/5 last:border-0">
            <div className="flex-1">
              <div className="h-4 w-32 bg-white/5 rounded mb-2" />
              <div className="h-3 w-48 bg-white/5 rounded" />
            </div>
            <div className="h-6 w-16 bg-white/5 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
