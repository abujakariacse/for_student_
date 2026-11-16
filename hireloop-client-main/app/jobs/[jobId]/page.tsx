import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
} from "lucide-react"

import { getDetailsPage, getJobs } from "@/lib/api/jobs"
import type { JobFormData, JobOption } from "@/lib/types/job"
import {
  EXPERIENCE_LEVELS,
  JOB_TYPES,
  SALARY_PERIODS,
  WORKPLACE_TYPES,
} from "@/lib/constants/job-options"
import { formatDate } from "@/lib/format"
import { darkCardClass, monoLabelClass } from "@/lib/ui-styles"
import { CategoryBadge, StatusBadge } from "@/app/browse-jobs/components/badges"
import { JobCard } from "@/app/browse-jobs/components/JobCard"
import { ApplyButton } from "./apply-button"

const optionLabel = (options: JobOption[], value: string) =>
  options.find((option) => option.value === value)?.label ?? value

export default async function PublicJobDetailsPage({
  params,
}: {
  params: Promise<{ jobId: string }>
}) {
  const { jobId } = await params

  const [rawJob, allJobs] = await Promise.all([
    getDetailsPage(jobId),
    getJobs(),
  ])
  const job = rawJob as JobFormData | null

  if (!job?._id) notFound()

  const salaryText =
    job.salary || [job.salaryMin, job.salaryMax].filter(Boolean).join(" – ")

  const salaryPeriodLabel = optionLabel(SALARY_PERIODS, job.salaryPeriod || "")

  const skillList = (job.skills || "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean)

  // Similar roles: same category first, fall back to any job.
  const similarJobs =
    allJobs.filter(
      (item) => item._id !== job._id && item.category === job.category
    ).length > 0
      ? allJobs.filter(
          (item) => item._id !== job._id && item.category === job.category
        )
      : allJobs.filter((item) => item._id !== job._id)

  return (
    <div className="min-h-screen bg-[#010109] text-white">
      <main className="mx-auto max-w-7xl px-4 pt-24 pb-10 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/browse-jobs"
          className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to jobs
        </Link>

        {/* Job header */}
        <section className={`${darkCardClass} mt-5 rounded-2xl p-5 sm:p-7`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#222228] text-sm font-semibold text-[#ededef]">
                {(job.companyName || "?").charAt(0).toUpperCase()}
              </span>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {job.companyName}
                </p>
                <p className={`mt-1 ${monoLabelClass}`}>{job.ref}</p>
              </div>
            </div>

            <StatusBadge status={job.status} />
          </div>

          <h1 className="mt-5 font-manrope text-2xl font-bold tracking-tight sm:text-3xl">
            {job.jobTitle}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/55">
            {job.location ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" aria-hidden="true" />
                {job.location}
              </span>
            ) : null}

            <span className="inline-flex items-center gap-1.5">
              <BriefcaseBusiness className="size-4" aria-hidden="true" />
              {optionLabel(JOB_TYPES, job.jobType)}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" aria-hidden="true" />
              Posted {formatDate(job.datePosted)}
            </span>
          </div>

          {/* Key facts */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {salaryText ? (
              <CategoryBadge
                category={
                  salaryPeriodLabel && !job.salary
                    ? `${salaryText} / ${salaryPeriodLabel}`
                    : salaryText
                }
              />
            ) : null}

            <CategoryBadge
              category={optionLabel(WORKPLACE_TYPES, job.workplaceType)}
            />
            <CategoryBadge
              category={optionLabel(EXPERIENCE_LEVELS, job.experienceLevel)}
            />
            <CategoryBadge category={job.category} />
          </div>
        </section>

        {/* Body + side cards */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* Description */}
          <div className="flex min-w-0 flex-col gap-6">
            <section className={`${darkCardClass} rounded-2xl p-5 sm:p-6`}>
              <h2 className="font-manrope text-lg font-semibold">
                About the job
              </h2>

              <p className="mt-4 text-sm leading-7 whitespace-pre-line text-[#a0a0ab]">
                {job.jobDescription || "No description provided."}
              </p>
            </section>

            {skillList.length > 0 ? (
              <section className={`${darkCardClass} rounded-2xl p-5 sm:p-6`}>
                <h2 className="font-manrope text-lg font-semibold">
                  Required skills
                </h2>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {skillList.map((skill) => (
                    <CategoryBadge key={skill} category={skill} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          {/* Company + overview + apply */}
          <aside className="flex h-fit flex-col gap-6 lg:sticky lg:top-8">
            <section className={`${darkCardClass} rounded-2xl p-5`}>
              <p className={monoLabelClass}>Company</p>

              <div className="mt-4 flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#222228] text-sm font-semibold text-[#ededef]">
                  {(job.companyName || "?").charAt(0).toUpperCase()}
                </span>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {job.companyName}
                  </p>
                  {job.location ? (
                    <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-white/50">
                      <MapPin className="size-3.5" aria-hidden="true" />
                      {job.location}
                    </p>
                  ) : null}
                </div>
              </div>
            </section>

            <section className={`${darkCardClass} rounded-2xl p-5`}>
              <p className={monoLabelClass}>Overview</p>

              <dl className="mt-4 flex flex-col gap-3 text-sm">
                {[
                  [
                    "Workplace",
                    optionLabel(WORKPLACE_TYPES, job.workplaceType),
                  ],
                  [
                    "Experience",
                    optionLabel(EXPERIENCE_LEVELS, job.experienceLevel),
                  ],
                  ["Openings", job.openings ? String(job.openings) : "—"],
                  [
                    "Deadline",
                    job.applicationDeadline
                      ? formatDate(job.applicationDeadline)
                      : "—",
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-3"
                  >
                    <dt className="text-white/50">{label}</dt>
                    <dd className="truncate text-right text-[#ededef]">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <ApplyButton job={job} />
          </aside>
        </div>

        {/* Similar jobs */}
        {similarJobs.length > 0 ? (
          <section className="mt-10">
            <h2 className="font-manrope text-xl font-semibold">Similar jobs</h2>

            <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
              {similarJobs.slice(0, 4).map((item) => (
                <JobCard key={item._id} job={item} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  )
}
