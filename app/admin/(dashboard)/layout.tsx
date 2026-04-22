"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
  LayoutDashboard, ImageIcon, Tent, ClipboardList,
  Users, LogOut, ChevronLeft, Menu, Shield, FileText, BookOpen, Info,
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

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0b1e0b] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#d4a017] border-t-transparent rounded-full animate-spin" />
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
    <div className="min-h-screen bg-[#0b1e0b] flex">
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 h-screen z-50 bg-[#0a1f0a] border-r border-[#d4a017]/10 flex flex-col transition-[width,transform] duration-200 ${collapsed ? "w-20" : "w-64"} ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="h-16 flex items-center gap-3 px-4 border-b border-[#d4a017]/10">
          <div className="w-10 h-10 bg-[#d4a017] flex items-center justify-center flex-shrink-0 rounded">
            <Shield className="w-5 h-5 text-[#0a1f0a]" />
          </div>
          {!collapsed && <span className="font-serif font-bold text-white text-sm">Admin Panel</span>}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
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
                className={`flex items-center gap-3 mx-2 px-3 h-11 text-sm font-medium rounded transition-colors duration-100 ${
                  active
                    ? "bg-[#d4a017]/15 text-[#d4a017]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="flex-1 min-w-0" title={item.hint}>
                    <span className="block truncate">{item.label}</span>
                  </span>
                )}
                {active && <span className="w-1 h-6 bg-[#d4a017] rounded-full flex-shrink-0" />}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-[#d4a017]/10 p-3">
          {!collapsed && session?.user && (
            <div className="mb-3 px-2">
              <p className="text-white text-xs font-medium truncate">{session.user.name}</p>
              <p className="text-white/40 text-[10px] uppercase tracking-wider">{role}</p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button onClick={() => signOut({ callbackUrl: "/admin/login" })} className="flex-1 flex items-center justify-center gap-2 h-9 bg-white/5 text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors text-xs rounded">
              <LogOut className="w-4 h-4" />
              {!collapsed && "Kijelentkezés"}
            </button>
            <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex w-9 h-9 items-center justify-center bg-white/5 text-white/50 hover:text-white transition-colors rounded">
              <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-[#0a1f0a]/80 backdrop-blur border-b border-[#d4a017]/10 flex items-center px-4 lg:px-8 sticky top-0 z-30 relative">
          {/* Top progress bar while navigating */}
          {pending && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden pointer-events-none">
              <div className="h-full w-1/3 bg-[#d4a017] animate-[adminProgress_1.1s_ease-in-out_infinite]" />
            </div>
          )}

          <button onClick={() => setMobileOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center text-white/50 hover:text-white mr-3">
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {activeItem?.icon && (
                <activeItem.icon className="w-4 h-4 text-[#d4a017] flex-shrink-0 hidden sm:block" />
              )}
              <h1 className="text-white font-semibold text-sm md:text-base truncate">
                {activeItem?.label || "Admin"}
              </h1>
              {pending && (
                <span className="text-white/40 text-xs inline-flex items-center gap-1.5 ml-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4a017] animate-pulse" />
                  betöltés…
                </span>
              )}
            </div>
            {activeItem?.hint && (
              <p className="text-white/40 text-xs mt-0.5 hidden sm:block truncate">{activeItem.hint}</p>
            )}
          </div>

          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <Link
              href="/"
              target="_blank"
              className="text-white/50 hover:text-white text-xs font-medium px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded transition-colors"
            >
              Weboldal megtekintése →
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
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
