"use client"

import { useState, useTransition } from "react"
import { markTransferPaid } from "@/lib/actions"
import { CheckCircle2, Loader2, Banknote, AlertCircle } from "lucide-react"

type Kind = "deposit" | "full" | "remainder"

const LABELS: Record<Kind, string> = {
  deposit: "Foglaló beérkezett",
  full: "Teljes összeg beérkezett",
  remainder: "Hátralévő beérkezett",
}

export function TransferPaidButton({
  applicationId,
  kinds,
}: {
  applicationId: string
  kinds: Kind[]
}) {
  const [pending, start] = useTransition()
  const [loadingKind, setLoadingKind] = useState<Kind | null>(null)
  const [result, setResult] = useState<{ ok: boolean; error?: string; updated?: number } | null>(null)

  function run(kind: Kind) {
    const label = LABELS[kind].toLowerCase()
    if (!window.confirm(`Biztosan megerősíted, hogy az átutalás (${label}) beérkezett?\n\nEz generál egy Számlázz.hu számlát és elküldi a visszaigazoló emailt a szülőnek.`)) {
      return
    }
    setResult(null)
    setLoadingKind(kind)
    start(async () => {
      const r = await markTransferPaid(applicationId, kind)
      setResult(r)
      setLoadingKind(null)
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {kinds.map((kind) => (
          <button
            key={kind}
            type="button"
            onClick={() => run(kind)}
            disabled={pending}
            className="inline-flex items-center gap-2 h-9 px-4 bg-[#d4a017] text-[#0a1f0a] text-sm font-semibold hover:bg-[#d4a017]/90 transition-colors disabled:opacity-50"
          >
            {loadingKind === kind ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Banknote className="w-4 h-4" />
            )}
            {LABELS[kind]}
          </button>
        ))}
      </div>

      {result?.ok && (
        <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Átutalás rögzítve{result.updated ? ` (${result.updated} jelentkezés)` : ""}. Email és számla elküldve.
        </div>
      )}
      {result && !result.ok && (
        <div className="bg-red-500/5 border border-red-500/20 p-3 text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {result.error}
        </div>
      )}
    </div>
  )
}
