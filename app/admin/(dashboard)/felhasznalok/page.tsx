import { db } from "@/lib/db"
import { createUser } from "@/lib/actions"
import { UserPlus, Shield, Pencil, Eye } from "lucide-react"
import { PageHeader } from "@/components/admin/page-header"
import { DeleteUserForm } from "@/components/admin/delete-user-form"

export const dynamic = 'force-dynamic'

const ROLE_CONFIG: Record<string, { label: string; icon: any; class: string }> = {
  super_admin: { label: "Super Admin", icon: Shield, class: "bg-teal-50 text-teal-700 ring-teal-200" },
  editor: { label: "Szerkesztő", icon: Pencil, class: "bg-sky-50 text-sky-700 ring-sky-200" },
  viewer: { label: "Megtekintő", icon: Eye, class: "bg-slate-100 text-slate-600 ring-slate-200" },
}

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  })

  return (
    <div className="space-y-6">
      <PageHeader
        icon={UserPlus}
        title="Felhasználók kezelése"
        description="Itt hozhatsz létre admin felhasználókat. Csak annak adj hozzáférést, akinek tényleg szerkesztenie kell az oldalt."
      />

      {/* Add user form */}
      <form action={createUser} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <h3 className="text-slate-950 text-xl font-bold mb-5 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
            <UserPlus className="w-5 h-5" />
          </span>
          Új felhasználó
        </h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Név</label>
            <input type="text" name="name" required className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-950 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <input type="email" name="email" required className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-950 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Jelszó</label>
            <input type="password" name="password" required minLength={6} className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-950 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Szerepkör</label>
            <select name="role" className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-950 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100">
              <option value="editor">Szerkesztő</option>
              <option value="viewer">Megtekintő</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
        </div>
        <button type="submit" className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-teal-600 px-6 text-base font-bold text-white transition-colors hover:bg-teal-700 sm:w-auto">
          Létrehozás
        </button>
      </form>

      {/* User list */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {users.map((user) => {
          const role = ROLE_CONFIG[user.role] || ROLE_CONFIG.viewer
          const RoleIcon = role.icon
          return (
            <div key={user.id} className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 last:border-b-0 sm:flex-row sm:items-center sm:px-6">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center flex-shrink-0 ring-1 ring-sky-100">
                <span className="text-sky-700 font-serif font-bold text-xl">{user.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-950 font-bold text-base">{user.name}</p>
                <p className="text-slate-500 text-sm break-all">{user.email}</p>
                <p className="text-slate-400 text-xs mt-1">Létrehozva: {user.createdAt.toLocaleDateString("hu-HU")}</p>
              </div>
              <span className={`inline-flex min-h-9 items-center justify-center gap-2 rounded-full px-3 text-xs font-semibold ring-1 ${role.class}`}>
                <RoleIcon className="h-3.5 w-3.5" />
                {role.label}
              </span>
              <DeleteUserForm userId={user.id} userName={user.name} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
