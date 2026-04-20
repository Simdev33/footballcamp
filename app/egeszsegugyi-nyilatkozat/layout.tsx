import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Egészségügyi nyilatkozat | Kickoff Elite Football Camps",
  description:
    "A Kickoff Elite Football Camps futballtáboraiba való jelentkezéshez szükséges egészségügyi nyilatkozat teljes szövege.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
