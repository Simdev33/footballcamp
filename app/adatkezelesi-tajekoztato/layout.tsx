import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Adatkezelési tájékoztató | Kickoff Elite Football Camps",
  description:
    "A Tireksz Nonprofit Kft. (Kickoff Elite Football Camps) adatkezelési tájékoztatója a kickoffcamps.hu weboldal látogatói és ügyfelei számára.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
