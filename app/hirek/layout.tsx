import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Hírek | Benfica Football Camp Hungary",
  description: "A legfrissebb hírek és események a Benfica Football Camp Hungary-tól.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
