import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "SL Benfica",
  description:
    "Az SL Benfica akadémiai háttere, módszertana és játékosai a Kickoff Elite Football Camps partnerklubjai között.",
  alternates: { canonical: "/klubok/benfica" },
  openGraph: {
    title: "SL Benfica | Kickoff Elite Football Camps",
    description:
      "Ismerd meg az SL Benfica akadémiai hátterét és a nemzetközi módszertant.",
    url: "/klubok/benfica",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
