"use client"

import { useTransition } from "react"
import { Trash2 } from "lucide-react"
import { deleteUser } from "@/lib/actions"

export function DeleteUserForm({ userId, userName }: { userId: string; userName: string }) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        const ok = window.confirm(`Biztosan törlöd ezt az admin felhasználót?\n\n${userName}`)
        if (!ok) return
        startTransition(async () => {
          await deleteUser(userId)
        })
      }}
      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 text-sm font-bold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      title="Törlés"
    >
      <Trash2 className="w-4 h-4" />
      {pending ? "Törlés..." : "Törlés"}
    </button>
  )
}
