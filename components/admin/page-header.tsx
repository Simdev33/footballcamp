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
    <div className="bg-[#0a1f0a] border border-[#d4a017]/10 rounded-lg p-5 md:p-6 flex flex-wrap items-start gap-4 justify-between">
      <div className="flex items-start gap-4 min-w-0 flex-1">
        {Icon && (
          <div className="w-11 h-11 md:w-12 md:h-12 bg-[#d4a017]/15 text-[#d4a017] flex items-center justify-center rounded-md flex-shrink-0">
            <Icon className="w-5 h-5 md:w-6 md:h-6" />
          </div>
        )}
        <div className="min-w-0">
          <h2 className="font-serif text-xl md:text-2xl font-bold text-white">{title}</h2>
          {description && (
            <p className="text-white/55 text-sm mt-1 leading-relaxed max-w-2xl">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  )
}
