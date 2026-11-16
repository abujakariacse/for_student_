"use client"

import Link from "next/link"
import { CalendarDays, MapPin, BriefcaseBusiness } from "lucide-react"

import type { JobFormData, JobOption } from "@/lib/types/job"
import {
  EXPERIENCE_LEVELS,
  JOB_TYPES,
  WORKPLACE_TYPES,
} from "@/lib/constants/job-options"

import { formatDate } from "@/lib/format"
import { darkCardClass, monoLabelClass } from "@/lib/ui-styles"
import { CategoryBadge, StatusBadge } from "@/app/browse-jobs/components/badges"

const optionLabel = (options: JobOption[], value: string) =>
  options.find((option) => option.value === value)?.label ?? value

/** Dark job card used in the Browse Jobs listing. */
export function JobCard({ job }: { job: JobFormData }) {
  const salaryText =
    job.salary || [job.salaryMin, job.salaryMax].filter(Boolean).join(" – ")

  const tags = [
    optionLabel(JOB_TYPES, job.jobType),
    optionLabel(WORKPLACE_TYPES, job.workplaceType),
    optionLabel(EXPERIENCE_LEVELS, job.experienceLevel),
  ].filter(Boolean)

  return (
    <Link href={`/browse-jobs/${job._id}`} className="block h-full">
      <article
        className={`${darkCardClass} group flex h-full flex-col rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#5c53fe]/50 hover:shadow-[0_12px_35px_rgba(92,83,254,0.08)] sm:p-6`}
      >
        {/* Company + Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#222228] text-xs font-semibold text-[#ededef]">
              {(job.companyName || "?").charAt(0).toUpperCase()}
            </span>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {job.companyName}
              </p>
              <p className={`mt-1 ${monoLabelClass}`}>{job.ref}</p>
            </div>
          </div>

          <div className="shrink-0">
            <StatusBadge status={job.status} />
          </div>
        </div>

        {/* Job Title */}
        <div className="mt-6">
          <h3 className="font-manrope text-lg leading-snug font-bold text-white transition-colors group-hover:text-[#aaa5ff] sm:text-xl">
            {job.jobTitle}
          </h3>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/50">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              {job.location}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <BriefcaseBusiness className="size-3.5" />
              {optionLabel(JOB_TYPES, job.jobType)}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#a0a0ab]">
          {job.jobDescription}
        </p>

        {/* Attribute Pills */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {salaryText && <CategoryBadge category={salaryText} />}

          {tags.map((tag, index) => (
            <CategoryBadge key={`${tag}-${index}`} category={tag} />
          ))}

          {job.category && <CategoryBadge category={job.category} />}
        </div>

        {/* Footer */}
        <footer className="mt-auto">
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/10 pt-4 text-xs text-white/45">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />
              Posted {formatDate(job.datePosted)}
            </span>

            {job.applicationDeadline && (
              <span>Apply by {formatDate(job.applicationDeadline)}</span>
            )}
          </div>
        </footer>
      </article>
    </Link>
  )
}
