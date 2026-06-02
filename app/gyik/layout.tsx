import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GYIK',
  description:
    'Minden, amit tudni kell — korosztály, edzések, fizetés és részvételi díj. Gyakran ismételt kérdések a Kickoff táborokról.',
  alternates: { canonical: '/gyik' },
  openGraph: {
    title: 'Gyakran ismételt kérdések | Kickoff Elite Football Camps',
    description:
      'Edzés, fizetés és részvételi díj — válaszok a leggyakoribb kérdésekre.',
    url: '/gyik',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
