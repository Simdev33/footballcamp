import { db } from "@/lib/db"

export type NewsletterSlot = "morning" | "noon" | "evening"

export const NEWSLETTER_SLOTS: Array<{
  slot: NewsletterSlot
  label: string
  hour: number
  subject: string
  previewText: string
  body: string
}> = [
  {
    slot: "morning",
    label: "Reggeli",
    hour: 8,
    subject: "Reggeli focis inspiráció a KickOff Campstől",
    previewText: "Indítsuk a napot egy kis futballhangulattal.",
    body:
      "Jó reggelt!\n\nMa is egy új lehetőség, hogy közelebb kerüljünk a pályán kitűzött célokhoz. A KickOff Camps táborokban azon dolgozunk, hogy a gyerekek magabiztosabbak, bátrabbak és technikásabbak legyenek.\n\nNézd meg az aktuális táborainkat, és ha kérdésed van, írj nekünk bátran.",
  },
  {
    slot: "noon",
    label: "Déli",
    hour: 12,
    subject: "Déli táborinfó: fejlődés, élmény, futball",
    previewText: "Rövid emlékeztető az aktuális KickOff Camps lehetőségekről.",
    body:
      "Szia!\n\nDélben hozunk egy rövid emlékeztetőt: a táborokban a technikai fejlődés mellett az önbizalom, a csapatjáték és az élmény is fontos szerepet kap.\n\nHa szeretnéd, hogy gyermeked nemzetközi szemléletű közegben fejlődjön, nézz körül az aktuális időpontok között.",
  },
  {
    slot: "evening",
    label: "Esti",
    hour: 19,
    subject: "Esti emlékeztető: jöhet a következő focis élmény?",
    previewText: "Nézd meg, melyik tábor illik hozzátok legjobban.",
    body:
      "Szép estét!\n\nA nap végén is érdemes egy pillantást vetni az elérhető táborokra. A helyek korlátozottak, ezért ha már kinéztetek egy turnust, érdemes időben jelentkezni.\n\nVárunk szeretettel a pályán!",
  },
]

export function isNewsletterSlot(slot: string | null): slot is NewsletterSlot {
  return NEWSLETTER_SLOTS.some((item) => item.slot === slot)
}

export function getBudapestDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Budapest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date)
  const value = (type: string) => parts.find((part) => part.type === type)?.value || ""
  return `${value("year")}-${value("month")}-${value("day")}`
}

export function getBudapestNewsletterSlot(date = new Date()): NewsletterSlot | null {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Budapest",
      hour: "2-digit",
      hour12: false,
    }).format(date),
  )

  return NEWSLETTER_SLOTS.find((slot) => slot.hour === hour)?.slot || null
}

export async function ensureNewsletterTemplates() {
  await Promise.all(
    NEWSLETTER_SLOTS.map((template) =>
      db.newsletterTemplate.upsert({
        where: { slot: template.slot },
        create: {
          slot: template.slot,
          label: template.label,
          subject: template.subject,
          previewText: template.previewText,
          body: template.body,
          enabled: true,
        },
        update: {},
      }),
    ),
  )
}
