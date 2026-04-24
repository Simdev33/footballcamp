import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rólunk',
  description:
    'Ismerd meg a Kickoff Elite Football Camps csapatát, küldetését és értékeit — ahol a futball több, mint sport.',
  alternates: { canonical: '/rolunk' },
  openGraph: {
    title: 'Rólunk | Kickoff Elite Football Camps',
    description:
      'Csapatunk, küldetésünk és értékeink — a futball több mint egy sport.',
    url: '/rolunk',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
