import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Cikkek, tippek és inspiráció a futball világából — edzésmódszerek, táborvezetés és szülői gondolatok.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog | Kickoff Elite Football Camps',
    description:
      'Cikkek, tippek és inspiráció a futball világából.',
    url: '/blog',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
