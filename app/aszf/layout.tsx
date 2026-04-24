import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ÁSZF",
  description:
    "A Kickoff Elite Football Camps (Tireksz Nonprofit Kft.) által szervezett futballtáborok általános szerződési feltételei.",
  alternates: { canonical: "/aszf" },
  robots: { index: true, follow: true },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
