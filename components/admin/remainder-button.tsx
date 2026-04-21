"use client"

import { useState, useTransition } from "react"
import { sendRemainderLink } from "@/lib/actions"
import { Copy, Mail, CheckCircle2, Link as LinkIcon, Loader2 } from "lucide-react"

export function RemainderButton({ applicationId }: { applicationId: string }) {
  const [pending, start] = useTransition()
  const [result, setResult] = useState<
    | null
    | {
        ok: boolean
        url?: string | null
        emailed?: boolean
        emailError?: string
        error?: string
      }
  >(null)
  const [copied, setCopied] = useState(false)

  async function run(send: boolean) {
    setResult(null)
    setCopied(false)
    start(async () => {
      const r = await sendRemainderLink(applicationId, { send })
      setResult(r)
    })
  }

  async function copy() {
    if (!result?.url) return
    try {
      await navigator.clipboard.writeText(result.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => run(true)}
          disabled={pending}
          className="inline-flex items-center gap-2 h-9 px-4 bg-[#d4a017] text-[#0a1f0a] text-sm font-semibold hover:bg-[#d4a017]/90 transition-colors disabled:opacity-50"
        >
          {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
          Hátralévő küldése emailben
        </button>
        <button
          type="button"
          onClick={() => run(false)}
          disabled={pending}
          className="inline-flex items-center gap-2 h-9 px-4 bg-white/5 text-white/70 text-sm hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <LinkIcon className="w-4 h-4" />
          Csak link generálása
        </button>
      </div>

      {result && result.ok && result.url && (
        <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs space-y-2">
          {result.emailed && (
            <p className="text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Email elküldve.
            </p>
          )}
          {!result.emailed && result.emailError && (
            <p className="text-amber-400">
              Email küldése sikertelen ({result.emailError}). A linket kimásolhatod és manuálisan átküldheted.
            </p>
          )}
          <div className="flex items-center gap-2">
            <input
              value={result.url}
              readOnly
              className="flex-1 h-8 px-2 bg-white/5 border border-white/10 text-white/80 text-[11px] font-mono"
            />
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-1 h-8 px-2 bg-white/5 text-white/60 hover:bg-white/10 text-xs"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Másolva" : "Másol"}
            </button>
          </div>
        </div>
      )}

      {result && !result.ok && (
        <div className="bg-red-500/5 border border-red-500/20 p-3 text-xs text-red-400">
          {result.error}
        </div>
      )}
    </div>
  )
}
