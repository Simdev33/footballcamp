"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/language-context"
import type { Translations } from "@/lib/i18n"
import type { PublicCamp } from "@/lib/public-camps"

export type DynamicCamp = Translations["locations"]["camps"][number] & {
  id?: string
  slug?: string
  imageUrl?: string | null
}

type ApiCamp = PublicCamp

let sharedCampsPromise: Promise<ApiCamp[]> | null = null

function fetchPublicCamps() {
  sharedCampsPromise ??= fetch("/api/camps-public")
    .then((r) => (r.ok ? r.json() : []))
    .catch(() => [])
  return sharedCampsPromise
}

/**
 * Loads active camps from the DB on the client. Falls back to the static
 * i18n camps array if the API is unreachable or returns an empty list, so
 * the page always renders something meaningful.
 */
export function useDynamicCamps(initialCamps: ApiCamp[] = []): { camps: DynamicCamp[]; loaded: boolean } {
  const { t, locale } = useLanguage()
  const staticCamps = t.locations.camps
  const spotsLabel = t.locations.spots
  const defaultCta = staticCamps[0]?.cta?.trim() || t.form.cta
  const mapCamps = (data: ApiCamp[]): DynamicCamp[] =>
    data.map((c) => ({
      city: locale === "en" ? c.translationEn?.city?.trim() || c.city : c.city,
      venue: locale === "en" ? c.translationEn?.venue?.trim() || c.venue : c.venue,
      dates: locale === "en" ? c.translationEn?.dates?.trim() || c.dates : c.dates,
      price: c.price,
      earlyBird: c.earlyBirdPrice,
      spots: String(c.remainingSpots),
      cta: defaultCta,
      id: c.id,
      slug: c.slug,
      imageUrl: c.imageUrl,
    }))

  const [camps, setCamps] = useState<DynamicCamp[]>(
    initialCamps.length > 0 ? mapCamps(initialCamps) : (staticCamps as DynamicCamp[]),
  )
  const [loaded, setLoaded] = useState(initialCamps.length > 0)

  useEffect(() => {
    let cancelled = false
    fetchPublicCamps()
      .then((data: ApiCamp[]) => {
        if (cancelled) return
        if (Array.isArray(data) && data.length > 0) {
          setCamps(mapCamps(data))
        }
        setLoaded(true)
      })
      .catch(() => {
        if (!cancelled) setLoaded(true)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])

  // Translate `spotsLabel` handling (no-op here, kept for future)
  void spotsLabel

  return { camps, loaded }
}
