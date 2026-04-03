"use client"

import dynamic from "next/dynamic"
import { Hero } from "@/components/hero"

const BelowFold = dynamic(() => import("@/components/below-fold-home"), { ssr: false })

export default function Home() {
  return (
    <main>
      <Hero />
      <BelowFold />
    </main>
  )
}
