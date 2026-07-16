"use client"

import { useState, useTransition } from "react"
import { sendBenficaCampInfoEmails } from "@/lib/actions"
import { AlertCircle, CheckCircle2, Loader2, Mail, ListChecks, Send } from "lucide-react"

type Result = {
  ok: boolean
  dryRun?: boolean
  total: number
  sent: number
  failed: Array<{ email: string; error: string }>
  recipients: Array<{ email: string; name: string; children: string[] }>
  error?: string
}

export function BenficaInfoEmailPanel() {
  const [pending, start] = useTransition()
  const [mode, setMode] = useState<"idle" | "dry" | "test" | "blast">("idle")
  const [testEmail, setTestEmail] = useState("")
  const [result, setResult] = useState<Result | null>(null)

  function runDryRun() {
    setResult(null)
    setMode("dry")
    start(async () => {
      const response = await sendBenficaCampInfoEmails({ dryRun: true })
      setResult(response)
      setMode("idle")
    })
  }

  function runTest() {
    const to = testEmail.trim()
    if (!to || !to.includes("@")) {
      setResult({
        ok: false,
        total: 0,
        sent: 0,
        failed: [],
        recipients: [],
        error: "Adj meg egy érvényes email címet a teszthez.",
      })
      return
    }
    setResult(null)
    setMode("test")
    start(async () => {
      const response = await sendBenficaCampInfoEmails({ testEmail: to })
      setResult(response)
      setMode("idle")
    })
  }

  function runBlast() {
    const count = result?.total || result?.recipients.length
    const label = count ? `${count} szülőnek` : "az összes befizető szülőnek"
    if (
      !window.confirm(
        `Biztosan kiküldöd a Benfica tájékoztatót ${label}?\n\nEz éles email — csak productionön, SMTP-vel működik.`,
      )
    ) {
      return
    }
    setResult(null)
    setMode("blast")
    start(async () => {
      const response = await sendBenficaCampInfoEmails({})
      setResult(response)
      setMode("idle")
    })
  }

  const busy = pending || mode !== "idle"

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Benfica tábor</p>
          <h2 className="mt-1 font-serif text-xl font-bold text-slate-950">Tájékoztató email kiküldése</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            A befizetett szülőknek (FULLY_PAID + DEPOSIT_PAID) megy a tábor előtti tudnivaló.
            Először nézd meg a címzetteket, küldj egy tesztet magadnak, aztán az éles kiküldést.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          onClick={runDryRun}
          disabled={busy}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mode === "dry" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ListChecks className="h-4 w-4" />}
          Címzettek (dry-run)
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="teszt@email.hu"
            disabled={busy}
            className="min-h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none ring-teal-500/30 placeholder:text-slate-400 focus:ring-2 disabled:opacity-60 sm:max-w-xs"
          />
          <button
            type="button"
            onClick={runTest}
            disabled={busy}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-teal-600 px-4 text-sm font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mode === "test" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            Teszt email
          </button>
        </div>

        <button
          type="button"
          onClick={runBlast}
          disabled={busy}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#0a1f0a] px-4 text-sm font-bold text-[#d4a017] transition hover:bg-[#06140a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mode === "blast" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Kiküldés mindenkinek
        </button>
      </div>

      {result && (
        <div className="mt-5 space-y-3">
          {result.ok && !result.error && (
            <div className="flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                {result.dryRun
                  ? `Dry-run kész: ${result.total} szülő kapná meg a levelet.`
                  : result.sent === 1 && result.total > 1
                    ? `Teszt email elküldve. (Éles címzettek: ${result.total})`
                    : `Kiküldve: ${result.sent} / ${result.total}`}
              </span>
            </div>
          )}

          {result.error && (
            <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                {result.error}
                {result.sent > 0 ? ` (Sikeres: ${result.sent}/${result.total})` : ""}
              </span>
            </div>
          )}

          {result.failed.length > 0 && (
            <div className="rounded-2xl border border-red-100 bg-red-50/50 px-4 py-3 text-xs text-red-700">
              <p className="font-bold">Sikertelen címek:</p>
              <ul className="mt-2 space-y-1">
                {result.failed.map((f) => (
                  <li key={f.email}>
                    {f.email}: {f.error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.recipients.length > 0 && (
            <details className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" open={!!result.dryRun}>
              <summary className="cursor-pointer text-sm font-bold text-slate-800">
                Címzettlista ({result.recipients.length})
              </summary>
              <ul className="mt-3 max-h-64 space-y-1.5 overflow-y-auto text-xs text-slate-600">
                {result.recipients.map((r) => (
                  <li key={r.email} className="border-b border-slate-200/80 pb-1.5 last:border-0">
                    <span className="font-semibold text-slate-900">{r.name}</span>
                    {" · "}
                    <span className="break-all">{r.email}</span>
                    {r.children.length > 0 && (
                      <span className="text-slate-500"> — {r.children.join(", ")}</span>
                    )}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </div>
  )
}
