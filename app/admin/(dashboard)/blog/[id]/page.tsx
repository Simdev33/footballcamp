"use client"

import { useEffect, useState } from "react"
import { updateBlogPost } from "@/lib/actions"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { ImagePicker } from "@/components/admin/image-picker"

const CATEGORIES = ["általános", "edzés", "táplálkozás", "mentális", "akadémia", "szülőknek"]
const labelClass = "block text-sm font-semibold text-slate-700 mb-2"
const inputClass = "w-full min-h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-950 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100"
const textareaClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base leading-relaxed text-slate-950 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100 resize-y"

export default function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [post, setPost] = useState<Record<string, unknown> | null>(null)
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [id, setId] = useState("")
  const [loadError, setLoadError] = useState("")

  useEffect(() => {
    params.then(async (p) => {
      setId(p.id)
      const res = await fetch(`/api/blog/${p.id}`)
      if (!res.ok) {
        setLoadError("Nem sikerült betölteni a bejegyzést. Próbáld újra, vagy lépj vissza a blog listához.")
        return
      }
      const data = await res.json()
      setPost(data)
      setContent((data.content as string) || "")
      setImageUrl((data.imageUrl as string) || "")
    })
  }, [params])

  if (!post) {
    return (
      <div className="max-w-3xl space-y-6">
        <Link
          href="/admin/blog"
          className="inline-flex min-h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-950"
        >
          <ArrowLeft className="w-4 h-4" /> Vissza
        </Link>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          {loadError ? (
            <p className="text-base font-medium text-red-700">{loadError}</p>
          ) : (
            <div className="inline-flex items-center gap-3 text-slate-600">
              <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
              <span className="text-base font-medium">Bejegyzés betöltése...</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  const updateWithId = updateBlogPost.bind(null, id)

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/admin/blog"
        className="inline-flex min-h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-950"
      >
        <ArrowLeft className="w-4 h-4" /> Vissza
      </Link>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wider text-teal-700">Blog</p>
        <h2 className="mt-2 font-serif text-3xl font-bold text-slate-950">Blog bejegyzés szerkesztése</h2>
        <p className="mt-2 text-base leading-relaxed text-slate-600">
          Itt módosíthatod a címet, a képet, a tartalmat és azt, hogy a bejegyzés látszódjon-e a publikus oldalon.
        </p>
      </div>

      <form
        action={updateWithId}
        className="rounded-3xl border border-slate-200 bg-white p-5 space-y-5 shadow-sm md:p-6"
      >
        <input type="hidden" name="content" value={content} />

        <div>
          <label className={labelClass}>Cím</label>
          <input
            type="text"
            name="title"
            required
            defaultValue={post.title as string}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Kivonat</label>
          <textarea
            name="excerpt"
            rows={2}
            defaultValue={post.excerpt as string}
            className={textareaClass}
          />
        </div>

        <div>
          <label className={labelClass}>Kategória</label>
          <select
            name="category"
            defaultValue={post.category as string}
            className={inputClass}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Borítókép</label>
          <ImagePicker value={imageUrl} onChange={setImageUrl} folder="blog" />
          <input type="hidden" name="imageUrl" value={imageUrl} />
        </div>

        <div>
          <label className={labelClass}>Tartalom</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            required
            className={textareaClass}
          />
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <input
            type="checkbox"
            name="published"
            defaultChecked={post.published as boolean}
            className="w-5 h-5 accent-teal-600"
          />
          <span className="text-base font-medium text-slate-700">Publikálva</span>
        </label>

        <button
          type="submit"
          className="w-full min-h-14 rounded-3xl bg-teal-600 text-lg font-bold text-white transition-colors hover:bg-teal-700"
        >
          Mentés
        </button>
      </form>
    </div>
  )
}
