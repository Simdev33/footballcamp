"use client"

import { useSession } from "next-auth/react"
import { createNews } from "@/lib/actions"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"

export default function NewNewsPage() {
  const { data: session } = useSession()
  const [content, setContent] = useState("")

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/admin/hirek" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Vissza
      </Link>

      <h2 className="text-xl font-bold text-white">Új hír létrehozása</h2>

      <form action={createNews} className="bg-[#0a1f0a] border border-[#d4a017]/10 p-6 space-y-5">
        <input type="hidden" name="authorId" value={(session?.user as any)?.id || ""} />
        <input type="hidden" name="content" value={content} />

        <div>
          <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Cím</label>
          <input type="text" name="title" required className="w-full h-11 px-4 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none transition-colors text-sm" placeholder="Hír címe..." />
        </div>

        <div>
          <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Kép URL (opcionális)</label>
          <input type="text" name="imageUrl" className="w-full h-11 px-4 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none transition-colors text-sm" placeholder="https://..." />
        </div>

        <div>
          <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Tartalom</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none transition-colors text-sm resize-none"
            placeholder="Írd ide a hír szövegét..."
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="published" className="w-5 h-5 accent-[#d4a017]" />
          <span className="text-white text-sm">Publikálás (megjelenik a publikus oldalon)</span>
        </label>

        <button type="submit" className="w-full h-11 bg-[#d4a017] text-[#0a1f0a] font-semibold hover:bg-[#d4a017]/90 transition-colors">
          Hír létrehozása
        </button>
      </form>
    </div>
  )
}
