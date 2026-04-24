import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Táborok',
  description:
    'Nyári futballtáborok Szegeden és Kecskeméten. Időpontok, árak, early bird kedvezmény — top európai akadémiák módszereivel.',
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
