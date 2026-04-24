import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { getSiteContent } from '@/lib/content'
import { getSiteImages } from '@/lib/site-images'

const GOOGLE_ADS_ID = 'AW-18106758812'
const META_PIXEL_ID = '804886405638081'
const SITE_URL = 'https://kickoffcamps.hu'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-serif',
  display: 'swap',
  weight: ['700', '800'],
  preload: true,
})

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  preload: true,
})

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#eef1ec' },
    { media: '(prefers-color-scheme: dark)', color: '#0a1f0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'light',
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Kickoff Elite Football Camps | Nemzetközi Futballtáborok',
    template: '%s | Kickoff Elite Football Camps',
  },
  description:
    'Nemzetközi futballtáborok külföldi edzőkkel Szegeden és Kecskeméten. Fejlődés és életre szóló élmény a legjobb európai akadémiák módszereivel.',
  applicationName: 'Kickoff Elite Football Camps',
  keywords: [
    'focitábor',
    'futballtábor',
    'Benfica tábor',
    'nyári focitábor',
    'Szeged focitábor',
    'Kecskemét focitábor',
    'nemzetközi focitábor',
    'gyerek focitábor',
    'Kickoff Elite Football Camps',
    'football camp Hungary',
    'elite football camp',
  ],
  authors: [{ name: 'Tireksz Nonprofit Kft.' }],
  creator: 'Kickoff Elite Football Camps',
  publisher: 'Tireksz Nonprofit Kft.',
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  alternates: {
    canonical: '/',
    languages: {
      'hu-HU': '/',
      'en-US': '/',
      'x-default': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'hu_HU',
    alternateLocale: ['en_US'],
    url: SITE_URL,
    siteName: 'Kickoff Elite Football Camps',
    title: 'Kickoff Elite Football Camps | Nemzetközi Futballtáborok',
    description:
      'Nemzetközi futballtáborok külföldi edzőkkel Szegeden és Kecskeméten. Fejlődés és életre szóló élmény a legjobb európai akadémiák módszereivel.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kickoff Elite Football Camps | Nemzetközi Futballtáborok',
    description:
      'Nemzetközi futballtáborok külföldi edzőkkel. Top európai akadémiák módszereivel Szegeden és Kecskeméten.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      { url: '/kickoff-logo.png?v=2', type: 'image/png', sizes: '512x512' },
      { url: '/kickoff-logo.png?v=2', type: 'image/png', sizes: '192x192' },
      { url: '/kickoff-logo.png?v=2', type: 'image/png', sizes: '32x32' },
    ],
    shortcut: '/kickoff-logo.png?v=2',
    apple: [{ url: '/kickoff-logo.png?v=2', sizes: '180x180', type: 'image/png' }],
  },
  category: 'sports',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [dbContent, siteImages] = await Promise.all([
    getSiteContent(),
    getSiteImages(),
  ])

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    '@id': `${SITE_URL}#organization`,
    name: 'Kickoff Elite Football Camps',
    legalName: 'Tireksz Nonprofit Kft.',
    url: SITE_URL,
    logo: `${SITE_URL}/kickoff-logo.png`,
    image: `${SITE_URL}/opengraph-image`,
    description:
      'Nemzetközi futballtáborok külföldi edzőkkel Szegeden és Kecskeméten. Fejlődés és életre szóló élmény a legjobb európai akadémiák módszereivel.',
    telephone: '+36 30 755 1110',
    email: 'info@kickoffcamps.hu',
    priceRange: '€€',
    sport: 'Football',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Felsőnyomás út 47.',
      postalCode: '6728',
      addressLocality: 'Szeged',
      addressCountry: 'HU',
    },
    areaServed: [
      { '@type': 'City', name: 'Szeged' },
      { '@type': 'City', name: 'Kecskemét' },
    ],
    sameAs: [
      'https://www.facebook.com/kickoffcamps',
    ],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}#website`,
    url: SITE_URL,
    name: 'Kickoff Elite Football Camps',
    description:
      'Nemzetközi futballtáborok külföldi edzőkkel Szegeden és Kecskeméten.',
    inLanguage: ['hu-HU', 'en-US'],
    publisher: { '@id': `${SITE_URL}#organization` },
  }

  return (
    <html lang="hu">
      <head>
        <link rel="preconnect" href="https://focis.b-cdn.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://focis.b-cdn.net" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <Script
          id="ld-organization"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(organizationSchema)}
        </Script>
        <Script
          id="ld-website"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(websiteSchema)}
        </Script>
        {/*
          Consent Mode v2 default state — must load before any Google tag so
          Google Ads correctly respects the visitor's choice.
        */}
        <Script id="gtag-consent-default" strategy="beforeInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);} window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
  wait_for_update: 500,
});
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}', { allow_enhanced_conversions: true });`}
        </Script>
        {/*
          Google Ads tag — lazyOnload so it doesn't block LCP/TBT on mobile.
          Consent + config already queued above will flush when this loads.
        */}
        <Script
          id="gtag-js"
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        />
        {/*
          Meta (Facebook) Pixel — lazyOnload to keep the mobile main thread
          free for rendering. Consent defaults to 'revoke'; the cookie banner
          flips it to 'grant' via lib/meta-pixel.ts once the user accepts.
        */}
        <Script id="meta-pixel" strategy="lazyOnload">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('consent', 'revoke');
try{var c=JSON.parse(localStorage.getItem('kickoff.cookie-consent')||'null');if(c&&c.marketing===true){fbq('consent','grant');}}catch(e){}
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
        </Script>
      </head>
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased`}>
        {/* Meta Pixel <noscript> fallback for browsers without JS */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            alt=""
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
        <LayoutWrapper dbContent={dbContent} siteImages={siteImages}>{children}</LayoutWrapper>
        <Analytics />
      </body>
    </html>
  )
}
