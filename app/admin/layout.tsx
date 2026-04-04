import type { Metadata } from "next"
import { AdminSessionProvider } from "./admin-session-provider"

export const metadata: Metadata = {
  title: "Admin | Kickoff",
  robots: "noindex, nofollow",
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminSessionProvider>{children}</AdminSessionProvider>
}
