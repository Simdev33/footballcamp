import { redirect } from "next/navigation"

/**
 * A képek szerkesztése a „Oldalak szövegei és képei” menübe került,
 * szekciónként együtt a szövegekkel. Régi könyvjelzők továbbra is működnek.
 */
export default function AdminKepekRedirectPage() {
  redirect("/admin/tartalom")
}
