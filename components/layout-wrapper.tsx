"use client"

import { usePathname } from "next/navigation"
import { LanguageProvider } from "@/lib/language-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <Header />
        {children}
        <Footer />
      </div>
    </LanguageProvider>
  )
}
