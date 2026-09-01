import type { Locale } from "@/lib/i18n"

export const GALLERY_CDN = "https://focis.b-cdn.net"

/** Egy videó egy albumon belül. */
export type AlbumVideo = {
  /**
   * "file"   – közvetlen MP4 link a Bunny Storage-ből (pl. .../gallery/xy/video.mp4)
   * "embed"  – beágyazó iframe URL (Bunny Stream vagy YouTube "embed" link)
   */
  kind: "file" | "embed"
  url: string
  /** Borítókép a lejátszás előtt (csak "file" esetén használt). */
  poster?: string
  /** Képarány: "16/9" fekvő (alapértelmezés), "9/16" álló (Insta/TikTok) videóhoz. */
  aspect?: "16/9" | "9/16" | "4/3" | "1/1"
  title: { hu: string; en: string }
}

export type GalleryAlbum = {
  /** Ez az érték kerül a GalleryImage.category mezőbe, és ez az URL is: /galeria/<slug> */
  slug: string
  title: { hu: string; en: string }
  subtitle: { hu: string; en: string }
  /** Rövid leíró szöveg az album oldalán. */
  description: { hu: string; en: string }
  location: string
  dateLabel: { hu: string; en: string }
  /** Rendezéshez – a nagyobb szám előrébb kerül a Galéria oldalon. */
  sortOrder: number
  /** Borítókép. Ha üres, az album első képe lesz a borító. */
  coverUrl?: string
  videos?: AlbumVideo[]
  /** Ha igaz, ez az album kap egy „Így telt a tábor” szekciót a főoldalon. */
  showOnHome?: boolean
  /** 5-6 kiemelt kép URL-je a főoldali szekcióhoz. */
  highlights?: string[]
  /**
   * A Bunny Storage mappa, ahol az album fájljai vannak. Alapértelmezés:
   * `gallery/<slug>`. Ha több album osztozik egy mappán, a `filePrefix`
   * választja szét őket.
   */
  storageFolder?: string
  /** Csak az ezzel a fájlnév-előtaggal kezdődő fájlok tartoznak az albumhoz. */
  filePrefix?: string
}

const BENFICA_ALGYO_2026 = "gallery"

/** Bunny Stream könyvtár beágyazási alap-URL-je (a szám a library ID). */
const BUNNY_STREAM = "https://player.mediadelivery.net/embed/630114"

export const GALLERY_ALBUMS: GalleryAlbum[] = [
  {
    slug: "benfica-algyo-2026",
    title: {
      hu: "Benfica tábor – Algyő 2026",
      en: "Benfica Camp – Algyő 2026",
    },
    subtitle: {
      hu: "Egy hét az SL Benfica edzőivel",
      en: "A week with SL Benfica coaches",
    },
    description: {
      hu: "Így telt a 2026-os algyői Benfica táborunk: igazi akadémiai edzésmódszerek, portugál edzők, új barátságok és rengeteg mosoly. Görgess lejjebb a képekért és a tábor videójáért!",
      en: "This is how our 2026 Benfica camp in Algyő went: real academy training methods, Portuguese coaches, new friendships and a lot of smiles. Scroll down for the photos and the camp video!",
    },
    location: "Algyő",
    dateLabel: { hu: "2026. július", en: "July 2026" },
    sortOrder: 100,
    // A fájlok a Bunny `gallery/` mappájában vannak, `benfica-algyo-2026-` előtaggal.
    storageFolder: "gallery",
    filePrefix: "benfica-algyo-2026-",
    coverUrl: `${GALLERY_CDN}/${BENFICA_ALGYO_2026}/benfica-algyo-2026-01.jpg`,
    showOnHome: true,
    highlights: [
      `${GALLERY_CDN}/${BENFICA_ALGYO_2026}/benfica-algyo-2026-03.jpg`,
      `${GALLERY_CDN}/${BENFICA_ALGYO_2026}/benfica-algyo-2026-08.jpg`,
      `${GALLERY_CDN}/${BENFICA_ALGYO_2026}/benfica-algyo-2026-14.jpg`,
      `${GALLERY_CDN}/${BENFICA_ALGYO_2026}/benfica-algyo-2026-21.jpg`,
      `${GALLERY_CDN}/${BENFICA_ALGYO_2026}/benfica-algyo-2026-34.jpg`,
      `${GALLERY_CDN}/${BENFICA_ALGYO_2026}/benfica-algyo-2026-38.jpg`,
    ],
    // ─── VIDEÓK ───
    // A Bunny Stream „Embed” linkjét kell ide bemásolni. A Stream felületén a
    // videónál: Share / Embed → a src="..." értéke, ilyen formában:
    //   https://iframe.mediadelivery.net/embed/<library-id>/<video-id>
    //
    // Fekvő videóhoz aspect: "16/9" (ez az alapértelmezés),
    // álló (Insta/TikTok) videóhoz aspect: "9/16".
    videos: [
      {
        kind: "embed",
        url: `${BUNNY_STREAM}/f7017242-1074-4e0e-99f9-4976fb335953?autoplay=false&loop=false&muted=false&preload=false&responsive=true`,
        aspect: "16/9",
        title: { hu: "Tábor összefoglaló", en: "Camp highlights" },
      },
      {
        kind: "embed",
        url: `${BUNNY_STREAM}/d5910193-79eb-4780-90c8-62f410d82018?autoplay=false&loop=false&muted=false&preload=false&responsive=true`,
        aspect: "9/16",
        title: { hu: "Pillanatok a táborból", en: "Camp moments" },
      },
    ],
  },
]

/** Minden olyan kép ide kerül, aminek a kategóriája nem egy album slug-ja (régi feltöltések). */
export const FALLBACK_ALBUM: GalleryAlbum = {
  slug: "pillanatkepek",
  title: { hu: "Pillanatképek", en: "Snapshots" },
  subtitle: { hu: "Képek a táborainkból", en: "Photos from our camps" },
  description: {
    hu: "Vegyes válogatás a KICK OFF Camps pillanataiból.",
    en: "A mixed selection of moments from KICK OFF Camps.",
  },
  location: "",
  dateLabel: { hu: "", en: "" },
  sortOrder: 0,
}

/** Az album Bunny Storage mappája (záró perjel nélkül). */
export function albumStorageFolder(album: GalleryAlbum): string {
  return (album.storageFolder ?? `gallery/${album.slug}`).replace(/^\/+|\/+$/g, "")
}

/** Egy Bunny fájlnév ehhez az albumhoz tartozik-e (közös mappa esetén az előtag dönt). */
export function fileBelongsToAlbum(album: GalleryAlbum, fileName: string): boolean {
  if (!album.filePrefix) return true
  return fileName.startsWith(album.filePrefix)
}

/** A főoldali „Így telt a tábor” szekcióhoz tartozó album (a legfrissebb, amit megjelölünk). */
export function getHomeAlbum(): GalleryAlbum | undefined {
  return [...GALLERY_ALBUMS]
    .filter((a) => a.showOnHome && (a.highlights?.length ?? 0) > 0)
    .sort((a, b) => b.sortOrder - a.sortOrder)[0]
}

export function getAlbumBySlug(slug: string): GalleryAlbum | undefined {
  if (slug === FALLBACK_ALBUM.slug) return FALLBACK_ALBUM
  return GALLERY_ALBUMS.find((a) => a.slug === slug)
}

export function isAlbumSlug(value: string): boolean {
  return GALLERY_ALBUMS.some((a) => a.slug === value)
}

/** Az admin „Kategória” legördülőjéhez. */
export function albumSelectOptions(): { value: string; label: string }[] {
  return [
    ...GALLERY_ALBUMS.map((a) => ({ value: a.slug, label: a.title.hu })),
    { value: "general", label: "Általános (nincs mappa)" },
    { value: "training", label: "Edzés" },
    { value: "match", label: "Mérkőzés" },
    { value: "team", label: "Csapat" },
    { value: "event", label: "Esemény" },
  ]
}

export function albumText(album: GalleryAlbum, locale: Locale) {
  return {
    title: album.title[locale] ?? album.title.hu,
    subtitle: album.subtitle[locale] ?? album.subtitle.hu,
    description: album.description[locale] ?? album.description.hu,
    dateLabel: album.dateLabel[locale] ?? album.dateLabel.hu,
  }
}
