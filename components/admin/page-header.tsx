import { type LucideIcon } from "lucide-react"

type Props = {
  icon?: LucideIcon
  title: string
  description?: string
  actions?: React.ReactNode
}

/**
 * Shared page header for admin pages. Keeps typography consistent
 * and gives non-technical users clear context on every page.
 */
export function PageHeader({ icon: Icon, title, description, actions }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-7 flex flex-col gap-5 shadow-sm shadow-slate-900/5 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-4 min-w-0 flex-1">
        {Icon && (
          <div className="w-12 h-12 md:w-14 md:h-14 bg-teal-50 text-teal-700 flex items-center justify-center rounded-2xl flex-shrink-0 ring-1 ring-teal-100">
            <Icon className="w-5 h-5 md:w-6 md:h-6" />
          </div>
        )}
        <div className="min-w-0">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-950 leading-tight">{title}</h2>
          {description && (
            <p className="text-slate-600 text-base mt-2 leading-relaxed max-w-3xl">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-shrink-0">{actions}</div>}
    </div>
  )
}
