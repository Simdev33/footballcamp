"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2, Shield } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

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
    <div className="min-h-screen bg-[#0a1f0a] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#d4a017] flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-[#0a1f0a]" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-white">Admin</h1>
          <p className="text-white/50 mt-2 text-sm">Benfica Football Camp Hungary</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#0f2b0f] border border-[#d4a017]/20 p-8">
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-12 px-4 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none transition-colors"
              placeholder="admin@benficacamp.hu"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Jelszó</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-12 px-4 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#d4a017] text-[#0a1f0a] font-semibold hover:bg-[#d4a017]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Bejelentkezés"}
          </button>
        </form>
      </div>
    </div>
  )
}
