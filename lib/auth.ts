import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { db } from "@/lib/db"

class DatabaseUnreachable extends CredentialsSignin {
  code = "database_unreachable"
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const rawEmail = credentials?.email
        const password = credentials?.password
        if (!rawEmail || !password) return null

        const email = String(rawEmail).trim().toLowerCase()

        try {
          const user = await db.user.findUnique({
            where: { email },
          })

          if (!user) return null

          const isValid = await compare(String(password), user.password)
          if (!isValid) return null

          return { id: user.id, name: user.name, email: user.email, role: user.role }
        } catch (err) {
          console.error("[auth] Adatbázis hiba bejelentkezéskor:", err)
          throw new DatabaseUnreachable()
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userRole = (user as any).role
        token.userId = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.userRole as string
        (session.user as any).id = token.userId as string
      }
      return session
    },
  },
})
