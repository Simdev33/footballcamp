import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ÁSZF | Kickoff Elite Football Camps",
  description:
    "A Kickoff Elite Football Camps (Tireksz Nonprofit Kft.) által szervezett futballtáborok általános szerződési feltételei.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
