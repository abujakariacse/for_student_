import Link from "next/link"
import { redirect } from "next/navigation"
import { Briefcase, Building2, ShieldCheck, Users } from "lucide-react"

import { getSession } from "@/lib/core/server"
import { getUsers } from "@/lib/actions/users"
import { PageHeader } from "@/app/componets/PageHeader"
import { QuickLinkCard } from "@/app/componets/QuickLinkCard"
import {
  darkCardClass,
  pageContainerClass,
  statCardClass,
  statValueClass,
} from "@/lib/ui-styles"
import type { User } from "@/lib/types/user"

// Admin dashboard overview — /dashboard/admin
//
// Read-only platform snapshot + quick links. Reuses the existing users
// fetcher; no new API surface.

export default async function AdminDashboardPage() {
  const session = await getSession()

  if (!session?.user) {
    redirect("/sign-in")
  }

  const users: User[] = await getUsers()

  const stats = {
    total: users.length,
    seekers: users.filter((u) => u.role === "seeker").length,
    recruiters: users.filter((u) => u.role === "recruiter").length,
  }

  return (
    <div className={pageContainerClass}>
      <PageHeader
        eyebrow="Admin · Overview"
        title="Platform overview"
        description="Monitor accounts and manage access across HireLoop."
        actions={
          <Link
            href="/dashboard/admin/users"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#5c53fe] px-4 text-xs font-medium text-white shadow-[0_0_15px_rgba(92,83,254,0.35)] transition-colors hover:bg-[#6c63ff]"
          >
            <Users className="size-4" aria-hidden="true" />
            Manage Users
          </Link>
        }
      />

      {/* Platform snapshot */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Users", value: stats.total },
          { label: "Seekers", value: stats.seekers },
          { label: "Recruiters", value: stats.recruiters },
          {
            label: "Admins",
            value: users.filter((u) => u.role === "admin").length,
          },
        ].map((stat) => (
          <div key={stat.label} className={statCardClass}>
            <p className="text-sm text-white">{stat.label}</p>

            <p className={statValueClass}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <QuickLinkCard
          icon={Users}
          title="Users"
          description="Review accounts and manage roles."
          href="/dashboard/admin/users"
        />

        <QuickLinkCard
          icon={Building2}
          title="Companies"
          description="Oversee company accounts."
          href="/dashboard/admin/companies"
        />

        <QuickLinkCard
          icon={Briefcase}
          title="Jobs"
          description="All listings across the platform."
          href="/dashboard/admin/jobs"
        />

        <QuickLinkCard
          icon={ShieldCheck}
          title="Payments"
          description="Premium plans and transactions."
          href="/dashboard/admin/payments"
        />
      </div>

      {/* Sign-up hint */}
      <div className={`${darkCardClass} mt-8 px-6 py-5`}>
        <p className="font-mono text-[10px] tracking-[0.25em] text-white/70 uppercase">
          Note
        </p>

        <p className="mt-1.5 text-sm text-white/85">
          New sign-ups appear in{" "}
          <Link
            href="/dashboard/admin/users"
            className="text-[#827aff] transition-colors hover:text-white"
          >
            Users management
          </Link>{" "}
          — use the role toggle on each row to change access levels.
        </p>
      </div>
    </div>
  )
}
