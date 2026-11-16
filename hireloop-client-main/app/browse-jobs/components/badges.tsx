// Small presentational badges/avatars shared by job list views.

import type { JobStatus } from "@/lib/types/job"
import type { ApplicationStatus } from "@/lib/types/application"
import type { Role } from "@/lib/types/dashboard"
import { normalizeStatus } from "@/lib/format"

export function StatusBadge({ status }: { status: JobStatus }) {
  const active = normalizeStatus(status) === "Active"

  return (
    <span
      className={
        "inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium " +
        (active
          ? "border-[#22c55e] bg-[#22c55e]/10 text-[#22c55e]"
          : "border-white/10 bg-[#a1a4aa]/15 text-[#a0a0ab]")
      }
    >
      <span
        className={
          "size-1.5 rounded-full " + (active ? "bg-[#22c55e]" : "bg-[#a1a4aa]")
        }
        aria-hidden="true"
      />
      {active ? "Active" : "Closed"}
    </span>
  )
}

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex w-fit items-center rounded-full border border-white/10 bg-[#1a1a1f] px-3 py-1 text-[11px] text-[#ededef]">
      {category}
    </span>
  )
}

export function CompanyAvatar({ name }: { name?: string }) {
  const displayName = name || "Unknown"

  return (
    <span className="flex min-w-0 items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#222228] text-xs font-semibold text-[#ededef]">
        {displayName.charAt(0).toUpperCase()}
      </span>
      <span className="truncate text-sm text-[#ededef]">{displayName}</span>
    </span>
  )
}

// Application pipeline colors — spec statuses: Applied / Under Review /
// Shortlisted / Rejected / Offered.
const applicationStatusStyles: Record<string, string> = {
  applied: "border-white/15 bg-white/[0.06] text-white/80",
  "under review": "border-[#f59e0b]/30 bg-[#f59e0b]/10 text-[#f59e0b]",
  shortlisted: "border-[#3b82f6]/40 bg-[#3b82f6]/10 text-[#3b82f6]",
  rejected: "border-[#ef4444]/30 bg-[#ef4444]/10 text-[#ef4444]",
  offered: "border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e]",
}

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  const key = (status || "").trim().toLowerCase()
  const label = status || "Applied"

  return (
    <span
      className={
        "inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium " +
        (applicationStatusStyles[key] ??
          "border-white/10 bg-[#a1a4aa]/15 text-[#a0a0ab]")
      }
    >
      <span
        className={
          "size-1.5 rounded-full " +
          (applicationStatusStyles[key] ? "bg-current" : "bg-[#a1a4aa]")
        }
        aria-hidden="true"
      />
      {label}
    </span>
  )
}

// Account-role colors — spec roles: seeker / recruiter / admin.
const roleStyles: Record<Role, string> = {
  admin: "border-[#a78bfa]/40 bg-[#a78bfa]/10 text-[#a78bfa]",
  recruiter: "border-[#3b82f6]/40 bg-[#3b82f6]/10 text-[#3b82f6]",
  seeker: "border-[#22c55e]/40 bg-[#22c55e]/10 text-[#22c55e]",
}

export function RoleBadge({ role }: { role: Role }) {
  return (
    <span
      className={
        "inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium capitalize " +
        (roleStyles[role] ?? "border-white/10 bg-[#a1a4aa]/15 text-[#a0a0ab]")
      }
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {role}
    </span>
  )
}
