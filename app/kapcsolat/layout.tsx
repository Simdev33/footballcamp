import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kapcsolat | Benfica Football Camp Hungary',
  description:
    'Vedd fel velünk a kapcsolatot! Elérhetőségeink és közösségi média csatornáink.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
