"use client"

import { useLanguage } from "@/lib/language-context"

const FORMATION = [
  { row: [0], label: "Kapus", color: "#d4a017" },
  { row: [1, 2, 3, 4], label: "Védelem", color: "#22c55e" },
  { row: [5, 6, 7], label: "Középpálya", color: "#3b82f6" },
  { row: [8, 9, 10], label: "Támadás", color: "#ef4444" },
]

const POSITION_COLORS = [
  "#d4a017",
  "#22c55e", "#22c55e", "#22c55e", "#22c55e",
  "#3b82f6", "#3b82f6", "#3b82f6",
  "#ef4444", "#ef4444", "#ef4444",
]

export function USPSection() {
  const { t } = useLanguage()

  return (
    <section className="relative py-12 md:py-20 overflow-hidden bg-[#0a1f0a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#d4a01712_0%,transparent_60%)]" />

      <div className="relative z-10 max-w-[960px] mx-auto px-4 md:px-12">
        <div className="text-center mb-6 md:mb-10">
          <h2 className="font-serif text-2xl md:text-4xl lg:text-5xl font-bold text-white">
            {t.usp.title}{" "}
            <span className="text-[#d4a017]">{t.usp.titleHighlight}</span>
          </h2>
          <p className="mt-2 text-xs md:text-sm uppercase tracking-[0.2em] text-white/50">{t.usp.subtitle}</p>
        </div>

        {/* Desktop: focipálya felállás */}
        <div className="hidden md:block relative">
          <svg viewBox="0 0 700 620" fill="none" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
            <rect x="50" y="10" width="600" height="600" rx="6" stroke="#d4a017" strokeWidth="1.5" strokeOpacity="0.12" />
            <line x1="50" y1="310" x2="650" y2="310" stroke="#d4a017" strokeWidth="1.5" strokeOpacity="0.12" />
            <circle cx="350" cy="310" r="70" stroke="#d4a017" strokeWidth="1.5" strokeOpacity="0.12" />
            <circle cx="350" cy="310" r="3" fill="#d4a017" fillOpacity="0.2" />
            <rect x="200" y="10" width="300" height="120" stroke="#d4a017" strokeWidth="1.5" strokeOpacity="0.1" />
            <rect x="200" y="490" width="300" height="120" stroke="#d4a017" strokeWidth="1.5" strokeOpacity="0.1" />
          </svg>

          <div className="relative flex flex-col items-center gap-3 lg:gap-4 py-2">
            {FORMATION.map((line, rowIdx) => (
              <div key={rowIdx} className="flex flex-col items-center gap-1">
                <div className="flex justify-center gap-3 lg:gap-4 w-full">
                  {line.row.map((itemIdx) => {
                    const item = t.usp.items[itemIdx]
                    if (!item) return null
                    const clr = POSITION_COLORS[itemIdx]
                    return (
                      <div
                        key={itemIdx}
                        className="group relative flex items-center justify-center w-[128px] h-[128px] lg:w-[148px] lg:h-[148px]"
                      >
                        <div
                          className="absolute inset-0 rounded-full border-2 transition-all duration-300 group-hover:scale-105"
                          style={{
                            borderColor: `${clr}40`,
                            background: `radial-gradient(circle at center, ${clr}08 0%, transparent 70%)`,
                          }}
                        />
                        <div
                          className="absolute inset-[3px] rounded-full border transition-all duration-300 opacity-0 group-hover:opacity-100"
                          style={{ borderColor: `${clr}60` }}
                        />
                        <div className="relative text-center px-2">
                          <span
                            className="block font-serif text-[28px] lg:text-[32px] font-bold leading-none mb-1"
                            style={{ color: clr }}
                          >
                            {itemIdx + 1}
                          </span>
                          <span className="block text-[10px] lg:text-[11px] leading-tight text-white/80 font-medium">
                            {item.title}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobil: focipálya felállás kompakt */}
        <div className="md:hidden relative">
          <div className="absolute inset-0 rounded-xl bg-[#0d260d]/60 border border-[#d4a017]/10" />

          <div className="relative px-2 py-4">
            {FORMATION.map((line, rowIdx) => (
              <div key={rowIdx} className="mb-3 last:mb-0">
                <div className="flex justify-center gap-2">
                  {line.row.map((itemIdx) => {
                    const item = t.usp.items[itemIdx]
                    if (!item) return null
                    const clr = POSITION_COLORS[itemIdx]
                    return (
                      <div
                        key={itemIdx}
                        className="flex flex-col items-center text-center w-[72px]"
                      >
                        <div
                          className="w-11 h-11 rounded-full flex items-center justify-center mb-1 border-2"
                          style={{
                            borderColor: `${clr}50`,
                            background: `${clr}15`,
                          }}
                        >
                          <span className="font-serif text-base font-bold" style={{ color: clr }}>
                            {itemIdx + 1}
                          </span>
                        </div>
                        <span className="text-[8px] leading-tight text-white/70 font-medium px-0.5">
                          {item.title}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 px-3 pb-3 pt-1">
            {FORMATION.map((line, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: line.color }} />
                <span className="text-[9px] text-white/40 font-medium">{line.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
