"use client"

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { Loader2, Shield } from "lucide-react"

export default function AdminLoginPage() {
  const { status } = useSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === "authenticated") window.location.href = "/admin"
  }, [status])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError(
        result.code === "database_unreachable"
          ? "Nem sikerült csatlakozni az adatbázishoz. Ellenőrizd a DATABASE_URL-t."
          : "Hibás email vagy jelszó"
      )
    } else {
      window.location.href = "/admin"
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-teal-500 to-sky-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-slate-950">Admin</h1>
          <p className="text-slate-500 mt-2 text-base">Kickoff Elite Football Camps</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-3 text-center text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-950 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100"
              placeholder="admin@benficacamp.hu"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Jelszó</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-950 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-2xl bg-teal-600 text-base font-bold text-white hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Bejelentkezés"}
          </button>
        </form>
      </div>
    </div>
  )
}
