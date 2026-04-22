import { db } from "./db"

export type RolunkContent = {
  badge: string
  heroTitle: string
  heroText: string
  missionTitle: string
  missionText: string
  quote: string
  quoteAuthor: string
  uspTitle: string
  uspText: string
}

export const ROLUNK_DEFAULTS: RolunkContent = {
  badge: "Rólunk",
  heroTitle: "Adj gyermekednek egy olyan futballélményt, amire sokáig emlékezni fog!",
  heroText:
    "Táborainkban a gyerekek nemzetközi szintű képzésben vesznek részt, európai akadémiák edzőinek irányításával. Az angol és magyar nyelvű edzések során már fiatal korban megtapasztalhatják a profi futball szemléletét.",
  missionTitle: "Céljaink",
  missionText:
    "Azért csináljuk, amit csinálunk, mert hiszünk benne, hogy a magyar gyerekek is megérdemlik a legjobb európai futballképzést. Célunk, hogy minél több külföldi edzőt és akadémiát hozzunk el Magyarországra, és megismertessük a gyerekekkel a nemzetközi futball világát.",
  quote:
    "Táborainkban a gyerekek nemcsak technikai tudást szereznek, hanem megtanulnak együtt gondolkodni, együtt dolgozni és magabiztosabban mozogni a pályán és azon kívül is. A közösség ereje és a közös élmények olyan önbizalmat adnak, ami a tábor után is velük marad.",
  quoteAuthor: "Ez az a közeg, ahol a futball élménnyé válik, az élmény pedig maradandó értékké.",
  uspTitle: "A mi kezdőcsapatunk",
  uspText: "amiért minket választanak",
}

export async function getRolunkContent(): Promise<RolunkContent> {
  try {
    const row = await db.siteContent.findUnique({
      where: { section_locale: { section: "rolunk", locale: "hu" } },
    })
    if (!row) return ROLUNK_DEFAULTS
    const override = (row.content as Partial<RolunkContent>) || {}
    return { ...ROLUNK_DEFAULTS, ...override }
  } catch {
    return ROLUNK_DEFAULTS
  }
}
