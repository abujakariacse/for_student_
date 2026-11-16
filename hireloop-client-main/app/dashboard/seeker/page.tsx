import Link from "next/link"
import { redirect } from "next/navigation"
import { Bookmark, Briefcase, FileText, Wallet } from "lucide-react"

import { getSession } from "@/lib/core/server"
import { getApplications } from "@/lib/actions/applications"
import { ApplicationStatusBadge } from "@/app/browse-jobs/components/badges"
import { PageHeader } from "@/app/componets/PageHeader"
import { QuickLinkCard } from "@/app/componets/QuickLinkCard"
import {
  darkCardClass,
  pageContainerClass,
  rowHoverClass,
  statCardClass,
  statValueClass,
} from "@/lib/ui-styles"
import { formatRelativeDate } from "@/lib/format"
import type { Application } from "@/lib/types/application"

// Seeker dashboard overview — /dashboard/seeker
//
// Read-only snapshot of the signed-in seeker's applications plus quick
// links. Reuses the existing applications fetcher; no new API surface.

export default async function SeekerDashboardPage() {
  const session = await getSession()

  if (!session?.user) {
    redirect("/sign-in")
  }

  const applications: Application[] = await getApplications(
    `applicantId=${session.user.id}`
  )

  const stats = {
    total: applications.length,
    shortlisted: applications.filter((a) => a.status === "Shortlisted").length,
    underReview: applications.filter((a) => a.status === "Under Review").length,
    offered: applications.filter((a) => a.status === "Offered").length,
  }

  const recent = [...applications]
    .sort(
      (a, b) =>
        new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime()
    )
    .slice(0, 4)

  return (
    <div className={pageContainerClass}>
      <PageHeader
        eyebrow="Seeker · Overview"
        title={`Welcome back, ${(session.user.name || "there").split(" ")[0]}`}
        description="Here's where your job hunt stands today."
        actions={
          <Link
            href="/dashboard/seeker/applications"
            className="inline-flex h-9 items-center rounded-lg bg-[#5c53fe] px-4 text-xs font-medium text-white shadow-[0_0_15px_rgba(92,83,254,0.35)] transition-colors hover:bg-[#6c63ff]"
          >
            My Applications
          </Link>
        }
      />

      {/* Application snapshot */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Total Applied", value: stats.total },
          { label: "Shortlisted", value: stats.shortlisted },
          { label: "In Review", value: stats.underReview },
          { label: "Offers", value: stats.offered },
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
          icon={Briefcase}
          title="Browse Jobs"
          description="Find new openings that match your skills."
          href="/browse-jobs"
        />

        <QuickLinkCard
          icon={FileText}
          title="My Applications"
          description="Track statuses and follow up on submissions."
          href="/dashboard/seeker/applications"
        />

        <QuickLinkCard
          icon={Bookmark}
          title="Saved Jobs"
          description="Revisit the roles you bookmarked."
          href="/dashboard/seeker/saved-jobs"
        />

        <QuickLinkCard
          icon={Wallet}
          title="Billing"
          description="Manage your plan and payments."
          href="/dashboard/seeker/billing"
        />
      </div>

      {/* Recent activity */}
      <h2 className="mt-8 font-manrope text-base font-semibold">
        Recent applications
      </h2>

      {recent.length === 0 ? (
        <div className={`${darkCardClass} mt-3 px-6 py-10 text-center`}>
          <p className="text-sm text-white/85">
            You haven't applied to any jobs yet.
          </p>

          <Link
            href="/browse-jobs"
            className="mt-4 inline-flex h-9 items-center rounded-lg bg-[#5c53fe] px-4 text-xs font-medium text-white shadow-[0_0_15px_rgba(92,83,254,0.35)] transition-colors hover:bg-[#6c63ff]"
          >
            Browse jobs
          </Link>
        </div>
      ) : (
        <section className={`${darkCardClass} mt-3 divide-y divide-white/[0.06] overflow-hidden`}>
          {recent.map((application) => (
            <RecentApplicationRow
              key={application._id}
              application={application}
            />
          ))}
        </section>
      )}
    </div>
  )
}

function RecentApplicationRow({
  application,
}: {
  application: Application
}) {
  return (
    <Link
      href={`/jobs/${application.jobId}`}
      className={`${rowHoverClass} flex items-center justify-between gap-4 px-5 py-4`}
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white">
          {application.jobTitle}
        </p>

        <p className="mt-0.5 truncate text-xs text-white/75">
          {application.companyName} · Applied{" "}
          {formatRelativeDate(application.dateApplied)}
        </p>
      </div>

      <ApplicationStatusBadge status={application.status} />
    </Link>
  )
}
