"use client"

import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Youtube, ArrowRight, CheckCircle } from "lucide-react"
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
    <footer className="relative bg-[#0a1f0a] text-white border-t border-[#1a3a1a] overflow-hidden">
      <div className="relative z-10 max-w-[1800px] mx-auto px-4 md:px-12 lg:px-24 py-10 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Link href="/" className="flex items-center mb-8">
              <Image
                src="/kickoff-logo.png"
                alt="Kickoff Elite Football Camps"
                width={180}
                height={72}
                className="h-16 w-auto object-contain brightness-110"
                loading="lazy"
              />
            </Link>
            <p className="text-white/60 max-w-sm leading-relaxed mb-8 text-sm">{t.footer.desc}</p>
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

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40">{t.footer.copyright}</p>
          <p className="text-base text-[#d4a017] italic font-serif">{t.footer.motto}</p>
        </div>
      </div>
    </footer>
  )
}
