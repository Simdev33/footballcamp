"use client"

import { useState, useTransition } from "react"
import { resendPaymentConfirmationEmail } from "@/lib/actions"
import { AlertCircle, CheckCircle2, Loader2, Mail } from "lucide-react"

export function ResendPaymentConfirmationButton({ applicationId }: { applicationId: string }) {
  const [pending, start] = useTransition()
  const [result, setResult] = useState<{ ok: boolean; email?: string; error?: string } | null>(null)

  function run() {
    if (!window.confirm("Biztosan újraküldöd a fizetési visszaigazoló emailt a szülőnek?")) {
      return
    }

    setResult(null)
    start(async () => {
      const response = await resendPaymentConfirmationEmail(applicationId)
      setResult(response)
    })
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={run}
        disabled={pending}
        className="inline-flex min-h-10 items-center gap-2 rounded-2xl bg-teal-600 px-4 text-sm font-bold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
        Fizetési visszaigazolás újraküldése
      </button>

      {result?.ok && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          Email elküldve: {result.email}
        </div>
      )}

      {result && !result.ok && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <AlertCircle className="h-4 w-4" />
          {result.error}
        </div>
      )}
    </div>
  )
}
