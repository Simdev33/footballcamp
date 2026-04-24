import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Partnerprogram',
  description:
    'Csatlakozz hozzánk klubként! Nemzetközi szintű edzőtábor a saját márkád alatt — Kickoff Elite Football Camps.',
  alternates: { canonical: '/partnerprogram' },
  openGraph: {
    title: 'Partnerprogram | Kickoff Elite Football Camps',
    description:
      'Klubpartnereknek: nemzetközi szintű edzőtábor a saját márkád alatt.',
    url: '/partnerprogram',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
