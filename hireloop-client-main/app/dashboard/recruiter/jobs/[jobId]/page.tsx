import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  Banknote,
  CalendarDays,
  Globe,
  MapPin,
  Users,
} from "lucide-react"

import { getDetailsPage } from "@/lib/api/jobs"
import {
  CategoryBadge,
  CompanyAvatar,
  StatusBadge,
} from "@/app/browse-jobs/components/badges"
import {
  darkCardClass,
  monoLabelClass,
  pageContainerClass,
  statCardClass,
} from "@/lib/ui-styles"
import { normalizeStatus } from "@/lib/format"
import type { JobFormData } from "@/lib/types/job"

// Compose a readable salary line: prefer the stored `salary` string, then
// fall back to the min/max range the job form collects.
const salaryText = (job: JobFormData) => {
  if (job.salary) return job.salary

  if (job.salaryMin && job.salaryMax) {
    const per = job.salaryPeriod ? ` / ${job.salaryPeriod}` : ""
    return `$${job.salaryMin} – $${job.salaryMax}${per}`
  }

  if (job.salaryMin) return `$${job.salaryMin}`

  if (job.salaryMax) return `$${job.salaryMax}`

  return "—"
}

// Recruiter job-details screen — /dashboard/recruiter/jobs/[jobId]
// Presentational view of the same job record; the applications review
// screen is one click away in the header.

const JobDetailsPage = async ({
  params,
}: {
  params: Promise<{ jobId: string }>
}) => {
  const { jobId } = await params

  const job = (await getDetailsPage(jobId)) as JobFormData | null

  if (!job?._id) notFound()

  return (
    <div className={pageContainerClass}>
      <Link
        href="/dashboard/recruiter/jobs"
        className="inline-flex items-center gap-1.5 text-sm text-white/85 transition-colors hover:text-white"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to jobs
      </Link>

      {/* Title block */}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={job.category ?? "Uncategorized"} />

            <StatusBadge status={normalizeStatus(job.status)} />
          </div>

          <h1 className="mt-3 font-manrope text-2xl font-bold tracking-tight sm:text-[28px]">
            {job.jobTitle}
          </h1>

          <div className="mt-2 flex items-center gap-3">
            <CompanyAvatar name={job.companyName} />

            <p className="flex items-center gap-1.5 text-sm text-white">
              <MapPin className="size-4" aria-hidden="true" />
              {job.location || "—"}
            </p>
          </div>
        </div>

        <Link
          href={`/dashboard/recruiter/jobs/${job._id}/applications`}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-[#5c53fe] px-4 text-sm font-medium text-white shadow-[0_0_15px_rgba(92,83,254,0.35)] transition-colors hover:bg-[#6c63ff]"
        >
          <Users className="size-4" aria-hidden="true" />
          View applications
        </Link>
      </div>

      {/* Key facts */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className={statCardClass}>
          <p className="flex items-center gap-1.5 text-sm text-white">
            <Banknote className="size-4" aria-hidden="true" />
            Salary
          </p>

          <p className="mt-1.5 text-sm font-medium text-white">
            {salaryText(job)}
          </p>
        </div>

        <div className={statCardClass}>
          <p className="flex items-center gap-1.5 text-sm text-white">
            <Globe className="size-4" aria-hidden="true" />
            Job type
          </p>

          <p className="mt-1.5 text-sm font-medium text-white capitalize">
            {job.jobType || "—"}
          </p>
        </div>

        <div className={statCardClass}>
          <p className="flex items-center gap-1.5 text-sm text-white">
            <CalendarDays className="size-4" aria-hidden="true" />
            Deadline
          </p>

          <p className="mt-1.5 text-sm font-medium text-white">
            {job.applicationDeadline || "—"}
          </p>
        </div>
      </div>

      {/* Description */}
      <section className={`${darkCardClass} mt-6 p-5 sm:p-6`}>
        <p className={monoLabelClass}>Job description</p>

        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-white/75">
          {job.jobDescription || "No description provided."}
        </p>
      </section>
    </div>
  )
}

export default JobDetailsPage
