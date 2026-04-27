"use client"

import { useSession } from "next-auth/react"
import { createBlogPost } from "@/lib/actions"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ImagePicker } from "@/components/admin/image-picker"
import { useState } from "react"

const CATEGORIES = ["általános", "edzés", "táplálkozás", "mentális", "akadémia", "szülőknek"]
const labelClass = "block text-sm font-semibold text-slate-700 mb-2"
const inputClass = "w-full min-h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-950 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100"
const textareaClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base leading-relaxed text-slate-950 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100 resize-y"

export default function NewBlogPostPage() {
  const { data: session } = useSession()
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")

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
        <h2 className="mt-2 font-serif text-3xl font-bold text-slate-950">Új blog bejegyzés</h2>
        <p className="mt-2 text-base leading-relaxed text-slate-600">
          Írd meg a címet, a rövid kivonatot és a cikk szövegét. A publikálás kapcsolóval döntöd el, azonnal megjelenjen-e a weboldalon.
        </p>
      </div>

      <form
        action={createBlogPost}
        className="rounded-3xl border border-slate-200 bg-white p-5 space-y-5 shadow-sm md:p-6"
      >
        <input
          type="hidden"
          name="authorId"
          value={(session?.user as Record<string, string>)?.id || ""}
        />
        <input type="hidden" name="content" value={content} />

        <div>
          <label className={labelClass}>Cím</label>
          <input
            type="text"
            name="title"
            required
            className={inputClass}
            placeholder="Blog bejegyzés címe..."
          />
        </div>

        <div>
          <label className={labelClass}>Kivonat (rövid összefoglaló)</label>
          <textarea
            name="excerpt"
            rows={2}
            className={textareaClass}
            placeholder="Rövid leírás a listázáshoz..."
          />
        </div>

        <div>
          <label className={labelClass}>Kategória</label>
          <select
            name="category"
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
          <label className={labelClass}>Borítókép (opcionális)</label>
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
            placeholder="Írd ide a bejegyzés szövegét..."
          />
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <input
            type="checkbox"
            name="published"
            className="w-5 h-5 accent-teal-600"
          />
          <span className="text-base font-medium text-slate-700">
            Publikálás (megjelenik a publikus oldalon)
          </span>
        </label>

        <button
          type="submit"
          className="w-full min-h-14 rounded-3xl bg-teal-600 text-lg font-bold text-white transition-colors hover:bg-teal-700"
        >
          Bejegyzés létrehozása
        </button>
      </form>
    </div>
  )
}
