"use client"

export type ConsentCategory = "necessary" | "analytics" | "marketing"

export type ConsentState = {
  necessary: true
  analytics: boolean
  marketing: boolean
  timestamp: number
  version: number
}

const STORAGE_KEY = "kickoff.cookie-consent"
const CONSENT_VERSION = 1

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ConsentState
    if (!parsed || parsed.version !== CONSENT_VERSION) return null
    return parsed
  } catch {
    return null
  }
}

export function writeConsent(consent: Omit<ConsentState, "timestamp" | "version" | "necessary">): ConsentState {
  const full: ConsentState = {
    necessary: true,
    analytics: consent.analytics,
    marketing: consent.marketing,
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  }
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(full))
    // Google Consent Mode v2 update
    type GtagFn = (command: string, action: string, params: Record<string, string>) => void
    type ConsentWindow = Window & { gtag?: GtagFn; dataLayer?: unknown[] }
    const w = window as ConsentWindow
    if (typeof w.gtag === "function") {
      w.gtag("consent", "update", {
        ad_storage: full.marketing ? "granted" : "denied",
        ad_user_data: full.marketing ? "granted" : "denied",
        ad_personalization: full.marketing ? "granted" : "denied",
        analytics_storage: full.analytics ? "granted" : "denied",
      })
    }
    // Custom event so third-party scripts can react
    window.dispatchEvent(new CustomEvent("cookie-consent-change", { detail: full }))
  }
  return full
}

export function clearConsent() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY)
  }
}
