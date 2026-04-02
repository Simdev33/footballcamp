import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GYIK | Benfica Football Camp Hungary',
  description:
    'Gyakran ismételt kérdések a futballtáborokkal kapcsolatban.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
