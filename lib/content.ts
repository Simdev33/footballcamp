import { db } from "./db"
import { translations } from "./i18n"

type SiteContentRow = {
  section: string
  locale: string
  content: unknown
}

export function deepMerge<T extends Record<string, unknown>>(
  base: T,
  override: Record<string, unknown>,
): T {
  const result = { ...base } as Record<string, unknown>
  for (const key of Object.keys(override)) {
    const baseVal = base[key]
    const overVal = override[key]
    if (
      overVal !== null &&
      overVal !== undefined &&
      typeof overVal === "object" &&
      !Array.isArray(overVal) &&
      baseVal !== undefined &&
      typeof baseVal === "object" &&
      !Array.isArray(baseVal)
    ) {
      result[key] = deepMerge(
        baseVal as Record<string, unknown>,
        overVal as Record<string, unknown>,
      )
    } else if (overVal !== undefined) {
      result[key] = overVal
    }
  }
  return result as T
}

function buildSiteContent(rows: SiteContentRow[]) {
  const overrides: Record<string, Record<string, unknown>> = {}

  for (const row of rows) {
    if (!overrides[row.locale]) overrides[row.locale] = {}
    overrides[row.locale][row.section] = row.content as Record<string, unknown>
  }

  return {
    hu: deepMerge(
      translations.hu as unknown as Record<string, unknown>,
      overrides.hu || {},
    ),
    en: deepMerge(
      translations.en as unknown as Record<string, unknown>,
      overrides.en || {},
    ),
  }
}

async function getSiteContentRows() {
  return db.siteContent.findMany({
    select: { section: true, locale: true, content: true },
  })
}

export async function getSiteContent() {
  try {
    return buildSiteContent(await getSiteContentRows())
  } catch {
    return null
  }
}

export async function getDbSections(): Promise<string[]> {
  try {
    const rows = await db.siteContent.findMany({
      select: { section: true, locale: true },
    })
    return rows.map((r) => `${r.section}:${r.locale}`)
  } catch {
    return []
  }
}

export async function getSiteContentWithDbSections() {
  try {
    const rows = await getSiteContentRows()
    return {
      content: buildSiteContent(rows),
      dbSections: rows.map((r) => `${r.section}:${r.locale}`),
    }
  } catch {
    return {
      content: null,
      dbSections: [],
    }
  }
}
