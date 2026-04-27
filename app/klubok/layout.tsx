import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Klubok',
  description:
    'Partnereink és akadémiai kapcsolataink nemzetközi futballklubokkal — SL Benfica és további akadémiai együttműködések.',
  alternates: { canonical: '/klubok' },
  openGraph: {
    title: 'Partnerklubok | Kickoff Elite Football Camps',
    description:
      'SL Benfica és további akadémiai együttműködések — nemzetközi módszertan magyar gyerekeknek.',
    url: '/klubok',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
