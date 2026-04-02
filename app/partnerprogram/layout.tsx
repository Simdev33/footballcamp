import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Partnerprogram | Benfica Football Camp Hungary',
  description:
    'Csatlakozz hozzánk klubként! Nemzetközi szintű edzőtábor a saját márkád alatt.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
