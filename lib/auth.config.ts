import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
    updateAge: 60 * 60,
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl

      if (!pathname.startsWith("/admin")) return true
      if (pathname === "/admin/login") return true

      if (!auth?.user) return false

      if (pathname.startsWith("/admin/felhasznalok")) {
        return (auth.user as { role?: string }).role === "super_admin"
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.userRole = (user as { role?: string }).role
        token.userId = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as { role?: string }).role = token.userRole as string
        ;(session.user as { id?: string }).id = token.userId as string
      }
      return session
    },
  },
}
