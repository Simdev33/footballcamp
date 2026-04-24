"use client"

import { SubpageHero } from "@/components/subpage-hero"
import { ArrowRight, Download } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { PrivacyContentEN, PrivacyContentHU } from "./content"

type PrivacyStrings = {
  backLink: string
  pageTitle: string
  pageSubtitle: string
  downloadPdf: string
  continueToApply: string
}

export default function AdatkezelesiTajekoztatoPage() {
  const { t, locale } = useLanguage()
  const p = (t as unknown as { privacyPolicy: PrivacyStrings }).privacyPolicy

  return (
    <main>
      <SubpageHero title={p.pageTitle} subtitle={p.pageSubtitle} />

      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-3xl mx-auto px-6">
          <article className="bg-white border border-border/50 shadow-sm p-6 md:p-10 space-y-10 text-[15px] leading-relaxed text-foreground">
            {locale === "en" ? <PrivacyContentEN /> : <PrivacyContentHU />}

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <a
                href="/adatkezelesi-tajekoztato.pdf"
                download
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0a1f0a] text-[#d4a017] font-semibold hover:bg-[#d4a017] hover:text-[#0a1f0a] transition-colors"
              >
                <Download className="w-5 h-5" />
                {p.downloadPdf}
              </a>
              <Link
                href="/jelentkezes"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#d4a017] text-[#0a1f0a] font-semibold hover:shadow-[0_10px_30px_#d4a0174d] transition-all"
              >
                {p.continueToApply}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}
