"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
  LayoutDashboard, Newspaper, ImageIcon, Tent, ClipboardList,
  Users, LogOut, ChevronLeft, Menu, Shield, FileText, BookOpen,
} from "lucide-react"
import { useState } from "react"

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/tartalom", label: "Tartalom", icon: FileText },
  { href: "/admin/hirek", label: "Hírek", icon: Newspaper },
  { href: "/admin/blog", label: "Blog", icon: BookOpen },
  { href: "/admin/galeria", label: "Galéria", icon: ImageIcon },
  { href: "/admin/taborok", label: "Táborok", icon: Tent },
  { href: "/admin/jelentkezesek", label: "Jelentkezések", icon: ClipboardList },
  { href: "/admin/felhasznalok", label: "Felhasználók", icon: Users },
]

function DashboardInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

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

  return (
    <div className="min-h-screen bg-[#0b1e0b] flex">
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 h-screen z-50 bg-[#0a1f0a] border-r border-[#d4a017]/10 flex flex-col transition-[width,transform] duration-200 ${collapsed ? "w-20" : "w-64"} ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="h-16 flex items-center gap-3 px-4 border-b border-[#d4a017]/10">
          <div className="w-10 h-10 bg-[#d4a017] flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-[#0a1f0a]" />
          </div>
          {!collapsed && <span className="font-serif font-bold text-white text-sm">Admin Panel</span>}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {filteredNav.map((item) => {
            const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 mx-2 px-3 h-11 text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? "bg-[#d4a017]/15 text-[#d4a017] border-r-2 border-[#d4a017]"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
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
            <button onClick={() => signOut({ callbackUrl: "/admin/login" })} className="flex-1 flex items-center justify-center gap-2 h-9 bg-white/5 text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors text-xs">
              <LogOut className="w-4 h-4" />
              {!collapsed && "Kijelentkezés"}
            </button>
            <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex w-9 h-9 items-center justify-center bg-white/5 text-white/50 hover:text-white transition-colors">
              <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-[#0a1f0a]/80 backdrop-blur border-b border-[#d4a017]/10 flex items-center px-4 lg:px-8 sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center text-white/50 hover:text-white mr-3">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-white font-medium text-sm">
            {filteredNav.find((n) => n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href))?.label || "Admin"}
          </h1>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardInner>{children}</DashboardInner>
}
