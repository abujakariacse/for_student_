import Link from "next/link"
import { redirect } from "next/navigation"
import { Briefcase, Building2, FileText, PlusCircle } from "lucide-react"

import { getSession } from "@/lib/core/server"
import { getJobs } from "@/lib/api/jobs"
import { PageHeader } from "@/app/componets/PageHeader"
import { QuickLinkCard } from "@/app/componets/QuickLinkCard"
import { StatusBadge } from "@/app/browse-jobs/components/badges"
import {
  darkCardClass,
  pageContainerClass,
  rowHoverClass,
  statCardClass,
  statValueClass,
} from "@/lib/ui-styles"
import { normalizeStatus } from "@/lib/format"
import type { JobFormData } from "@/lib/types/job"

// Recruiter dashboard overview — /dashboard/recruiter
//
// Read-only snapshot of the signed-in recruiter's job posts plus quick
// links. Reuses the existing jobs fetcher; no new API surface.

export default async function RecruiterDashboardPage() {
  const session = await getSession()

  if (!session?.user) {
    redirect("/sign-in")
  }

  const jobs: JobFormData[] = await getJobs(`recruiterId=${session?.user.id}`)

  const stats = {
    total: jobs.length,
    active: jobs.filter((job) => normalizeStatus(job.status) === "Active")
      .length,
    closed: jobs.filter((job) => normalizeStatus(job.status) === "Closed")
      .length,
  }

  const recent = [...jobs].slice(0, 4)

  return (
    <div className={pageContainerClass}>
      <PageHeader
        eyebrow="Recruiter · Overview"
        title={
          <>
            <span className="text-white">Welcome back, </span>
            <span className="text-white">
              {(session.user.name || "there").split(" ")[0]}
            </span>
          </>
        }
        description="Track your listings and keep the pipeline moving."
        actions={
          <Link
            href="/dashboard/recruiter/job/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#5c53fe] px-4 text-xs font-medium text-white shadow-[0_0_15px_rgba(92,83,254,0.35)] transition-colors hover:bg-[#6c63ff]"
          >
            <PlusCircle className="size-4" aria-hidden="true" />
            Add Job
          </Link>
        }
      />

      {/* Job snapshot */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "Total Job Posts", value: stats.total },
          { label: "Active", value: stats.active },
          { label: "Closed", value: stats.closed },
        ].map((stat) => (
          <div key={stat.label} className={statCardClass}>
            <p className="text-sm text-white">{stat.label}</p>

            <p className={`${statValueClass} text-white`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <QuickLinkCard
          icon={PlusCircle}
          title="Add Job"
          description="Publish a new opening to the board."
          href="/dashboard/recruiter/job/new"
        />

        <QuickLinkCard
          icon={Briefcase}
          title="Manage Jobs"
          description="Edit, close or review your listings."
          href="/dashboard/recruiter/jobs"
        />

        <QuickLinkCard
          icon={FileText}
          title="Applications"
          description="Review applicants per job posting."
          href="/dashboard/recruiter/jobs"
        />

        <QuickLinkCard
          icon={Building2}
          title="My Company"
          description="Company profile and branding."
          href="/dashboard/recruiter/company"
        />
      </div>

      {/* Recent listings */}
      <h2 className="mt-8 font-manrope text-base font-semibold">
        Your job posts
      </h2>

      {recent.length === 0 ? (
        <div className={`${darkCardClass} mt-3 px-6 py-10 text-center`}>
          <p className="text-sm text-white/85">
            You haven't posted any jobs yet.
          </p>

          <Link
            href="/dashboard/recruiter/job/new"
            className="mt-4 inline-flex h-9 items-center rounded-lg bg-[#5c53fe] px-4 text-xs font-medium text-white shadow-[0_0_15px_rgba(92,83,254,0.35)] transition-colors hover:bg-[#6c63ff]"
          >
            Post your first job
          </Link>
        </div>
      ) : (
        <section
          className={`${darkCardClass} mt-3 divide-y divide-white/[0.06] overflow-hidden`}
        >
          {recent.map((job) => (
            <RecentJobRow key={job._id || job.ref} job={job} />
          ))}
        </section>
      )}
    </div>
  )
}

function RecentJobRow({ job }: { job: JobFormData }) {
  return (
    <Link
      href={`/dashboard/recruiter/jobs/${job._id}/applications`}
      className={`${rowHoverClass} flex items-center justify-between gap-4 px-5 py-4`}
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white">
          {job.jobTitle}
        </p>

        <p className="mt-0.5 truncate text-xs text-white/75">
          {job.ref ? `${job.ref} · ` : ""}
          {job.companyName}
        </p>
      </div>

      <StatusBadge status={normalizeStatus(job.status)} />
    </Link>
  )
}
