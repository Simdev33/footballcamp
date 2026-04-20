"use client"

import { SubpageHero } from "@/components/subpage-hero"
import { Download, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { getHealthDeclaration } from "@/lib/health-declaration"

export default function EgeszsegugyiNyilatkozatPage() {
  const { locale } = useLanguage()
  const hd = getHealthDeclaration(locale)

  return (
    <main>
      <SubpageHero title={hd.title} subtitle={hd.pageSubtitle} />

      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white border border-border/50 shadow-sm p-6 md:p-10">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 bg-[#d4a017]/10 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-[#d4a017]" />
              </div>
              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">{hd.title}</h2>
                <p className="text-sm text-muted-foreground mt-2">{hd.fileNoteParent}</p>
              </div>
            </div>

            <div className="space-y-5 text-[15px] leading-relaxed text-foreground">
              {hd.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}

              <p className="font-semibold pt-2">{hd.commitmentsIntro}</p>
              <ul className="list-disc pl-6 space-y-2">
                {hd.commitments.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>

              <p className="font-semibold pt-2">{hd.consent}</p>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <a
                href="/egeszsegugyi-nyilatkozat.docx"
                download
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0a1f0a] text-[#d4a017] font-semibold hover:bg-[#d4a017] hover:text-[#0a1f0a] transition-colors"
              >
                <Download className="w-5 h-5" />
                {hd.downloadLabel}
              </a>
              <Link
                href="/jelentkezes"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#d4a017] text-[#0a1f0a] font-semibold hover:shadow-[0_10px_30px_#d4a0174d] transition-all"
              >
                {hd.backToForm}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
