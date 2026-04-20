import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookie tájékoztató | Kickoff Elite Football Camps",
  description:
    "A kickoffcamps.hu weboldalon használt cookie-k (sütik) típusai, céljai és a választási lehetőségek.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
