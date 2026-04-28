import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Táborok',
  description:
    'Nemzetközi futballtáborok Szegeden külföldi edzőkkel. Strukturált edzések, akadémiai módszerek és valódi fejlődés.',
  alternates: { canonical: '/taborok' },
  openGraph: {
    title: 'Táborok | Kickoff Elite Football Camps',
    description:
      'Időpontok, helyszínek, árak — nézd meg, melyik turnus való a gyermekednek.',
    url: '/taborok',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
