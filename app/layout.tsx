import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { getSiteContent } from '@/lib/content'
import { getSiteImages } from '@/lib/site-images'

const GOOGLE_ADS_ID = 'AW-18106758812'
const META_PIXEL_ID = '804886405638081'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-serif',
  display: 'swap',
})

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Kickoff Elite Football Camps | Nemzetközi Futballtáborok',
  description: 'Nemzetközi futballtáborok külföldi edzőkkel Szegeden és Kecskeméten. Fejlődés és életre szóló élmény a legjobb európai akadémiák módszereivel.',
  icons: {
    icon: [
      { url: '/kickoff-logo.png?v=2', type: 'image/png', sizes: '512x512' },
      { url: '/kickoff-logo.png?v=2', type: 'image/png', sizes: '192x192' },
      { url: '/kickoff-logo.png?v=2', type: 'image/png', sizes: '32x32' },
    ],
    shortcut: '/kickoff-logo.png?v=2',
    apple: [{ url: '/kickoff-logo.png?v=2', sizes: '180x180', type: 'image/png' }],
  },
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

  return (
    <html lang="hu">
      <head>
        <link rel="preconnect" href="https://focis.b-cdn.net" />
        <link rel="dns-prefetch" href="https://focis.b-cdn.net" />
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
        <Script
          id="gtag-js"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        />
        {/*
          Meta (Facebook) Pixel — loaded with consent=revoke by default so
          nothing is tracked until the visitor accepts marketing cookies.
          The cookie banner flips consent to "grant" via lib/meta-pixel.ts.
        */}
        <Script id="meta-pixel" strategy="afterInteractive">
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
