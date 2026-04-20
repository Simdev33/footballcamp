"use client"

import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Youtube, ArrowRight, CheckCircle, Mail, Cookie } from "lucide-react"
import { reopenCookieBanner } from "@/components/cookie-banner"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useLanguage } from "@/lib/language-context"

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
]

export function Footer() {
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubscribed(true)
  }

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
      <div className="relative z-10 max-w-[1800px] mx-auto px-4 md:px-12 lg:px-24 py-10 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Link href="/" className="flex items-center mb-8">
              <Image
                src="/kickoff-logo.png"
                alt="Kickoff Elite Football Camps"
                width={280}
                height={112}
                className="h-24 w-auto object-contain brightness-110"
                loading="lazy"
              />
            </Link>
            <p className="text-white/60 max-w-sm leading-relaxed mb-6 text-sm">{t.footer.desc}</p>
            <a
              href="mailto:kickoff.focitabor@gmail.com"
              className="inline-flex items-center gap-2 text-white/80 hover:text-[#d4a017] text-sm mb-8 transition-colors"
            >
              <Mail className="w-4 h-4" />
              kickoff.focitabor@gmail.com
            </a>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 flex items-center justify-center text-white/60 hover:bg-[#d4a017] hover:text-[#0a1f0a] transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-3 lg:col-start-7">
            <h3 className="text-xs text-[#d4a017] tracking-[0.3em] uppercase mb-6 font-medium">{t.footer.navTitle}</h3>
            <ul className="space-y-3">
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

          {/* Newsletter */}
          <div className="lg:col-span-4">
            <h3 className="text-xs text-[#d4a017] tracking-[0.3em] uppercase mb-6 font-medium">{t.footer.newsletterTitle}</h3>
            <p className="text-white/60 mb-6 text-sm">{t.footer.newsletterDesc}</p>
            {subscribed ? (
              <div className="flex items-center gap-4 p-6 bg-[#d4a017]/10 text-[#d4a017] border border-[#d4a017]/30">
                <CheckCircle className="w-6 h-6" />
                <span className="font-semibold text-base">{t.footer.subscribed}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.footer.emailPlaceholder}
                  className="bg-white/10 border-white/20 focus:border-[#d4a017] h-14 flex-1 rounded-none text-base text-white placeholder:text-white/40"
                  required
                />
                <button type="submit" className="px-6 h-14 bg-[#d4a017] text-[#0a1f0a] font-semibold hover:bg-[#d4a017]/90 transition-colors">
                  <ArrowRight className="w-6 h-6" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Scoreboard-style copyright */}
        <div className="mt-14 pt-6 border-t border-white/10">
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
