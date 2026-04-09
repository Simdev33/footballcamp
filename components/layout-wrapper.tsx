"use client"

import { usePathname } from "next/navigation"
import { LanguageProvider } from "@/lib/language-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface LayoutWrapperProps {
  children: React.ReactNode
  dbContent?: { hu: unknown; en: unknown } | null
}

export function LayoutWrapper({ children, dbContent }: LayoutWrapperProps) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <LanguageProvider dbContent={dbContent}>
      <div className="min-h-screen bg-background">
        <Header />
        {children}
        <Footer />
      </div>
    </LanguageProvider>
  )
}
