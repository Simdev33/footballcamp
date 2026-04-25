import { db } from "@/lib/db"

export type ScheduleItem = { time: string; activity: string }
export type CoachItem = { name: string; role: string; image: string; bio: string }
export type FaqItem = { question: string; answer: string }

export type CampTranslation = {
  city?: string
  venue?: string
  dates?: string
  description?: string
  includes?: string[]
  schedule?: ScheduleItem[]
  coaches?: CoachItem[]
  faq?: FaqItem[]
}

export const campTranslationSection = (campId: string) => `camp:${campId}`

export async function getCampTranslation(campId: string, locale: "en"): Promise<CampTranslation> {
  try {
    const row = await db.siteContent.findUnique({
      where: { section_locale: { section: campTranslationSection(campId), locale } },
    })
    return (row?.content as CampTranslation | null) || {}
  } catch {
    return {}
  }
}

export async function saveCampTranslation(campId: string, locale: "en", content: CampTranslation) {
  await db.siteContent.upsert({
    where: { section_locale: { section: campTranslationSection(campId), locale } },
    create: { section: campTranslationSection(campId), locale, content },
    update: { content },
  })
}

export function parseCampTranslation(formData: FormData): CampTranslation {
  return {
    city: stringValue(formData, "cityEn"),
    venue: stringValue(formData, "venueEn"),
    dates: stringValue(formData, "datesEn"),
    description: stringValue(formData, "descriptionEn"),
    includes: parseStringArray(formData, "includesEn"),
    schedule: parseJsonArray<ScheduleItem>(formData, "scheduleEn"),
    coaches: parseJsonArray<CoachItem>(formData, "coachesEn"),
    faq: parseJsonArray<FaqItem>(formData, "faqEn"),
  }
}

function stringValue(formData: FormData, key: string) {
  return ((formData.get(key) as string | null) || "").trim()
}

function parseStringArray(formData: FormData, key: string): string[] {
  const raw = stringValue(formData, key)
  if (!raw) return []
  return raw
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseJsonArray<T>(formData: FormData, key: string): T[] {
  const raw = stringValue(formData, key)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as T[]) : []
  } catch {
    return []
  }
}
