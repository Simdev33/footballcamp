import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rólunk | Kickoff Elite Football Camps',
  description:
    'Ismerd meg a Kickoff Elite Football Camps csapatát, küldetését és értékeit.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
