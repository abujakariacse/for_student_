import { getDetailsPage } from "@/lib/api/jobs"
import { notFound } from "next/navigation"
import Link from "next/link"

import {
  ArrowLeft,
  MapPin,
  BriefcaseBusiness,
  ChartNoAxesColumnIncreasing,
  Wallet,
  Building2,
  CalendarDays,
  Clock3,
  CheckCircle2,
  Globe,
  Bookmark,
  Sparkles,
} from "lucide-react"

import {
  EXPERIENCE_LEVELS,
  JOB_TYPES,
  WORKPLACE_TYPES,
} from "@/lib/constants/job-options"

import type { JobOption, JobFormData } from "@/lib/types/job"
import { formatDate } from "@/lib/format"
import ApplyButton from "./_components/ApplyButton"

const optionLabel = (options: JobOption[], value: string) =>
  options.find((option) => option.value === value)?.label ?? value

const BrowseDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params

  const job: JobFormData | null = await getDetailsPage(id)

  if (!job) notFound()

  const salaryText =
    job.salary ||
    [job.salaryMin, job.salaryMax].filter(Boolean).join(" – ") ||
    "Not specified"

  const skills = job.skills
    ? job.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    : []

  const details = [
    {
      label: "Salary Range",
      value: salaryText,
      icon: Wallet,
    },
    {
      label: "Location",
      value: job.location || "Not specified",
      icon: MapPin,
    },
    {
      label: "Job Type",
      value: optionLabel(JOB_TYPES, job.jobType),
      icon: BriefcaseBusiness,
    },
    {
      label: "Experience",
      value: optionLabel(EXPERIENCE_LEVELS, job.experienceLevel),
      icon: ChartNoAxesColumnIncreasing,
    },
  ]

  return (
    <main className="mt-15 min-h-screen bg-[#08080d] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Back Navigation */}
        <Link
          href="/browse-jobs"
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Browse Jobs
        </Link>

        {/* Job Header */}
        <section className="rounded-2xl border border-white/10 bg-[#131319] p-5 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#202027]">
                <Building2 size={25} className="text-[#8b83ff]" />
              </div>

              <div className="min-w-0">
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                  {job.jobTitle}
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-white/55">{job.companyName}</span>

                  <span className="text-white/20">•</span>

                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                    <CheckCircle2 size={13} />
                    Verified Employer
                  </span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <span className="rounded-lg border border-white/10 bg-white/5 p-3 text-white/60">
                <Bookmark size={17} />
              </span>
              <ApplyButton
                jobId={job._id.toString()}
                jobTitle={job.jobTitle}
              />{" "}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
          {/* Left Content */}
          <div className="min-w-0">
            {/* Job Information Cards */}
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {details.map((item) => {
                const Icon = item.icon

                return (
                  <div
                    key={item.label}
                    className="rounded-xl border border-white/10 bg-[#131319] p-4"
                  >
                    <Icon size={17} className="mb-3 text-[#8b83ff]" />

                    <p className="text-[10px] font-medium tracking-wider text-white/40 uppercase">
                      {item.label}
                    </p>

                    <p className="mt-1 text-sm font-semibold break-words text-white">
                      {item.value}
                    </p>
                  </div>
                )
              })}
            </section>

            {/* Job Description */}
            <section className="mt-4 rounded-2xl border border-white/10 bg-[#131319] p-5 sm:p-7">
              <div>
                <h2 className="text-lg font-semibold">Job Description</h2>

                <p className="mt-4 text-sm leading-7 whitespace-pre-line text-white/55">
                  {job.jobDescription || "No description provided."}
                </p>
              </div>

              {/* Skills / Requirements */}
              {skills.length > 0 && (
                <div className="mt-7 border-t border-white/10 pt-6">
                  <h2 className="text-lg font-semibold">
                    Skills & Requirements
                  </h2>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/70"
                      >
                        <Sparkles
                          size={12}
                          className="mr-1.5 inline text-[#8b83ff]"
                        />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div className="mt-7 border-t border-white/10 pt-6">
                <h2 className="text-lg font-semibold">
                  Additional Information
                </h2>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-white/5 p-2.5">
                      <CalendarDays size={17} className="text-[#8b83ff]" />
                    </div>

                    <div>
                      <p className="text-xs text-white/40">Date Posted</p>
                      <p className="mt-1 text-sm font-medium">
                        {formatDate(job.datePosted)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-white/5 p-2.5">
                      <Clock3 size={17} className="text-[#8b83ff]" />
                    </div>

                    <div>
                      <p className="text-xs text-white/40">
                        Application Deadline
                      </p>
                      <p className="mt-1 text-sm font-medium">
                        {job.applicationDeadline
                          ? formatDate(job.applicationDeadline)
                          : "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-white/5 p-2.5">
                      <BriefcaseBusiness size={17} className="text-[#8b83ff]" />
                    </div>

                    <div>
                      <p className="text-xs text-white/40">Workplace</p>
                      <p className="mt-1 text-sm font-medium">
                        {optionLabel(WORKPLACE_TYPES, job.workplaceType)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-white/5 p-2.5">
                      <Building2 size={17} className="text-[#8b83ff]" />
                    </div>

                    <div>
                      <p className="text-xs text-white/40">Category</p>
                      <p className="mt-1 text-sm font-medium">
                        {job.category || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="h-fit rounded-2xl border border-white/10 bg-[#131319] p-5 sm:p-6">
            <h2 className="text-base font-semibold">Company Overview</h2>

            {/* Company Visual */}
            <div className="mt-5 flex h-44 items-center justify-center overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-[#20202a] via-[#111923] to-[#08080d]">
              <div className="text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <Building2 size={32} className="text-[#8b83ff]" />
                </div>

                <p className="mt-3 text-sm font-semibold text-white/80">
                  {job.companyName}
                </p>
              </div>
            </div>

            {/* Company Details */}
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                <span className="text-xs text-white/40">Company</span>

                <span className="text-right text-xs font-medium text-white/80">
                  {job.companyName}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                <span className="text-xs text-white/40">Industry</span>

                <span className="text-right text-xs font-medium text-white/80">
                  {job.category || "Not specified"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                <span className="text-xs text-white/40">Location</span>

                <span className="text-right text-xs font-medium text-white/80">
                  {job.location || "Not specified"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-white/40">Job Reference</span>

                <span className="text-right text-xs font-medium text-white/80">
                  {job.ref || "N/A"}
                </span>
              </div>
            </div>

            <Link
              href="/browse-jobs"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold text-white/80 transition hover:border-[#5c53fe]/50 hover:bg-[#5c53fe]/10 hover:text-white"
            >
              Explore More Jobs
              <Globe size={14} />
            </Link>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default BrowseDetailsPage
