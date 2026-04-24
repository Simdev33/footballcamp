import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Galéria',
  description:
    'Pillanatok korábbi táborainkból. Fotók és videók a Kickoff Elite Football Camps edzéseiről és csapatairól.',
  alternates: { canonical: '/galeria' },
  openGraph: {
    title: 'Galéria | Kickoff Elite Football Camps',
    description:
      'Nézd meg, milyen egy nap nálunk — pillanatok a legutóbbi táborainkból.',
    url: '/galeria',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
