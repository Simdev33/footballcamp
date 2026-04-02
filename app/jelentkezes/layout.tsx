import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jelentkezés | Benfica Football Camp Hungary',
  description:
    'Jelentkezz a Benfica Football Camp Hungary futballtáborába!',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
