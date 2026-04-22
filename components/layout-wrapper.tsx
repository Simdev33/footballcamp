"use client"

import { usePathname } from "next/navigation"
import { LanguageProvider } from "@/lib/language-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieBanner } from "@/components/cookie-banner"
import { SiteImagesProvider } from "@/lib/site-images-context"
import type { SiteImageOverrides } from "@/lib/site-images"

interface LayoutWrapperProps {
  children: React.ReactNode
  dbContent?: { hu: unknown; en: unknown } | null
  siteImages?: SiteImageOverrides
}

export function LayoutWrapper({ children, dbContent, siteImages = {} }: LayoutWrapperProps) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <LanguageProvider dbContent={dbContent}>
      <SiteImagesProvider value={siteImages}>
        <div className="min-h-screen bg-background">
          <Header />
          {children}
          <Footer />
        </div>
        <CookieBanner />
      </SiteImagesProvider>
    </LanguageProvider>
  )
}
