"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { PenLine, Globe } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function Header() {
  const { locale, t, toggleLocale } = useLanguage()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const isHome = pathname === "/"

  const navLinks = [
    { href: "/rolunk", label: t.nav.about },
    { href: "/taborok", label: t.nav.camps },
    { href: "/klubok", label: t.nav.clubs },
    { href: "/partnerprogram", label: t.nav.partnerProgram },
    { href: "/galeria", label: t.nav.gallery },
    { href: "/kapcsolat", label: t.nav.contact },
    { href: "/gyik", label: t.nav.faq },
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const showSolid = scrolled || !isHome

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          showSolid
            ? "bg-[#eef1ec]/95 backdrop-blur-2xl shadow-[0_4px_30px_#0a1f0a1a]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1800px] px-4 md:px-12 lg:px-16 xl:px-24">
          <nav className="flex h-22 md:h-36 items-center justify-between">
            <Link href="/" className="flex items-center group flex-shrink-0">
              <Image
                src="/kickoff-logo.png"
                alt="Kickoff Elite Football Camps"
                width={320}
                height={128}
                className="h-18 md:h-28 w-auto object-contain drop-shadow-md"
                priority
              />
            </Link>

            <ul className="hidden lg:flex items-center gap-5 xl:gap-7">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <li key={link.href}>
                    <Link href={link.href} className="group relative py-3 block">
                      <span className={`transition-colors duration-300 text-[13px] tracking-wide font-medium whitespace-nowrap ${
                        isActive
                          ? "text-primary"
                          : showSolid
                            ? "text-muted-foreground group-hover:text-primary"
                            : "text-white/80 group-hover:text-primary"
                      }`}>
                        {link.label}
                      </span>
                      <span className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary origin-left transition-transform duration-300 ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                    </Link>
                  </li>
                )
              })}
            </ul>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleLocale}
                className={`hidden sm:inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold border transition-colors duration-300 hover:scale-105 ${
                  showSolid
                    ? "text-primary border-primary/30 hover:bg-primary/10"
                    : "text-[#d4a017] border-[#d4a017]/30 hover:bg-[#d4a017]/10"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                {locale === "hu" ? "EN" : "HU"}
              </button>

              <Link href="/jelentkezes" className="hidden sm:block">
                <span className={`inline-flex items-center gap-2 text-sm hover:text-primary transition-colors duration-300 font-medium ${showSolid ? "text-foreground" : "text-white"}`}>
                  <PenLine className="w-4 h-4 text-primary" />
                  {t.nav.register}
                </span>
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-primary/10 hover:bg-primary/20 transition-colors"
                aria-label="Menu"
              >
                <div className="relative w-6 h-4 flex flex-col justify-between">
                  <span className={`w-full h-0.5 bg-primary transition-all duration-300 origin-center ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
                  <span className={`w-full h-0.5 bg-primary transition-opacity duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
                  <span className={`w-full h-0.5 bg-primary transition-all duration-300 origin-center ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
                </div>
              </button>
            </div>
          </nav>
        </div>

        <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent transition-opacity duration-500 ${showSolid ? "opacity-100" : "opacity-0"}`} />
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-[#eef1ec] lg:hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#d4a01714_0%,transparent_50%)]" />
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-6 right-6 z-[70] w-12 h-12 flex items-center justify-center bg-primary/10 hover:bg-primary/20 transition-colors"
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <div className="relative flex flex-col items-center justify-center h-full gap-7">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`font-serif text-3xl sm:text-4xl transition-colors ${pathname === link.href ? "text-primary" : "text-foreground hover:text-primary"}`}>
                {link.label}
              </Link>
            ))}
            <button onClick={toggleLocale} className="flex items-center gap-3 px-8 py-4 border-2 border-primary text-primary text-xl font-semibold bg-transparent mt-4">
              <Globe className="w-6 h-6" />
              {locale === "hu" ? "English" : "Magyar"}
            </button>
            <Link href="/jelentkezes" className="flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground text-xl font-semibold">
              <PenLine className="w-5 h-5" />
              {t.nav.register}
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
