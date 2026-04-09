import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog | Kickoff Elite Football Camps",
  description: "Cikkek, tippek és inspiráció a futball világából.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
