"use client"

import { useEffect, useState } from "react"
import Script from "next/script"
import { readConsent, type ConsentState } from "@/lib/cookie-consent"

const GOOGLE_ADS_ID = "AW-18106758812"

export function GoogleTag() {
  const [consentReady, setConsentReady] = useState(false)

  useEffect(() => {
    const check = () => {
      const c = readConsent()
      if (c && (c.analytics || c.marketing)) {
        setConsentReady(true)
      }
    }
    check()

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<ConsentState>).detail
      if (detail && (detail.analytics || detail.marketing)) {
        setConsentReady(true)
      }
    }
    window.addEventListener("cookie-consent-change", onChange)
    return () => window.removeEventListener("cookie-consent-change", onChange)
  }, [])

  if (!consentReady) return null

  return (
    <>
      <Script
        id="gtag-js"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ADS_ID}', { allow_enhanced_conversions: true });
        `}
      </Script>
    </>
  )
}
