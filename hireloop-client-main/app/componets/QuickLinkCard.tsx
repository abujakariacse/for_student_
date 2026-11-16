import Link from "next/link"
import type { LucideIcon } from "lucide-react"

import {
  darkCardClass,
  rowHoverClass,
  secondaryButtonClass,
} from "@/lib/ui-styles"

// Shared quick-action card for the role dashboard overviews — an icon, a
// title, a one-line description and a "Go" link. Server-component safe.

type QuickLinkCardProps = {
  icon: LucideIcon
  title: string
  description: string
  href: string
}

export function QuickLinkCard({
  icon: Icon,
  title,
  description,
  href,
}: QuickLinkCardProps) {
  return (
    <Link
      href={href}
      className={`${darkCardClass} ${rowHoverClass} group flex flex-col gap-3 p-5 hover:border-white/25`}
    >
      <span className="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/70 transition-colors group-hover:border-[#5c53fe]/50 group-hover:text-[#827aff]">
        <Icon className="size-5" aria-hidden="true" />
      </span>

      <div>
        <p className="text-sm font-semibold text-white">{title}</p>

        <p className="mt-1 text-xs text-white">{description}</p>
      </div>

      <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-[#827aff] transition-colors group-hover:text-white">
        Open
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </span>
    </Link>
  )
}

/** Small labeled button row under the stats (e.g. "Browse jobs"). */
export function QuickLinkButton({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={`${secondaryButtonClass} inline-flex h-9 items-center px-4 text-xs font-medium`}
    >
      {children}
    </Link>
  )
}
