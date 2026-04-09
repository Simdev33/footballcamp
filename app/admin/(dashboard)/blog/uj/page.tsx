"use client"

import { useSession } from "next-auth/react"
import { createBlogPost } from "@/lib/actions"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ImagePicker } from "@/components/admin/image-picker"
import { useState } from "react"

const CATEGORIES = ["általános", "edzés", "táplálkozás", "mentális", "akadémia", "szülőknek"]

export default function NewBlogPostPage() {
  const { data: session } = useSession()
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Vissza
      </Link>

      <h2 className="text-xl font-bold text-white">Új blog bejegyzés</h2>

      <form
        action={createBlogPost}
        className="bg-[#0a1f0a] border border-[#d4a017]/10 p-6 space-y-5"
      >
        <input
          type="hidden"
          name="authorId"
          value={(session?.user as Record<string, string>)?.id || ""}
        />
        <input type="hidden" name="content" value={content} />

        <div>
          <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">
            Cím
          </label>
          <input
            type="text"
            name="title"
            required
            className="w-full h-11 px-4 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none transition-colors text-sm"
            placeholder="Blog bejegyzés címe..."
          />
        </div>

        <div>
          <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">
            Kivonat (rövid összefoglaló)
          </label>
          <textarea
            name="excerpt"
            rows={2}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none transition-colors text-sm resize-none"
            placeholder="Rövid leírás a listázáshoz..."
          />
        </div>

        <div>
          <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">
            Kategória
          </label>
          <select
            name="category"
            className="w-full h-11 px-4 bg-white/5 border border-white/10 text-white focus:border-[#d4a017] focus:outline-none transition-colors text-sm"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-[#0a1f0a]">
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">
            Borítókép (opcionális)
          </label>
          <ImagePicker value={imageUrl} onChange={setImageUrl} folder="blog" />
          <input type="hidden" name="imageUrl" value={imageUrl} />
        </div>

        <div>
          <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">
            Tartalom
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none transition-colors text-sm resize-y"
            placeholder="Írd ide a bejegyzés szövegét..."
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="published"
            className="w-5 h-5 accent-[#d4a017]"
          />
          <span className="text-white text-sm">
            Publikálás (megjelenik a publikus oldalon)
          </span>
        </label>

        <button
          type="submit"
          className="w-full h-11 bg-[#d4a017] text-[#0a1f0a] font-semibold hover:bg-[#d4a017]/90 transition-colors"
        >
          Bejegyzés létrehozása
        </button>
      </form>
    </div>
  )
}
