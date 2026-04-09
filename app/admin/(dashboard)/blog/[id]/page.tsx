"use client"

import { useEffect, useState } from "react"
import { updateBlogPost } from "@/lib/actions"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { ImagePicker } from "@/components/admin/image-picker"

const CATEGORIES = ["általános", "edzés", "táplálkozás", "mentális", "akadémia", "szülőknek"]

export default function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [post, setPost] = useState<Record<string, unknown> | null>(null)
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [id, setId] = useState("")

  useEffect(() => {
    params.then(async (p) => {
      setId(p.id)
      const res = await fetch(`/api/blog/${p.id}`)
      const data = await res.json()
      setPost(data)
      setContent((data.content as string) || "")
      setImageUrl((data.imageUrl as string) || "")
    })
  }, [params])

  if (!post) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-[#d4a017] animate-spin" />
      </div>
    )
  }

  const updateWithId = updateBlogPost.bind(null, id)

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Vissza
      </Link>

      <h2 className="text-xl font-bold text-white">Blog bejegyzés szerkesztése</h2>

      <form
        action={updateWithId}
        className="bg-[#0a1f0a] border border-[#d4a017]/10 p-6 space-y-5"
      >
        <input type="hidden" name="content" value={content} />

        <div>
          <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">
            Cím
          </label>
          <input
            type="text"
            name="title"
            required
            defaultValue={post.title as string}
            className="w-full h-11 px-4 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none transition-colors text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">
            Kivonat
          </label>
          <textarea
            name="excerpt"
            rows={2}
            defaultValue={post.excerpt as string}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none transition-colors text-sm resize-none"
          />
        </div>

        <div>
          <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">
            Kategória
          </label>
          <select
            name="category"
            defaultValue={post.category as string}
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
            Borítókép
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
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="published"
            defaultChecked={post.published as boolean}
            className="w-5 h-5 accent-[#d4a017]"
          />
          <span className="text-white text-sm">Publikálva</span>
        </label>

        <button
          type="submit"
          className="w-full h-11 bg-[#d4a017] text-[#0a1f0a] font-semibold hover:bg-[#d4a017]/90 transition-colors"
        >
          Mentés
        </button>
      </form>
    </div>
  )
}
