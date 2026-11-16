import type { ReactNode } from "react"

import { pageDescClass, pageTitleClass } from "@/lib/ui-styles"

// Shared dashboard page header: optional eyebrow label, title, description
// and a right-side actions slot. Keeps spacing/typography identical across
// every dashboard page.
//
// Server-component safe (no hooks/state).

type PageHeaderProps = {
  /** Small uppercase label above the title (e.g. "RECRUITER · JOBS"). */
  eyebrow?: string
  title: React.ReactNode;
  description?: string
  /** Buttons/controls aligned to the right of the title. */
  actions?: ReactNode
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="font-mono text-[10px] tracking-[0.25em] text-[#827aff] uppercase">
            {eyebrow}
          </p>
        ) : null}

        <h1
          className={`${pageTitleClass}${eyebrow ? " mt-2" : ""} truncate`}
        >
          {title}
        </h1>

        {description ? <p className={pageDescClass}>{description}</p> : null}
      </div>

      {actions ? (
        <div className="flex shrink-0 items-center gap-2.5">{actions}</div>
      ) : null}
    </div>
  )
}
