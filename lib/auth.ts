import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare, hashSync } from "bcryptjs"
import { db } from "@/lib/db"
import { authConfig } from "@/lib/auth.config"
import {
  assertLoginAllowed,
  clearLoginFailures,
  recordLoginFailure,
} from "@/lib/login-rate-limit"

class DatabaseUnreachable extends CredentialsSignin {
  code = "database_unreachable"
}

class AccountLocked extends CredentialsSignin {
  code = "account_locked"
}

function clientIp(request?: Request) {
  if (!request) return "unknown"
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown"
  return request.headers.get("x-real-ip") || "unknown"
}

function userRole(user: { role?: string | null }) {
  return user.role === "super_admin" || user.role === "editor" || user.role === "viewer"
    ? user.role
    : "viewer"
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const rawEmail = credentials?.email
        const password = credentials?.password
        if (!rawEmail || !password) return null

        const email = String(rawEmail).trim().toLowerCase()
        const ip = clientIp(request)

        try {
          await assertLoginAllowed(email, ip)
        } catch (err) {
          const msg = err instanceof Error ? err.message : ""
          if (msg.startsWith("locked:")) {
            throw new AccountLocked()
          }
          throw err
        }

        try {
          const user = await db.user.findUnique({ where: { email } })

          if (!user) {
            await recordLoginFailure(email, ip)
            return null
          }

          const isValid = await compare(String(password), user.password)
          if (!isValid) {
            await recordLoginFailure(email, ip)
            return null
          }

          await clearLoginFailures(email, ip)

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: userRole(user),
          }
        } catch (err) {
          if (err instanceof CredentialsSignin) throw err
          console.error("[auth] Adatbázis hiba bejelentkezéskor:", err)
          throw new DatabaseUnreachable()
        }
      },
    }),
  ],
})

/** Csak belső scriptekhez (seed) — soha ne exportáld API-n keresztül. */
export function hashAdminPassword(password: string) {
  return hashSync(password, 12)
}
