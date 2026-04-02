import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Táborok | Benfica Football Camp Hungary',
  description:
    'Részletek, időpontok és árak a szegedi és kecskeméti futballtáborokról.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
