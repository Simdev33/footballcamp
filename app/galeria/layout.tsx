import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Galéria | Benfica Football Camp Hungary',
  description:
    'Képek és pillanatok a Benfica Football Camp Hungary táboraiból.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
