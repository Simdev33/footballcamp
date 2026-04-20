"use client"

import { useState } from "react"
import { X, Ruler } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const SIZES = [
  { ageKey: "age1", height: "111 - 116 cm", chest: "58.5 - 60.5 cm", waist: "55.5 - 56 cm", hip: "62.5 - 64 cm",  label: "116" },
  { ageKey: "age2", height: "123 - 128 cm", chest: "63.5 - 64 cm",   waist: "57.5 - 59 cm", hip: "66.5 - 68 cm",  label: "128" },
  { ageKey: "age3", height: "135 - 140 cm", chest: "68 - 71 cm",     waist: "62 - 63.5 cm", hip: "71.5 - 74.5 cm", label: "140" },
  { ageKey: "age4", height: "147 - 152 cm", chest: "75 - 78 cm",     waist: "66.5 - 68 cm", hip: "78 - 81 cm",    label: "152" },
  { ageKey: "age5", height: "159 - 164 cm", chest: "82.5 - 86 cm",   waist: "71 - 73 cm",   hip: "85.5 - 89 cm",  label: "164" },
  { ageKey: "age6", height: "171 - 176 cm", chest: "89.5 - 91.5 cm", waist: "75 - 76.5 cm", hip: "92 - 94 cm",    label: "176" },
] as const

export function SizeChart() {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()
  const s = t.sizeChart

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-xs md:text-sm text-[#d4a017] hover:text-[#0a1f0a] hover:bg-[#d4a017] border border-[#d4a017]/40 px-3 py-1.5 transition-colors"
      >
        <Ruler className="w-4 h-4" />
        {s.button}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative bg-white max-w-3xl w-full max-h-[90vh] overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={s.close}
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-[#0a1f0a] text-white hover:bg-[#d4a017] hover:text-[#0a1f0a] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Ruler className="w-6 h-6 text-[#d4a017]" />
                <h3 className="font-serif text-xl md:text-2xl font-bold text-[#0a1f0a]">{s.title}</h3>
              </div>

              <p className="text-sm text-muted-foreground mb-5">{s.intro}</p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#0a1f0a] text-white">
                      <th className="px-3 py-3 text-left font-semibold">{s.colAge}</th>
                      <th className="px-3 py-3 text-left font-semibold">{s.colSize}</th>
                      <th className="px-3 py-3 text-left font-semibold">{s.colHeight}</th>
                      <th className="px-3 py-3 text-left font-semibold">{s.colChest}</th>
                      <th className="px-3 py-3 text-left font-semibold">{s.colWaist}</th>
                      <th className="px-3 py-3 text-left font-semibold">{s.colHip}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SIZES.map((row, i) => (
                      <tr
                        key={row.label}
                        className={i % 2 === 0 ? "bg-[#f7f4ea]" : "bg-white"}
                      >
                        <td className="px-3 py-3 text-[#0a1f0a] font-medium">{s[row.ageKey]}</td>
                        <td className="px-3 py-3 text-[#d4a017] font-bold">{row.label}</td>
                        <td className="px-3 py-3 text-[#0a1f0a]/80">{row.height}</td>
                        <td className="px-3 py-3 text-[#0a1f0a]/80">{row.chest}</td>
                        <td className="px-3 py-3 text-[#0a1f0a]/80">{row.waist}</td>
                        <td className="px-3 py-3 text-[#0a1f0a]/80">{row.hip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-5 text-xs text-muted-foreground italic">{s.tip}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export const SIZE_OPTIONS = ["116", "128", "140", "152", "164", "176"] as const
