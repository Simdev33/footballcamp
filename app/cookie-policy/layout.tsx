import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookie tájékoztató",
  description:
    "A kickoffcamps.hu weboldalon használt cookie-k (sütik) típusai, céljai és a választási lehetőségek.",
  alternates: { canonical: "/cookie-policy" },
  robots: { index: true, follow: true },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
