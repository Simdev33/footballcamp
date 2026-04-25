"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { PenLine, Globe, ChevronDown } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const CLUB_ITEMS = [
  { label: "SL Benfica", href: "/klubok" },
]

type CampNavItem = { label: string; href: string }
type CampNavApiItem = {
  city: string
  venue?: string
  slug: string
  translationEn?: { city?: string; venue?: string }
}

export function Header() {
  const { locale, t, toggleLocale } = useLanguage()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [campItems, setCampItems] = useState<CampNavItem[]>([])
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout>>()
  const isHome = pathname === "/"

  useEffect(() => {
    let cancelled = false
    fetch("/api/camps-public")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: CampNavApiItem[]) => {
        if (cancelled || !Array.isArray(data)) return
        setCampItems(
          data.map((c) => {
            const city = locale === "en" ? c.translationEn?.city?.trim() || c.city : c.city
            const venue = locale === "en" ? c.translationEn?.venue?.trim() || c.venue : c.venue
            return {
              label: venue ? `${city} (${venue})` : city,
              href: `/taborok/${c.slug}`,
            }
          })
        )
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [locale])

  const navLinks = [
    { href: "/taborok", label: t.nav.camps, dropdown: campItems.length > 0 ? campItems : undefined },
    { href: "/klubok", label: t.nav.clubs, dropdown: CLUB_ITEMS },
    { href: "/gyik", label: t.nav.faq },
    { href: "/galeria", label: t.nav.gallery },
    { href: "/blog", label: t.nav.blog },
    { href: "/partnerprogram", label: t.nav.partnerProgram },
    { href: "/kapcsolat", label: t.nav.contact },
    { href: "/rolunk", label: t.nav.about },
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
          <nav className="flex h-18 md:h-24 items-center justify-between">
            <Link href="/" className="flex items-center group flex-shrink-0">
              <Image
                src="/kickoff-logo.png"
                alt="Kickoff Elite Football Camps"
                width={320}
                height={128}
                className={`h-14 md:h-22 w-auto object-contain transition-all duration-500 ${
                  showSolid
                    ? "drop-shadow-md"
                    : "brightness-[1.8] drop-shadow-[0_0_12px_rgba(212,160,23,0.4)]"
                }`}
                priority
              />
            </Link>

            <ul className="hidden lg:flex items-center gap-5 xl:gap-7">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
                const hasDropdown = !!(link as { dropdown?: unknown[] }).dropdown
                const dd = (link as { dropdown?: { label: string; href: string }[] }).dropdown

                return (
                  <li
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => {
                      if (hasDropdown) {
                        clearTimeout(dropdownTimeout.current)
                        setOpenDropdown(link.href)
                      }
                    }}
                    onMouseLeave={() => {
                      if (hasDropdown) {
                        dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 150)
                      }
                    }}
                  >
                    <Link href={link.href} className="group relative py-3 flex items-center gap-1">
                      <span className={`transition-colors duration-300 text-[13px] tracking-wide font-medium whitespace-nowrap ${
                        isActive
                          ? "text-primary"
                          : showSolid
                            ? "text-muted-foreground group-hover:text-primary"
                            : "text-white/80 group-hover:text-primary"
                      }`}>
                        {link.label}
                      </span>
                      {hasDropdown && <ChevronDown className={`w-3.5 h-3.5 transition-colors duration-300 ${isActive ? "text-primary" : showSolid ? "text-muted-foreground" : "text-white/60"}`} />}
                      <span className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary origin-left transition-transform duration-300 ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                    </Link>

                    {hasDropdown && dd && openDropdown === link.href && (
                      <div className="absolute top-full left-0 pt-2 z-50">
                        <div className="bg-white shadow-xl border border-border/50 min-w-[200px] py-2">
                          {dd.map((item) => (
                            <Link
                              key={item.href + item.label}
                              href={item.href}
                              className="block px-5 py-2.5 text-sm text-foreground hover:bg-[#d4a017]/10 hover:text-primary transition-colors"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
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
                <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#d4a017] text-[#0a1f0a] text-sm font-bold hover:shadow-[0_0_30px_#d4a01780] transition-all duration-300 rounded-sm">
                  <PenLine className="w-4 h-4" />
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
