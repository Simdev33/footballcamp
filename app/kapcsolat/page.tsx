"use client"

import { Mail, Phone, Facebook, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

const CONTACT_CARDS = [
  { icon: Mail, label: "Email", value: "kickoff.focitabor@gmail.com", href: "mailto:kickoff.focitabor@gmail.com", color: "bg-blue-600" },
  { icon: Phone, label: "Telefon", value: "+36 30 123 4567", href: "tel:+36301234567", color: "bg-emerald-600" },
]

const SOCIALS = [
  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/kickoffelite", color: "hover:bg-[#1877F2]" },
]

export default function KapcsolatPage() {
  const { t } = useLanguage()

  return (
    <main>
      {/* Hero */}
      <section className="relative pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[#0a1f0a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#d4a01714_0%,transparent_60%)]" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 text-center">
          <Mail className="w-12 h-12 text-[#d4a017] mx-auto mb-6" />
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            Lépj velünk <span className="text-[#d4a017]">kapcsolatba!</span>
          </h1>
          <p className="mt-6 text-lg text-white/60 max-w-xl mx-auto">
            Kérdésed van a táborokról, jelentkezésről vagy a partnerprogramról? Keress minket bátran!
          </p>
        </div>
      </section>

      {/* Contact Cards Grid */}
      <section className="relative -mt-10 z-20 max-w-[1100px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          {CONTACT_CARDS.map((card) => {
            const Wrapper = card.href ? "a" : "div"
            return (
              <Wrapper
                key={card.label}
                {...(card.href ? { href: card.href } : {})}
                className="group p-6 bg-white shadow-lg hover:shadow-xl transition-all duration-300 text-center hover:-translate-y-1"
              >
                <div className={`w-14 h-14 ${card.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className="w-7 h-7 text-white" />
                </div>
                <span className="block text-xs text-gray-400 uppercase tracking-wider mb-1">{card.label}</span>
                <span className="block text-foreground font-semibold text-sm">{card.value}</span>
              </Wrapper>
            )
          })}
        </div>
      </section>

      {/* Message Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-[700px] mx-auto px-6 md:px-12 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            Írj nekünk <span className="text-[#d4a017]">üzenetet!</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Csapatunk 24 órán belül válaszol minden megkeresésre.
          </p>
          <div className="mt-10">
            <a
              href="mailto:kickoff.focitabor@gmail.com"
              className="inline-flex items-center gap-3 px-10 py-5 bg-[#d4a017] text-[#0a1f0a] text-lg font-semibold hover:shadow-[0_20px_50px_#d4a0174d] transition-shadow duration-300"
            >
              <Mail className="w-6 h-6" />
              kickoff.focitabor@gmail.com
              <ArrowRight className="w-6 h-6" />
            </a>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-16 bg-[#0a1f0a]">
        <div className="max-w-[700px] mx-auto px-6 md:px-12 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3">
            Kövess a <span className="text-[#d4a017]">közösségi médiában!</span>
          </h2>
          <p className="text-white/50 text-sm mb-10">Kövesd oldalunkat a legfrissebb hírekért, képekért és videókért.</p>
          <div className="flex justify-center gap-5">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className={`group flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/10 text-white font-medium transition-all duration-300 ${social.color} hover:text-white hover:border-transparent`}
              >
                <social.icon className="w-6 h-6" />
                <span className="text-sm">{social.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-background">
        <div className="max-w-[700px] mx-auto px-6 md:px-12 text-center">
          <p className="text-muted-foreground mb-6">Készen állsz a jelentkezésre?</p>
          <Link href="/jelentkezes" className="inline-flex items-center gap-3 px-8 py-4 bg-[#0a1f0a] text-[#d4a017] text-base font-semibold hover:bg-[#d4a017] hover:text-[#0a1f0a] transition-colors duration-300">
            Jelentkezés
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  )
}
