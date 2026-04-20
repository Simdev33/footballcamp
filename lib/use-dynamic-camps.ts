"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/language-context"
import type { Translations } from "@/lib/i18n"

export type DynamicCamp = Translations["locations"]["camps"][number] & {
  id?: string
  slug?: string
  imageUrl?: string | null
}

type ApiCamp = {
  id: string
  slug: string
  city: string
  venue: string
  dates: string
  price: string
  earlyBirdPrice: string
  remainingSpots: number
  totalSpots: number
  ageRange: string
  clubName: string
  imageUrl: string | null
}

/**
 * Loads active camps from the DB on the client. Falls back to the static
 * i18n camps array if the API is unreachable or returns an empty list, so
 * the page always renders something meaningful.
 */
export function useDynamicCamps(): { camps: DynamicCamp[]; loaded: boolean } {
  const { t } = useLanguage()
  const staticCamps = t.locations.camps
  const spotsLabel = t.locations.spots

  const [camps, setCamps] = useState<DynamicCamp[]>(staticCamps as DynamicCamp[])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch("/api/camps-public")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: ApiCamp[]) => {
        if (cancelled) return
        if (Array.isArray(data) && data.length > 0) {
          const mapped: DynamicCamp[] = data.map((c) => ({
            city: c.city,
            venue: c.venue,
            dates: c.dates,
            price: c.price,
            earlyBird: c.earlyBirdPrice,
            spots: String(c.remainingSpots),
            cta: staticCamps[0]?.cta ?? "",
            id: c.id,
            slug: c.slug,
            imageUrl: c.imageUrl,
          }))
          setCamps(mapped)
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
  }, [])

  // Translate `spotsLabel` handling (no-op here, kept for future)
  void spotsLabel

  return { camps, loaded }
}
