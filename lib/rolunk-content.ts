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
    "Azért csináljuk, amit csinálunk, mert hiszünk benne, hogy a magyar gyerekek is megérdemlik a magas színvonalú európai futballképzést. Célunk, hogy minél több külföldi edzőt és akadémiai szemléletet hozzunk el Magyarországra, és megismertessük a gyerekekkel a nemzetközi futball világát.",
  quote:
    "Táborainkban a gyerekek nemcsak technikai tudást szereznek, hanem megtanulnak együtt gondolkodni, együtt dolgozni és magabiztosabban mozogni a pályán és azon kívül is. A közösség ereje és a közös élmények olyan önbizalmat adnak, ami a tábor után is velük marad.",
  quoteAuthor: "Ez az a közeg, ahol a futball élménnyé válik, az élmény pedig maradandó értékké.",
  uspTitle: "A mi kezdőcsapatunk",
  uspText: "amiért minket választanak",
}

export const ROLUNK_DEFAULTS_EN: RolunkContent = {
  badge: "About",
  heroTitle: "Give your child a football experience they will remember for a long time.",
  heroText:
    "At our camps, children receive international-level training under the guidance of coaches from European academies. Through English and Hungarian sessions, they can experience the mindset of professional football from a young age.",
  missionTitle: "Our goals",
  missionText:
    "We do this because we believe Hungarian children deserve access to high-quality European football training. Our aim is to bring more international coaches and academies to Hungary and introduce children to the world of international football.",
  quote:
    "At our camps, children gain more than technical skills: they learn to think together, work together and move with more confidence on and off the pitch. The strength of the community and the shared experiences stay with them after camp.",
  quoteAuthor: "This is where football becomes an experience, and that experience becomes lasting value.",
  uspTitle: "Our starting eleven",
  uspText: "why families choose us",
}

export async function getRolunkContent(locale: "hu" | "en" = "hu"): Promise<RolunkContent> {
  const defaults = locale === "en" ? ROLUNK_DEFAULTS_EN : ROLUNK_DEFAULTS
  try {
    const row = await db.siteContent.findUnique({
      where: { section_locale: { section: "rolunk", locale } },
    })
    if (!row) return defaults
    const override = (row.content as Partial<RolunkContent>) || {}
    return { ...defaults, ...override }
  } catch {
    return defaults
  }
}
