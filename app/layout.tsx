import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { getSiteContent } from '@/lib/content'
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
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const dbContent = await getSiteContent()

  return (
    <html lang="hu">
      <head>
        <link rel="preconnect" href="https://focis.b-cdn.net" />
        <link rel="dns-prefetch" href="https://focis.b-cdn.net" />
      </head>
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased`}>
        <LayoutWrapper dbContent={dbContent}>{children}</LayoutWrapper>
        <Analytics />
      </body>
    </html>
  )
}
