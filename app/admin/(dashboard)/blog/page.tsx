import { db } from "@/lib/db"
import { deleteBlogPost } from "@/lib/actions"
import Link from "next/link"
import { Plus, Pencil, Trash2, Eye, EyeOff, Tag, BookOpen } from "lucide-react"
import { PageHeader } from "@/components/admin/page-header"

export const dynamic = "force-dynamic"

export default async function AdminBlogPage() {
  const posts = await db.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4a017] text-[#0a1f0a] text-sm font-semibold hover:bg-[#d4a017]/90 transition-colors rounded"
          >
            <Plus className="w-4 h-4" /> Új bejegyzés
          </Link>
        }
      />

      {posts.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          Még nincs hír bejegyzés létrehozva
        </div>
      ) : (
        <div className="bg-[#0a1f0a] border border-[#d4a017]/10 divide-y divide-white/5">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {post.published ? (
                    <Eye className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-white/30 shrink-0" />
                  )}
                  <h3 className="text-white font-medium text-sm truncate">
                    {post.title}
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-white/30 text-xs">
                  <span>{post.author.name}</span>
                  <span>&middot;</span>
                  <span>{post.createdAt.toLocaleDateString("hu-HU")}</span>
                  <span className="inline-flex items-center gap-1 text-[#d4a017]/60">
                    <Tag className="w-3 h-3" />
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/blog/${post.id}`}
                  className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-[#d4a017] bg-white/5 hover:bg-[#d4a017]/10 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <form
                  action={async () => {
                    "use server"
                    await deleteBlogPost(post.id)
                  }}
                >
                  <button
                    type="submit"
                    className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-red-400 bg-white/5 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
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
