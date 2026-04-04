import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Galéria | Kickoff Elite Football Camps',
  description:
    'Képek és pillanatok a Kickoff Elite Football Camps táboraiból.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
