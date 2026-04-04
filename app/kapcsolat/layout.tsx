import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kapcsolat | Kickoff Elite Football Camps',
  description:
    'Vedd fel velünk a kapcsolatot! Elérhetőségeink és közösségi média csatornáink.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
