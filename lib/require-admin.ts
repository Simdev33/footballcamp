import { auth } from "@/lib/auth"

type AdminRole = "super_admin" | "editor" | "viewer"

export async function requireAdmin(minRole: AdminRole = "editor") {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  const role = ((session.user as { role?: string }).role || "viewer") as AdminRole
  const rank: Record<AdminRole, number> = { viewer: 1, editor: 2, super_admin: 3 }
  if (rank[role] < rank[minRole]) {
    throw new Error("Forbidden")
  }

  return session
}
