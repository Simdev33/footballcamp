import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Klubok',
  description:
    'Partnereink és akadémiai kapcsolataink a legjobb európai futballklubokkal — SL Benfica és további top akadémiák.',
  alternates: { canonical: '/klubok' },
  openGraph: {
    title: 'Partnerklubok | Kickoff Elite Football Camps',
    description:
      'SL Benfica és további top európai akadémiák — nemzetközi módszertan magyar gyerekeknek.',
    url: '/klubok',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
