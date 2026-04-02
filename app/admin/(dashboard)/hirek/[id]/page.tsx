"use client"

import { useEffect, useState } from "react"
import { updateNews } from "@/lib/actions"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { ImagePicker } from "@/components/admin/image-picker"

export default function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const [news, setNews] = useState<any>(null)
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [id, setId] = useState("")

  useEffect(() => {
    params.then(async (p) => {
      setId(p.id)
      const res = await fetch(`/api/news/${p.id}`)
      const data = await res.json()
      setNews(data)
      setContent(data.content)
      setImageUrl(data.imageUrl || "")
    })
  }, [params])

  if (!news) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-[#d4a017] animate-spin" />
      </div>
    )
  }

  const updateWithId = updateNews.bind(null, id)

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/admin/hirek" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Vissza
      </Link>

      <h2 className="text-xl font-bold text-white">Hír szerkesztése</h2>

      <form action={updateWithId} className="bg-[#0a1f0a] border border-[#d4a017]/10 p-6 space-y-5">
        <input type="hidden" name="content" value={content} />

        <div>
          <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Cím</label>
          <input type="text" name="title" required defaultValue={news.title} className="w-full h-11 px-4 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none transition-colors text-sm" />
        </div>

        <div>
          <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Kep</label>
          <ImagePicker value={imageUrl} onChange={setImageUrl} folder="news" />
          <input type="hidden" name="imageUrl" value={imageUrl} />
        </div>

        <div>
          <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Tartalom</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none transition-colors text-sm resize-none"
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="published" defaultChecked={news.published} className="w-5 h-5 accent-[#d4a017]" />
          <span className="text-white text-sm">Publikálva</span>
        </label>

        <button type="submit" className="w-full h-11 bg-[#d4a017] text-[#0a1f0a] font-semibold hover:bg-[#d4a017]/90 transition-colors">
          Mentés
        </button>
      </form>
    </div>
  )
}
