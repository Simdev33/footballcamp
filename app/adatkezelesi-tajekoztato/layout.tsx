import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Adatkezelési tájékoztató",
  description:
    "A Tireksz Nonprofit Kft. (Kickoff Elite Football Camps) adatkezelési tájékoztatója a kickoffcamps.hu weboldal látogatói és ügyfelei számára.",
  alternates: { canonical: "/adatkezelesi-tajekoztato" },
  robots: { index: true, follow: true },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
