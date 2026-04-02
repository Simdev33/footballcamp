"use client"

import dynamic from "next/dynamic"
import { Hero } from "@/components/hero"
import { useLanguage } from "@/lib/language-context"

const USPSection = dynamic(
  () => import("@/components/usp-section").then((m) => ({ default: m.USPSection })),
  { ssr: false },
)

const BelowFold = dynamic(() => import("@/components/below-fold-home"), { ssr: false })

export default function Home() {
  const { t } = useLanguage()

  return (
    <main>
      <Hero />
      <USPSection />
      <BelowFold />
    </main>
  )
}
