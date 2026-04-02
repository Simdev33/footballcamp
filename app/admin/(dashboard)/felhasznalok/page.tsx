import { db } from "@/lib/db"
import { createUser, updateUserRole, deleteUser } from "@/lib/actions"
import { UserPlus, Trash2, Shield, Pencil, Eye } from "lucide-react"

const ROLE_CONFIG: Record<string, { label: string; icon: any; class: string }> = {
  super_admin: { label: "Super Admin", icon: Shield, class: "bg-[#d4a017]/15 text-[#d4a017]" },
  editor: { label: "Szerkesztő", icon: Pencil, class: "bg-blue-500/15 text-blue-400" },
  viewer: { label: "Megtekintő", icon: Eye, class: "bg-white/10 text-white/50" },
}

export default async function AdminUsersPage() {
  const users = await db.user.findMany({ orderBy: { createdAt: "asc" } })

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Felhasználók kezelése</h2>

      {/* Add user form */}
      <form action={createUser} className="bg-[#0a1f0a] border border-[#d4a017]/10 p-6">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2"><UserPlus className="w-5 h-5 text-[#d4a017]" /> Új felhasználó</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Név</label>
            <input type="text" name="name" required className="w-full h-10 px-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none transition-colors text-sm" />
          </div>
          <div>
            <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Email</label>
            <input type="email" name="email" required className="w-full h-10 px-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none transition-colors text-sm" />
          </div>
          <div>
            <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Jelszó</label>
            <input type="password" name="password" required minLength={6} className="w-full h-10 px-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none transition-colors text-sm" />
          </div>
          <div>
            <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Szerepkör</label>
            <select name="role" className="w-full h-10 px-3 bg-white/5 border border-white/10 text-white focus:border-[#d4a017] focus:outline-none transition-colors text-sm">
              <option value="editor">Szerkesztő</option>
              <option value="viewer">Megtekintő</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
        </div>
        <button type="submit" className="mt-4 px-6 h-10 bg-[#d4a017] text-[#0a1f0a] text-sm font-semibold hover:bg-[#d4a017]/90 transition-colors">
          Létrehozás
        </button>
      </form>

      {/* User list */}
      <div className="bg-[#0a1f0a] border border-[#d4a017]/10 divide-y divide-white/5">
        {users.map((user) => {
          const role = ROLE_CONFIG[user.role] || ROLE_CONFIG.viewer
          return (
            <div key={user.id} className="flex items-center gap-4 px-6 py-4">
              <div className="w-10 h-10 bg-[#d4a017]/15 flex items-center justify-center flex-shrink-0">
                <span className="text-[#d4a017] font-serif font-bold text-lg">{user.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm">{user.name}</p>
                <p className="text-white/30 text-xs">{user.email}</p>
              </div>
              <span className={`text-xs px-3 py-1 font-medium ${role.class}`}>{role.label}</span>
              <form action={async () => { "use server"; await deleteUser(user.id) }}>
                <button type="submit" className="w-8 h-8 flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Törlés">
                  <Trash2 className="w-4 h-4" />
                </button>
              </form>
            </div>
          )
        })}
      </div>
    </div>
  )
}
