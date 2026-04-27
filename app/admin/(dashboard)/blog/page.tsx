import { db } from "@/lib/db"
import { deleteBlogPost } from "@/lib/actions"
import Link from "next/link"
import { Plus, Pencil, Trash2, Eye, EyeOff, Tag, BookOpen } from "lucide-react"
import { PageHeader } from "@/components/admin/page-header"

export const dynamic = "force-dynamic"

export default async function AdminBlogPage() {
  const posts = await db.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      published: true,
      category: true,
      createdAt: true,
      author: { select: { name: true } },
    },
  })

  return (
    <div className="space-y-6">
      <PageHeader
        icon={BookOpen}
        title={`Hírek (${posts.length})`}
        description="A weboldal „Hírek” aloldalán megjelenő cikkek. Kattints az „Új bejegyzés” gombra új hír létrehozásához."
        actions={
          <Link
            href="/admin/blog/uj"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 text-base font-bold text-white transition-colors hover:bg-teal-700 sm:w-auto"
          >
            <Plus className="w-4 h-4" /> Új bejegyzés
          </Link>
        }
      />

      {posts.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white py-20 text-center text-slate-500 shadow-sm">
          Még nincs hír bejegyzés létrehozva
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 transition-colors last:border-b-0 hover:bg-slate-50 md:flex-row md:items-center md:px-6"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3 mb-2">
                  {post.published ? (
                    <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-emerald-50 px-3 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                      <Eye className="w-3.5 h-3.5 shrink-0" />
                      Publikus
                    </span>
                  ) : (
                    <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-slate-100 px-3 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                      <EyeOff className="w-3.5 h-3.5 shrink-0" />
                      Vázlat
                    </span>
                  )}
                </div>
                <h3 className="text-slate-950 font-bold text-lg leading-snug">
                  {post.title}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-slate-500 text-sm">
                  <span>{post.author.name}</span>
                  <span>&middot;</span>
                  <span>{post.createdAt.toLocaleDateString("hu-HU")}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-sky-700 ring-1 ring-sky-100">
                    <Tag className="w-3 h-3" />
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row md:flex-shrink-0">
                <Link
                  href={`/admin/blog/${post.id}`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-teal-50 px-4 text-sm font-bold text-teal-700 transition-colors hover:bg-teal-100"
                >
                  <Pencil className="w-4 h-4" />
                  Szerkesztés
                </Link>
                <form
                  action={async () => {
                    "use server"
                    await deleteBlogPost(post.id)
                  }}
                >
                  <button
                    type="submit"
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 text-sm font-bold text-red-700 transition-colors hover:bg-red-100 sm:w-auto"
                    aria-label={`${post.title} törlése`}
                  >
                    <Trash2 className="w-4 h-4" />
                    Törlés
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
