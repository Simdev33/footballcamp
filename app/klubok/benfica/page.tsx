"use client"

import Image from "next/image"
import { useLanguage } from "@/lib/language-context"
import { useSiteImage } from "@/lib/site-images-context"

const CDN = "https://focis.b-cdn.net"
const BENFICA_LOGO = "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/SL_Benfica_logo.svg/1280px-SL_Benfica_logo.svg.png"

const BENFICA_PLAYERS = [
  "João Félix", "Bernardo Silva", "Rúben Dias", "Gonçalo Ramos",
  "Ángel Di María", "Jan Oblak", "Ederson", "Renato Sanches",
]

const PLAYER_PHOTOS = [
  { src: `${CDN}/Photos/14-Pavlidis_2.png`, name: "Pavlidis", number: "14" },
  { src: `${CDN}/Photos/30-Otamendi_2.png`, name: "Otamendi", number: "30" },
  { src: `${CDN}/Photos/5-BARRENECHEA-3.png`, name: "Barrenechea", number: "5" },
  { src: `${CDN}/Photos/44-Tom%C3%A1s-Ara%C3%BAjo-2.png`, name: "Tomás Araújo", number: "44" },
  { src: `${CDN}/Photos/66-J.Wynder_2.png`, name: "Wynder", number: "66" },
  { src: `${CDN}/Photos/84-Joao-Rego.png`, name: "João Rego", number: "84" },
]

type ClubsStrings = {
  heroTitle: string
  heroTitleHighlight: string
  heroTitleEnd: string
  heroSubtitle: string
  benficaDesc1: string
  stampedInLisbon: string
  madeInBenficaSubtitle: string
  benficaBadge: string
  graduatesTitle: string
  graduatesHighlight: string
  graduatesSubtitle: string
  stats: { value: string; label: string }[]
}

export default function BenficaClubPage() {
  const { t } = useLanguage()
  const c = (t as unknown as { clubsPage: ClubsStrings }).clubsPage
  const bannerImg = useSiteImage("klubok.banner")

  return (
    <main>
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[#0a1f0a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#d4a01714_0%,transparent_60%)]" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-12 lg:px-24 text-center">
          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-white">
            {c.heroTitle} <span className="text-[#d4a017]">{c.heroTitleHighlight}</span> {c.heroTitleEnd}
          </h1>
          <p className="mt-6 text-sm md:text-lg text-white/60 max-w-2xl mx-auto">{c.heroSubtitle}</p>
        </div>
      </section>

      <section className="relative py-14 md:py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image src={bannerImg} alt="Kickoff" fill className="object-cover" loading="lazy" unoptimized={bannerImg.includes("b-cdn.net")} />
          <div className="absolute inset-0 bg-[#0a1f0a]/80" />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-12 lg:px-24">
          <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-10">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-5">
                <Image src={BENFICA_LOGO} alt="SL Benfica" width={56} height={56} className="w-12 h-12 md:w-16 md:h-16 object-contain" />
                <div>
                  <span className="block font-serif text-xl md:text-2xl font-bold text-white">SL Benfica</span>
                  <span className="block text-xs md:text-sm text-[#d4a017] tracking-widest uppercase">{t.coaches.cards[0].role}</span>
                </div>
              </div>
              <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-xl">{c.benficaDesc1}</p>
              <p className="mt-3 text-sm md:text-base text-white/60 leading-relaxed max-w-xl">{t.coaches.cards[0].desc}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 md:gap-3 w-full lg:w-auto">
              {c.stats.map((stat) => (
                <div key={stat.label} className="p-4 md:p-5 bg-black/30 backdrop-blur-sm border border-[#d4a017]/20 text-center min-w-[110px] md:min-w-[130px] hover:bg-[#d4a017]/10 transition-colors duration-300">
                  <span className="block font-serif text-xl md:text-3xl font-bold text-[#d4a017]">{stat.value}</span>
                  <span className="block text-white/50 text-[10px] md:text-xs mt-1 uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-18 bg-[#0a1f0a]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-24">
          <div className="text-center mb-8 md:mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#d4a017]/10 border border-[#d4a017]/40 text-[#d4a017] text-[10px] md:text-xs font-bold tracking-[0.35em] uppercase">
              {c.stampedInLisbon}
            </span>
            <h2 className="mt-4 font-serif text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
              MADE IN <span className="bg-[#d4a017] text-[#0a1f0a] px-3 py-0.5 md:px-4 md:py-1 italic">BENFICA</span>
            </h2>
            <p className="mt-4 text-white/50 text-xs md:text-sm max-w-xl mx-auto">{c.madeInBenficaSubtitle}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {BENFICA_PLAYERS.map((player, i) => (
              <span key={player} className={`px-3 py-1.5 md:px-5 md:py-2 font-serif text-xs md:text-sm font-bold border transition-colors duration-300 ${i % 3 === 0 ? "bg-[#d4a017] text-[#0a1f0a] border-[#d4a017]" : "bg-transparent text-white/70 border-[#d4a017]/20 hover:bg-[#d4a017]/10"}`}>
                {player}
              </span>
            ))}
          </div>

          <div className="mt-14 md:mt-20 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {PLAYER_PHOTOS.map((player) => (
              <div key={player.name} className="group relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-[#1a0a0a] to-[#0a1f0a]">
                <Image src={player.src} alt={player.name} fill sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw" className="object-cover object-top group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-2 right-2 md:top-3 md:right-3 px-2 py-0.5 bg-[#d4a017] text-[#0a1f0a] text-[9px] md:text-[10px] font-black tracking-wider uppercase">
                  {c.benficaBadge}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2.5 md:p-3">
                  <span className="block text-[#d4a017] font-serif text-xl md:text-2xl font-bold leading-none">#{player.number}</span>
                  <span className="block text-white text-xs md:text-sm font-medium mt-1">{player.name}</span>
                </div>
                <div className="absolute inset-0 border-2 border-[#d4a017]/0 group-hover:border-[#d4a017]/50 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
