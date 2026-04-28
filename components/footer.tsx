"use client"

import { Cookie, Facebook, Mail, Phone } from "lucide-react"
import { reopenCookieBanner } from "@/components/cookie-banner"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { useState, type FormEvent } from "react"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="relative bg-[#0a1f0a] text-white overflow-hidden">
      {/* Top grass edge */}
      <div className="h-2 md:h-3 bg-gradient-to-r from-[#1e6b1e] via-[#2d7a2d] to-[#1e6b1e]">
        <div className="h-full bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.015)_0px,rgba(255,255,255,0.015)_50px,transparent_50px,transparent_100px)]" />
      </div>

      {/* Pitch lines */}
      <svg className="absolute top-8 left-0 right-0 bottom-0 w-full h-full opacity-[0.025] pointer-events-none" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
        <line x1="400" y1="0" x2="400" y2="400" stroke="white" strokeWidth="2" />
        <circle cx="400" cy="200" r="60" stroke="white" strokeWidth="2" fill="none" />
      </svg>

      <div className="relative z-10 max-w-[1800px] mx-auto px-4 md:px-12 lg:px-24 py-10 lg:py-16">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Link href="/" className="flex items-center mb-6">
              <Image
                src="/kickoff-logo.png"
                alt="Kickoff Elite Football Camps"
                width={280}
                height={112}
                className="h-24 w-auto object-contain brightness-110"
                loading="lazy"
              />
            </Link>
            <p className="text-white/60 max-w-md leading-relaxed mb-6 text-sm">{t.footer.desc}</p>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:info@kickoffcamps.hu"
                className="inline-flex items-center gap-2 text-white/80 hover:text-[#d4a017] text-sm transition-colors"
              >
                <Mail className="w-4 h-4" />
                info@kickoffcamps.hu
              </a>
              <a
                href="tel:+36307551110"
                className="inline-flex items-center gap-2 text-white/80 hover:text-[#d4a017] text-sm transition-colors"
              >
                <Phone className="w-4 h-4" />
                +36 30 755 1110
              </a>
              <a
                href="https://www.facebook.com/kickoffcamps"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex items-center gap-2 text-white/80 hover:text-[#d4a017] text-sm transition-colors"
              >
                <Facebook className="w-4 h-4" />
                facebook.com/kickoffcamps
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-3 lg:pl-4">
            <h3 className="text-xs text-[#d4a017] tracking-[0.3em] uppercase mb-6 font-medium">{t.footer.navTitle}</h3>
            <ul className="grid gap-y-3">
              {t.footer.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/60 hover:text-white transition-colors inline-flex items-center gap-2 text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={reopenCookieBanner}
                  className="text-white/60 hover:text-white transition-colors inline-flex items-center gap-2 text-sm"
                >
                  <Cookie className="w-3.5 h-3.5" />
                  {(t as unknown as { cookieBanner: { reopen: string } }).cookieBanner.reopen}
                </button>
              </li>
            </ul>
          </div>

          <FooterNewsletter />
        </div>

        {/* Legal / imprint line */}
        <div className="mt-12 pt-6 border-t border-white/10">
          <p className="text-white/40 text-xs leading-relaxed mb-4">
            Tireksz Nonprofit Kft. · 6728 Szeged, Felsőnyomás út 47. · Cégjegyzékszám: 06-09-028994 · Adószám: 32342651-1-06
          </p>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-4 py-3 md:px-6 md:py-4 bg-[#0d260d] border border-[#d4a017]/15 rounded-lg">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#d4a017]/50" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 2L14 7 19.5 7 15.5 10.5 17 16 12 12.5 7 16 8.5 10.5 4.5 7 10 7Z" fill="currentColor" fillOpacity="0.3" />
              </svg>
              <p className="text-white/40 text-xs md:text-sm">{t.footer.copyright}</p>
            </div>
            <p className="text-sm md:text-base text-[#d4a017] italic font-serif">{t.footer.motto}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterNewsletter() {
  const { t, locale } = useLanguage()
  const [email, setEmail] = useState("")
  const [website, setWebsite] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus("loading")
    setMessage("")

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale, source: "footer", website }),
      })
      const data = (await res.json().catch(() => null)) as { message?: string } | null

      if (!res.ok) {
        setStatus("error")
        setMessage(data?.message || "A feliratkozás most nem sikerült.")
        return
      }

      setEmail("")
      setStatus("success")
      setMessage(t.footer.subscribed)
    } catch {
      setStatus("error")
      setMessage("A feliratkozás most nem sikerült.")
    }
  }

  return (
    <div className="lg:col-span-4">
      <h3 className="text-xs text-[#d4a017] tracking-[0.3em] uppercase mb-4 font-medium">{t.footer.newsletterTitle}</h3>
      <p className="text-white/60 text-sm leading-relaxed mb-4">{t.footer.newsletterDesc}</p>
      <form onSubmit={submit} className="space-y-3">
        <input
          type="text"
          name="website"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
          <label className="sr-only" htmlFor="newsletter-email">
            {t.footer.emailPlaceholder}
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t.footer.emailPlaceholder}
            className="min-h-11 flex-1 rounded-xl border border-white/15 bg-white/10 px-4 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[#d4a017]/70 focus:bg-white/15"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="min-h-11 rounded-xl bg-[#d4a017] px-5 text-sm font-bold text-[#0a1f0a] transition hover:bg-[#e5b62e] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading" ? "..." : t.footer.subscribeButton}
          </button>
        </div>
        {message && (
          <p className={`text-xs ${status === "error" ? "text-red-200" : "text-emerald-200"}`} role="status">
            {message}
          </p>
        )}
      </form>
    </div>
  )
}
