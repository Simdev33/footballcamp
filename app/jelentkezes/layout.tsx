import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jelentkezés',
  description:
    'Jelentkezz a Kickoff Elite Football Camps nemzetközi futballtáborába. Kis létszámú csoportok, külföldi edzők, early bird kedvezmény.',
  alternates: { canonical: '/jelentkezes' },
  openGraph: {
    title: 'Jelentkezés | Kickoff Elite Football Camps',
    description:
      'Biztosítsd a helyed a nyári futballtáborban. Online jelentkezés, részletfizetés vagy átutalás.',
    url: '/jelentkezes',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
