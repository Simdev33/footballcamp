import { auth } from "@/lib/auth"

export default auth((req) => {
  const isAdmin = req.nextUrl.pathname.startsWith("/admin")
  const isLogin = req.nextUrl.pathname === "/admin/login"
  const isApi = req.nextUrl.pathname.startsWith("/api")

  if (!isAdmin || isLogin || isApi) return

  if (!req.auth) {
    return Response.redirect(new URL("/admin/login", req.nextUrl.origin))
  }
})

export const config = {
  matcher: ["/admin/:path*"],
}
