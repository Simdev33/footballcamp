import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Hírek | Kickoff Elite Football Camps",
  description: "A legfrissebb hírek és események a Kickoff Elite Football Camps-tól.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
