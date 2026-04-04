import Image from "next/image"
import Link from "next/link"
import { db } from "@/lib/db"
import { MapPin, Calendar, Users, ArrowRight, Tag, Shirt, Utensils, Dumbbell, Heart, Clock, Sun, Sunset, Moon } from "lucide-react"
import { SubpageHero } from "@/components/subpage-hero"

export const dynamic = "force-dynamic"

const SCHEDULE = [
  { time: "08:00", title: "Reggeli", desc: "Tápláló reggeli a szálláshelyen", icon: Sun, color: "bg-amber-500" },
  { time: "09:00", title: "Délelőtti edzés", desc: "Technikai alapok, labdaérzék fejlesztés", icon: Dumbbell, color: "bg-emerald-600" },
  { time: "11:00", title: "Taktikai tréning", desc: "Pozíciós játék, csapatmunka", icon: Dumbbell, color: "bg-emerald-700" },
  { time: "12:30", title: "Ebéd & pihenő", desc: "Kiegyensúlyozott ebéd és szabad idő", icon: Utensils, color: "bg-orange-500" },
  { time: "14:00", title: "Délutáni foglalkozás", desc: "Speciális készségfejlesztés", icon: Sunset, color: "bg-blue-600" },
  { time: "16:00", title: "Mérkőzések", desc: "Kis pályás meccsek, versenyhelyzetek", icon: Heart, color: "bg-red-500" },
  { time: "18:00", title: "Vacsora & program", desc: "Közös program, csapatépítés", icon: Moon, color: "bg-indigo-600" },
]

const KID_ICONS = [Shirt, Utensils, Dumbbell, Heart]
const KID_ITEMS = [
  { title: "Hivatalos felszerelés", desc: "1 garnitúra a klub hivatalos felszereléséből (sportszár, nadrág, mez)" },
  { title: "Napi étkezés", desc: "Napi háromszori étkezés (tízórai, ebéd, uzsonna)" },
  { title: "Változatos edzések", desc: "Napi 4 edzés változatos és játékos feladatokkal" },
  { title: "Életre szóló élmény", desc: "Kiemelkedő hangulat, biztonságos környezet, felejthetetlen élmény" },
]

const CDN = "https://focis.b-cdn.net"

export default async function TaborokPage() {
  const camps = await db.camp.findMany({
    where: { active: true },
    orderBy: { createdAt: "asc" },
  })

  return (
    <main>
      {/* Hero */}
      <section className="relative pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={`${CDN}/Post_1%20Camp/04%20Template%20Benfica%20Camp%202025_26_Banner.png`}
            alt="Kickoff"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[#0a1f0a]/80" />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white">Táborok</h1>
          <p className="mt-4 text-lg text-white/60 max-w-xl mx-auto">Részletek, időpont, ár</p>
          <div className="w-20 h-1 bg-[#d4a017] mx-auto mt-8" />
        </div>
      </section>

      {/* What Kids Get */}
      <section className="py-20 md:py-28 bg-[#0a1f0a]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-14">
            <span className="inline-block px-6 py-2 bg-[#d4a017] text-[#0a1f0a] text-sm tracking-[0.3em] uppercase font-medium">
              Mit kap a gyerek
            </span>
            <h2 className="mt-5 font-serif text-3xl md:text-4xl font-bold text-white">
              Minden <span className="text-[#d4a017]">benne</span> van
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {KID_ITEMS.map((item, index) => {
              const Icon = KID_ICONS[index]
              return (
                <div key={item.title} className="group relative p-8 bg-[#0f2b0f] border border-[#d4a017]/10 hover:border-[#d4a017]/50 transition-colors duration-300 text-center">
                  <div className="w-16 h-16 mx-auto mb-5 bg-[#d4a017]/15 flex items-center justify-center group-hover:bg-[#d4a017] transition-colors duration-300">
                    <Icon className="w-8 h-8 text-[#d4a017] group-hover:text-[#0a1f0a] transition-colors" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white mb-2 group-hover:text-[#d4a017] transition-colors">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Daily Schedule */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-[900px] mx-auto px-6 md:px-12">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              Egy napod <span className="text-[#d4a017]">nálunk</span>
            </h2>
            <div className="w-20 h-1 bg-[#d4a017] mx-auto mt-5" />
          </div>
          <div className="relative">
            <div className="absolute left-[27px] md:left-[31px] top-0 bottom-0 w-px bg-gradient-to-b from-[#d4a017] via-[#d4a017]/40 to-transparent" />
            <div className="space-y-6">
              {SCHEDULE.map((item) => (
                <div key={item.time} className="relative flex gap-5 md:gap-8 group">
                  <div className={`relative z-10 w-14 md:w-16 h-14 md:h-16 shrink-0 ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 pb-6 border-b border-border/30 group-last:border-b-0">
                    <span className="text-xs text-[#d4a017] font-bold tracking-wider">{item.time}</span>
                    <h3 className="font-serif text-lg font-bold text-foreground mt-1 group-hover:text-[#d4a017] transition-colors">{item.title}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Camp Cards from DB */}
      <section className="py-20 md:py-28 bg-[#0a1f0a]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-14">
            <span className="inline-block px-6 py-2 bg-[#0a1f0a] border border-[#d4a017]/30 text-[#d4a017] text-sm tracking-[0.3em] uppercase font-medium">
              Helyszínek és árak
            </span>
            <h2 className="mt-5 font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Válaszd ki a <span className="text-[#d4a017]">helyszínt</span>
            </h2>
          </div>

          {camps.length === 0 ? (
            <p className="text-center text-white/40 py-12">Hamarosan frissítjük a tábor kínálatunkat!</p>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
              {camps.map((camp) => (
                <Link key={camp.id} href={`/taborok/${camp.slug}`} className="group block">
                  <div className="relative overflow-hidden bg-[#0f2b0f] border border-[#d4a017]/10 transition-[transform,box-shadow] duration-500 will-change-transform hover:-translate-y-2 hover:shadow-[0_40px_100px_#d4a01733]">
                    <div className="relative aspect-[16/8] overflow-hidden">
                      {camp.imageUrl ? (
                        <Image
                          src={camp.imageUrl}
                          alt={camp.city}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-110"
                          unoptimized={camp.imageUrl.includes("b-cdn.net")}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#d4a017]/20 to-[#0a1f0a] flex items-center justify-center">
                          <MapPin className="w-16 h-16 text-[#d4a017]/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                      <div className="absolute bottom-4 left-6">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-[#d4a017]" />
                          <span className="font-serif text-2xl md:text-3xl font-bold text-white drop-shadow-lg">{camp.city}</span>
                        </div>
                        <p className="mt-1 text-white/70 ml-8 text-xs">{camp.venue}</p>
                      </div>

                      <div className="absolute top-4 right-4 px-3 py-2 bg-[#d4a017] text-[#0a1f0a] font-bold text-xs">
                        <Tag className="inline-block w-4 h-4 mr-1" />
                        {camp.clubName}
                      </div>
                    </div>

                    <div className="p-5 lg:p-6">
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 text-white/50 mb-2">
                            <Calendar className="w-4 h-4 text-[#d4a017]" />
                            <span className="text-xs uppercase tracking-wider font-medium">Időpont</span>
                          </div>
                          <p className="font-semibold text-white text-sm">{camp.dates}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-white/50 mb-2">
                            <Users className="w-4 h-4 text-[#d4a017]" />
                            <span className="text-xs uppercase tracking-wider font-medium">Férőhely</span>
                          </div>
                          <p className="font-semibold text-white text-sm">{camp.remainingSpots}/{camp.totalSpots} fő</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-white/50 mb-2">
                            <Clock className="w-4 h-4 text-[#d4a017]" />
                            <span className="text-xs uppercase tracking-wider font-medium">Korosztály</span>
                          </div>
                          <p className="font-semibold text-white text-sm">{camp.ageRange} év</p>
                        </div>
                      </div>

                      <div className="flex items-end justify-between border-t border-white/10 pt-4">
                        <div>
                          <p className="text-xs text-[#d4a017] uppercase tracking-wider mb-1 font-medium">Early bird ár</p>
                          <div className="flex items-baseline gap-3">
                            <span className="font-serif text-2xl md:text-3xl font-bold text-white">{camp.earlyBirdPrice}</span>
                            <span className="text-sm text-white/40 line-through">{camp.price}</span>
                          </div>
                        </div>
                        <span className="flex items-center gap-2 text-[#d4a017] text-sm font-semibold group-hover:underline">
                          Részletek <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>

                    <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-[#d4a017]/20" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-[#d4a017]/20" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
