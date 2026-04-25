import { db } from "./db"

/**
 * Centralized "named" image keys used across the public website.
 * The admin "Képek" page lets the owner override each of these with a
 * custom URL (usually uploaded to Bunny via the ImagePicker).
 *
 * Defaults are the existing hardcoded URLs – so if nothing is set in
 * SiteContent, the site looks identical to before.
 */
export const CDN = "https://focis.b-cdn.net"

export type SiteImageKey =
  | "hero.background"
  | "rolunk.hero"
  | "rolunk.mission"
  | "whySpecial.image"
  | "whatKidsGet.image"
  | "experience.image"
  | "partnerProgram.hero"
  | "taborok.hero"
  | "klubok.banner"
  | "jelentkezes.side"

export const SITE_IMAGE_DEFAULTS: Record<SiteImageKey, string> = {
  "hero.background": `${CDN}/Post_1%20Camp/04%20Template%20Benfica%20Camp%202025_26_Banner.png`,
  "rolunk.hero": `${CDN}/site/gyerekek-edzovel.jpg`,
  "rolunk.mission": `${CDN}/Post_1%20Camp/01%20Template%20Benfica%20Camp%202025_26_FEED.png`,
  "whySpecial.image": `${CDN}/site/gyerekek-edzovel.jpg`,
  "whatKidsGet.image": `${CDN}/site/edzes-kozben.jpg`,
  "experience.image": `${CDN}/site/gyerekcsapat.jpg`,
  "partnerProgram.hero": `${CDN}/site/gyerekcsapat.jpg`,
  "taborok.hero": `${CDN}/site/edzes-kozben.jpg`,
  "klubok.banner": `${CDN}/Post_1%20Camp/04%20Template%20Benfica%20Camp%202025_26_Banner.png`,
  "jelentkezes.side": `${CDN}/site/edzes-kozben.jpg`,
}

export type SiteImageGroupId = "home" | "rolunk" | "taborok" | "klubok" | "partnerprogram" | "jelentkezes"

export const SITE_IMAGE_GROUPS: Record<SiteImageGroupId, { title: string; description: string; previewPath: string }> = {
  home: { title: "Főoldal", description: "A főoldalon megjelenő képek.", previewPath: "/" },
  rolunk: { title: "Rólunk aloldal", description: "A „Rólunk” aloldal képei.", previewPath: "/rolunk" },
  taborok: { title: "Táborok aloldal", description: "A „Táborok” aloldal képei.", previewPath: "/taborok" },
  klubok: { title: "Klubok aloldal", description: "A „Klubok” aloldal képei.", previewPath: "/klubok" },
  partnerprogram: { title: "Partnerprogram aloldal", description: "A „Partnerprogram” aloldal képei.", previewPath: "/partnerprogram" },
  jelentkezes: { title: "Jelentkezés oldal", description: "A jelentkezési űrlapon megjelenő kép.", previewPath: "/jelentkezes" },
}

export const SITE_IMAGE_LABELS: Record<SiteImageKey, { title: string; where: string; group: SiteImageGroupId }> = {
  "hero.background": {
    group: "home",
    title: "Nagy háttérkép (a videó mögött)",
    where: "A főoldal tetején, a hero szekcióban – ha a videó nem töltődik be, ez látszik alatta.",
  },
  "whySpecial.image": {
    group: "home",
    title: "„Gyerekek edzővel” kép",
    where: "A főoldalon a „Miért különleges a táborunk” szekcióban, a szöveg mellett balra.",
  },
  "whatKidsGet.image": {
    group: "home",
    title: "„Edzés közben” kép",
    where: "A főoldalon a „Mit kap a gyerek a táborban” szekcióban, a szöveg mellett.",
  },
  "experience.image": {
    group: "home",
    title: "„Gyerekcsapat” kép",
    where: "A főoldalon a „Több mint edzés” szekcióban, az idézet mellett.",
  },
  "rolunk.hero": {
    group: "rolunk",
    title: "Fejléc háttérkép",
    where: "A Rólunk oldal tetején, a nagy főcím mögött.",
  },
  "rolunk.mission": {
    group: "rolunk",
    title: "Misszió szekció képe",
    where: "A Rólunk oldal közepén, az USP / „Mi kezdőcsapatunk” szekcióban.",
  },
  "taborok.hero": {
    group: "taborok",
    title: "Fejléc háttérkép",
    where: "A Táborok oldal tetején, a „Táborok” főcím mögött.",
  },
  "klubok.banner": {
    group: "klubok",
    title: "Benfica banner kép",
    where: "A Klubok oldal Benfica szekciójának háttérképe.",
  },
  "partnerProgram.hero": {
    group: "partnerprogram",
    title: "Alsó CTA kép",
    where: "A Partnerprogram oldal alján, a záró „Keress minket” szekció jobb oldalán.",
  },
  "jelentkezes.side": {
    group: "jelentkezes",
    title: "Illusztráció / oldalsó kép",
    where: "A főoldalon a jelentkezési CTA szekcióban, a szöveg mellett.",
  },
}

export type SiteImageOverrides = Partial<Record<SiteImageKey, string>>

/**
 * Reads overrides from SiteContent(section="images", locale="hu").
 * Falls back to an empty object on any error (e.g. table doesn't exist yet).
 */
export async function getSiteImages(): Promise<SiteImageOverrides> {
  try {
    const row = await db.siteContent.findUnique({
      where: { section_locale: { section: "images", locale: "hu" } },
    })
    if (!row) return {}
    const content = row.content as unknown as SiteImageOverrides
    return content || {}
  } catch {
    return {}
  }
}

/** Resolves a named image key, returning the override or the default. */
export function resolveSiteImage(
  key: SiteImageKey,
  overrides: SiteImageOverrides = {},
): string {
  const v = overrides[key]
  if (typeof v === "string" && v.length > 0) return v
  return SITE_IMAGE_DEFAULTS[key]
}
