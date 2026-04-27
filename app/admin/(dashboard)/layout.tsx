"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
  LayoutDashboard, ImageIcon, Tent, ClipboardList,
  Users, LogOut, ChevronLeft, Menu, Shield, FileText, BookOpen, Info, X, ExternalLink,
} from "lucide-react"
import { useState, useTransition, useEffect } from "react"

const NAV_ITEMS = [
  { href: "/admin", label: "Áttekintés", icon: LayoutDashboard, hint: "Admin kezdőlap – rövid összefoglaló" },
  { href: "/admin/taborok", label: "Táborok", icon: Tent, hint: "Táborok létrehozása, szerkesztése" },
  { href: "/admin/jelentkezesek", label: "Jelentkezések", icon: ClipboardList, hint: "A beérkezett jelentkezések listája" },
  { href: "/admin/blog", label: "Hírek", icon: BookOpen, hint: "A weboldal Hírek aloldalán megjelenő cikkek" },
  { href: "/admin/rolunk", label: "Rólunk oldal", icon: Info, hint: "A „Rólunk” aloldal szövegeinek szerkesztése" },
  { href: "/admin/tartalom", label: "Oldalak szövegei és képei", icon: FileText, hint: "Főoldal, Klubok, Partnerprogram, GYIK stb. – szekciónként szövegek és képek egy helyen" },
  { href: "/admin/galeria", label: "Galéria", icon: ImageIcon, hint: "A galéria képeinek kezelése" },
  { href: "/admin/felhasznalok", label: "Felhasználók", icon: Users, hint: "Admin felhasználók kezelése" },
]

function DashboardInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  // Optimistic target: immediately reflect the clicked menu item so the user sees a reaction,
  // even while the new page is being rendered on the server.
  const [optimisticHref, setOptimisticHref] = useState<string | null>(null)

  // Reset optimistic target once the actual pathname catches up.
  useEffect(() => {
    if (optimisticHref && pathname.startsWith(optimisticHref)) {
      setOptimisticHref(null)
    }
  }, [pathname, optimisticHref])

  useEffect(() => {
    if (!mobileOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [mobileOpen])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-7 text-center shadow-sm">
          <div className="mx-auto mb-4 h-11 w-11 rounded-full border-4 border-teal-500 border-t-transparent animate-spin" />
          <p className="text-sm font-medium text-slate-700">Admin felület betöltése...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    if (typeof window !== "undefined") window.location.href = "/admin/login"
    return null
  }

  const role = (session?.user as any)?.role || "viewer"
  const filteredNav = NAV_ITEMS.filter((item) => {
    if (item.href === "/admin/felhasznalok" && role !== "super_admin") return false
    return true
  })

  const currentHref = optimisticHref || pathname
  const isActive = (href: string) =>
    href === "/admin" ? currentHref === "/admin" : currentHref.startsWith(href)

  const navigate = (href: string) => {
    if (pathname === href) return
    setOptimisticHref(href)
    setMobileOpen(false)
    startTransition(() => {
      router.push(href)
    })
  }

  const activeItem =
    filteredNav.find((n) => n.href === currentHref) ||
    filteredNav.find((n) => (n.href === "/admin" ? currentHref === "/admin" : currentHref.startsWith(n.href)))

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {mobileOpen && (
        <div className="fixed inset-0 bg-slate-950/45 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 h-screen z-50 bg-white border-r border-slate-200 flex flex-col transition-[width,transform] duration-200 shadow-xl shadow-slate-900/5 ${collapsed ? "w-20" : "w-72"} ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="min-h-20 flex items-center gap-3 px-4 border-b border-slate-200">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-sky-600 flex items-center justify-center flex-shrink-0 rounded-2xl shadow-sm">
            <Shield className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <span className="block font-serif font-bold text-slate-950 text-lg">Admin panel</span>
              <span className="block text-sm text-slate-500">Weboldal kezelése</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden h-11 w-11 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
            aria-label="Menü bezárása"
          >
            <X className="mx-auto h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto px-2" aria-label="Admin navigáció">
          {filteredNav.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                onClick={(e) => {
                  e.preventDefault()
                  navigate(item.href)
                }}
                onMouseEnter={() => router.prefetch(item.href)}
                className={`flex items-center gap-3 px-3 min-h-14 text-[15px] font-semibold rounded-2xl transition-colors duration-100 ${
                  active
                    ? "bg-teal-50 text-teal-800 ring-1 ring-teal-200"
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-teal-600" : "text-slate-400"}`} />
                {!collapsed && (
                  <span className="flex-1 min-w-0" title={item.hint}>
                    <span className="block truncate">{item.label}</span>
                    <span className="mt-0.5 hidden text-xs font-normal leading-snug text-slate-500 xl:block">{item.hint}</span>
                  </span>
                )}
                {active && <span className="w-1.5 h-8 bg-teal-500 rounded-full flex-shrink-0" />}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-slate-200 p-4">
          {!collapsed && session?.user && (
            <div className="mb-3 rounded-2xl bg-slate-50 px-3 py-3">
              <p className="text-slate-900 text-sm font-semibold truncate">{session.user.name}</p>
              <p className="text-slate-500 text-xs uppercase tracking-wider">{role}</p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button onClick={() => signOut({ callbackUrl: "/admin/login" })} className="flex-1 flex items-center justify-center gap-2 min-h-11 rounded-xl bg-slate-100 text-slate-600 hover:text-red-700 hover:bg-red-50 transition-colors text-sm font-semibold">
              <LogOut className="w-4 h-4" />
              {!collapsed && "Kijelentkezés"}
            </button>
            <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex w-11 h-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors">
              <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="min-h-20 bg-white/90 backdrop-blur border-b border-slate-200 flex items-center px-4 lg:px-8 sticky top-0 z-30 relative">
          {/* Top progress bar while navigating */}
          {pending && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden pointer-events-none">
              <div className="h-full w-1/3 bg-teal-500 animate-[adminProgress_1.1s_ease-in-out_infinite]" />
            </div>
          )}

          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden w-12 h-12 flex items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:text-slate-950 mr-3"
            aria-label="Admin menü megnyitása"
            aria-expanded={mobileOpen}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {activeItem?.icon && (
                <activeItem.icon className="w-5 h-5 text-teal-600 flex-shrink-0 hidden sm:block" />
              )}
              <h1 className="text-slate-950 font-bold text-lg md:text-2xl truncate">
                {activeItem?.label || "Admin"}
              </h1>
              {pending && (
                <span className="text-slate-500 text-sm inline-flex items-center gap-1.5 ml-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                  betöltés…
                </span>
              )}
            </div>
            {activeItem?.hint && (
              <p className="text-slate-500 text-sm mt-1 hidden sm:block truncate">{activeItem.hint}</p>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href="/"
              target="_blank"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-950 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Weboldal megtekintése</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

      <style jsx global>{`
        @keyframes adminProgress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(150%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardInner>{children}</DashboardInner>
}
