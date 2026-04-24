import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kapcsolat',
  description:
    'Vedd fel velünk a kapcsolatot — elérhetőségeink, közösségi média csatornáink, Kickoff Elite Football Camps.',
  alternates: { canonical: '/kapcsolat' },
  openGraph: {
    title: 'Kapcsolat | Kickoff Elite Football Camps',
    description:
      'Kérdésed van? Kérj tájékoztatást, írj üzenetet — válaszolunk 24 órán belül.',
    url: '/kapcsolat',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
