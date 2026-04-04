import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jelentkezés | Kickoff Elite Football Camps',
  description:
    'Jelentkezz a Kickoff Elite Football Camps futballtáborába!',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
