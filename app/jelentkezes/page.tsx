"use client"

import { Suspense, useState, useEffect } from "react"
import { SubpageHero } from "@/components/subpage-hero"
import { Sparkles, CheckCircle, Loader2 } from "lucide-react"
import { useSearchParams } from "next/navigation"

interface Camp {
  id: string
  city: string
  venue: string
  dates: string
  earlyBirdPrice: string
  remainingSpots: number
}

function JelentkezesForm() {
  const searchParams = useSearchParams()
  const success = searchParams.get("success")
  const [camps, setCamps] = useState<Camp[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/camps")
      .then((r) => r.json())
      .then(setCamps)
  }, [])

  if (success) {
    return (
      <section className="py-20 bg-background">
        <div className="max-w-lg mx-auto px-6 text-center">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Köszönjük a jelentkezést!</h2>
          <p className="text-muted-foreground">Csapatunk hamarosan felveszi veled a kapcsolatot a megadott elérhetőségeken.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-background">
      <div className="max-w-2xl mx-auto px-6">
        <form
          action="/api/apply"
          method="POST"
          onSubmit={() => setLoading(true)}
          className="space-y-6 bg-white p-8 border border-border/50 shadow-sm"
        >
          <h2 className="font-serif text-2xl font-bold text-foreground flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-[#d4a017]" />
            Jelentkezési űrlap
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">Szülő neve *</label>
              <input type="text" name="parentName" required className="w-full h-11 px-4 border border-border text-foreground focus:border-[#d4a017] focus:outline-none transition-colors text-sm bg-background" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">Email *</label>
              <input type="email" name="parentEmail" required className="w-full h-11 px-4 border border-border text-foreground focus:border-[#d4a017] focus:outline-none transition-colors text-sm bg-background" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">Telefonszám *</label>
            <input type="tel" name="parentPhone" required className="w-full h-11 px-4 border border-border text-foreground focus:border-[#d4a017] focus:outline-none transition-colors text-sm bg-background" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">Gyermek neve *</label>
              <input type="text" name="childName" required className="w-full h-11 px-4 border border-border text-foreground focus:border-[#d4a017] focus:outline-none transition-colors text-sm bg-background" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">Gyermek életkora *</label>
              <input type="number" name="childAge" min="6" max="15" required className="w-full h-11 px-4 border border-border text-foreground focus:border-[#d4a017] focus:outline-none transition-colors text-sm bg-background" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">Tábor kiválasztása *</label>
            <select name="campId" required className="w-full h-11 px-4 border border-border text-foreground focus:border-[#d4a017] focus:outline-none transition-colors text-sm bg-background">
              <option value="">Válassz tábort...</option>
              {camps.map((camp) => (
                <option key={camp.id} value={camp.id}>
                  {camp.city} – {camp.dates} ({camp.remainingSpots} szabad hely) – {camp.earlyBirdPrice}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">Megjegyzés (opcionális)</label>
            <textarea name="notes" rows={3} className="w-full px-4 py-3 border border-border text-foreground focus:border-[#d4a017] focus:outline-none transition-colors text-sm bg-background resize-none" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#d4a017] text-[#0a1f0a] font-semibold hover:bg-[#d4a017]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Jelentkezés elküldése</>}
          </button>
        </form>
      </div>
    </section>
  )
}

export default function JelentkezesPage() {
  return (
    <main>
      <SubpageHero title="Jelentkezés" subtitle="Töltsd ki az alábbi űrlapot és csatlakozz a táborhoz!" />
      <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Betöltés...</div>}>
        <JelentkezesForm />
      </Suspense>
    </main>
  )
}
