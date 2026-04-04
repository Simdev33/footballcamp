"use client"

import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

const CDN = "https://focis.b-cdn.net"

const BENFICA_LOGO = "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/SL_Benfica_logo.svg/1280px-SL_Benfica_logo.svg.png"
const ATLETICO_LOGO = "https://upload.wikimedia.org/wikinews/en/thumb/c/c1/Atletico_Madrid_logo.svg/960px-Atletico_Madrid_logo.svg.png"

const BENFICA_PLAYERS = [
  "João Félix", "Bernardo Silva", "Rúben Dias", "Gonçalo Ramos",
  "Ángel Di María", "Jan Oblak", "Ederson", "Renato Sanches",
]

const ATLETICO_PLAYERS = [
  "Fernando Torres", "Koke", "Antoine Griezmann", "Diego Godín",
  "Thibaut Courtois", "Sergio Agüero", "David de Gea", "Saúl Ñíguez",
]

const PLAYER_PHOTOS = [
  { src: `${CDN}/Photos/14-Pavlidis_2.png`, name: "Pavlidis", number: "14" },
  { src: `${CDN}/Photos/30-Otamendi_2.png`, name: "Otamendi", number: "30" },
  { src: `${CDN}/Photos/5-BARRENECHEA-3.png`, name: "Barrenechea", number: "5" },
  { src: `${CDN}/Photos/44-Tom%C3%A1s-Ara%C3%BAjo-2.png`, name: "Tomás Araújo", number: "44" },
  { src: `${CDN}/Photos/66-J.Wynder_2.png`, name: "Wynder", number: "66" },
  { src: `${CDN}/Photos/84-Joao-Rego.png`, name: "João Rego", number: "84" },
]

const BENFICA_STATS = [
  { value: "120+", label: "év történelem" },
  { value: "80+", label: "országban jelen" },
  { value: "50+", label: "profi akadémiai végzős" },
  { value: "#1", label: "portugál akadémia" },
]

const ATLETICO_STATS = [
  { value: "120+", label: "év történelem" },
  { value: "3x", label: "Európa Liga győztes" },
  { value: "11x", label: "spanyol bajnok" },
  { value: "Top 5", label: "La Liga akadémia" },
]

export default function KlubokPage() {
  const { t } = useLanguage()

  return (
    <main>
      {/* Hero */}
      <section className="relative pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[#0a1f0a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#d4a01714_0%,transparent_60%)]" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            {t.coaches.title}{" "}
            <span className="text-[#d4a017]">{t.coaches.titleHighlight}</span>{" "}
            {t.coaches.titleEnd}
          </h1>
          <p className="mt-6 text-lg text-white/60 max-w-2xl mx-auto">{t.coaches.subtitle}</p>

          <div className="mt-12 flex justify-center gap-8 md:gap-16">
            <div className="flex flex-col items-center gap-3">
              <Image src={BENFICA_LOGO} alt="SL Benfica" width={80} height={80} className="w-16 h-16 md:w-20 md:h-20 object-contain" />
              <span className="font-serif text-sm md:text-base font-bold text-white">SL Benfica</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Image src={ATLETICO_LOGO} alt="Atlético Madrid" width={80} height={80} className="w-16 h-16 md:w-20 md:h-20 object-contain" />
              <span className="font-serif text-sm md:text-base font-bold text-white">Atlético Madrid</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ BENFICA ═══════════════ */}

      {/* Benfica Header */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image src={`${CDN}/Post_1%20Camp/04%20Template%20Benfica%20Camp%202025_26_Banner.png`} alt="Kickoff" fill className="object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-[#0a1f0a]/80" />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <Image src={BENFICA_LOGO} alt="SL Benfica" width={64} height={64} className="w-16 h-16 object-contain" />
                <div>
                  <span className="block font-serif text-2xl font-bold text-white">SL Benfica</span>
                  <span className="block text-sm text-[#d4a017] tracking-widest uppercase">{t.coaches.cards[0].role}</span>
                </div>
              </div>
              <p className="text-white/70 leading-relaxed max-w-xl">
                A Benfica akadémia a világ egyik legelismertebb utánpótlás-műhelye. Az akadémia módszertana a technikai kiválóságra, a taktikai intelligenciára és a mentális erősségre épül.
              </p>
              <p className="mt-4 text-white/60 leading-relaxed max-w-xl">{t.coaches.cards[0].desc}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full lg:w-auto">
              {BENFICA_STATS.map((stat) => (
                <div key={stat.label} className="p-5 bg-black/30 backdrop-blur-sm border border-[#d4a017]/20 text-center min-w-[130px] hover:bg-[#d4a017]/10 transition-colors duration-300">
                  <span className="block font-serif text-2xl md:text-3xl font-bold text-[#d4a017]">{stat.value}</span>
                  <span className="block text-white/50 text-xs mt-1 uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benfica Players */}
      <section className="py-14 md:py-18 bg-[#0a1f0a]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-white">
              Benfica <span className="text-[#d4a017]">játékosok</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {PLAYER_PHOTOS.map((player) => (
              <div key={player.name} className="group relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-[#1a0a0a] to-[#0a1f0a]">
                <Image src={player.src} alt={player.name} fill sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw" className="object-cover object-top group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <span className="block text-[#d4a017] font-serif text-2xl font-bold leading-none">#{player.number}</span>
                  <span className="block text-white text-sm font-medium mt-1">{player.name}</span>
                </div>
                <div className="absolute inset-0 border-2 border-[#d4a017]/0 group-hover:border-[#d4a017]/50 transition-colors duration-300" />
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-white/40 text-sm mb-4">Akadémiai végzősök</p>
            <div className="flex flex-wrap justify-center gap-3">
              {BENFICA_PLAYERS.map((player, i) => (
                <span key={player} className={`px-5 py-2 font-serif text-sm font-bold border transition-colors duration-300 ${i % 3 === 0 ? "bg-[#d4a017] text-[#0a1f0a] border-[#d4a017]" : "bg-transparent text-white/70 border-[#d4a017]/20 hover:bg-[#d4a017]/10"}`}>
                  {player}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ ATLÉTICO MADRID ═══════════════ */}

      {/* Atletico Header */}
      <section className="relative py-16 md:py-20 overflow-hidden bg-background">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <Image src={ATLETICO_LOGO} alt="Atlético Madrid" width={64} height={64} className="w-16 h-16 object-contain" />
                <div>
                  <span className="block font-serif text-2xl font-bold text-foreground">Atlético Madrid</span>
                  <span className="block text-sm text-[#d4a017] tracking-widest uppercase">{t.coaches.cards[1].role}</span>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed max-w-xl">{t.coaches.cards[1].desc}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full lg:w-auto">
              {ATLETICO_STATS.map((stat) => (
                <div key={stat.label} className="p-5 bg-[#0a1f0a] border border-[#d4a017]/15 text-center min-w-[130px] hover:bg-[#d4a017]/10 transition-colors duration-300">
                  <span className="block font-serif text-2xl md:text-3xl font-bold text-[#d4a017]">{stat.value}</span>
                  <span className="block text-muted-foreground text-xs mt-1 uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Atletico Alumni */}
      <section className="py-14 bg-[#0a1f0a]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-white">
              Atlético <span className="text-[#d4a017]">akadémiai végzősök</span>
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {ATLETICO_PLAYERS.map((player, i) => (
              <span key={player} className={`px-5 py-2 font-serif text-sm font-bold border transition-colors duration-300 ${i % 3 === 0 ? "bg-[#d4a017] text-[#0a1f0a] border-[#d4a017]" : "bg-transparent text-white/70 border-[#d4a017]/20 hover:bg-[#d4a017]/10"}`}>
                {player}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
