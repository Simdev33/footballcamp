import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GYIK | Kickoff Elite Football Camps',
  description:
    'Gyakran ismételt kérdések a futballtáborokkal kapcsolatban.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
