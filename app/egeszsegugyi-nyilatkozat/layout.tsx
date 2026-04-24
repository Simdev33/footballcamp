import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Egészségügyi nyilatkozat",
  description:
    "A Kickoff Elite Football Camps futballtáboraiba való jelentkezéshez szükséges egészségügyi nyilatkozat teljes szövege.",
  alternates: { canonical: "/egeszsegugyi-nyilatkozat" },
  robots: { index: true, follow: true },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
