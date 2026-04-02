import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rólunk | Benfica Football Camp Hungary',
  description:
    'Ismerd meg a Benfica Football Camp Hungary csapatát, küldetését és értékeit.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
