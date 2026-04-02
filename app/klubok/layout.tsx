import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Klubok | Benfica Football Camp Hungary',
  description:
    'Partnereink és akadémiai kapcsolataink a legjobb európai futballklubokkal.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
