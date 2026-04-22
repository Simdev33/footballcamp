"use client"

import { createContext, useContext } from "react"
import {
  SITE_IMAGE_DEFAULTS,
  type SiteImageKey,
  type SiteImageOverrides,
} from "./site-images"

const SiteImagesContext = createContext<SiteImageOverrides>({})

export function SiteImagesProvider({
  value,
  children,
}: {
  value: SiteImageOverrides
  children: React.ReactNode
}) {
  return <SiteImagesContext.Provider value={value}>{children}</SiteImagesContext.Provider>
}

/** Client-side helper: returns the override URL (if any) for a named site image key, else the default. */
export function useSiteImage(key: SiteImageKey): string {
  const overrides = useContext(SiteImagesContext)
  const v = overrides[key]
  if (typeof v === "string" && v.length > 0) return v
  return SITE_IMAGE_DEFAULTS[key]
}
