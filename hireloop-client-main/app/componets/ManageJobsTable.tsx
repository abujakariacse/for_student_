"use client"

import { useState } from "react"
import { CalendarDays, Eye, Search, Users } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { DeleteJobDialog } from "@/app/componets/DeleteDialog"
import { EditJobDialog } from "@/app/componets/EditDialog"
import {
  StatusBadge,
  CategoryBadge,
  CompanyAvatar,
} from "@/app/browse-jobs/components/badges"
import type { JobFormData } from "@/lib/types/job"
import { formatDate, normalizeStatus } from "@/lib/format"
import { CATEGORY_LIST } from "@/lib/constants/job-options"
import {
  darkCardClass,
  ghostIconButtonClass,
  monoLabelClass,
  rowHoverClass,
  searchInputClass,
  selectClass,
} from "@/lib/ui-styles"
import Link from "next/link"

function ActionButtons({ job }: { job: JobFormData }) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <Link
        href={`/dashboard/recruiter/jobs/${job._id}/applications`}
        className={
          "flex size-8 items-center justify-center rounded-md " +
          ghostIconButtonClass
        }
        aria-label="View applications"
        title="View applications"
      >
        <Users size={16} />
      </Link>

      <Link
        href={`/dashboard/recruiter/jobs/${job._id}`}
        className={
          "flex size-8 items-center justify-center rounded-md " +
          ghostIconButtonClass
        }
        aria-label="View job"
      >
        <Eye size={16} />
      </Link>

      <EditJobDialog job={job} />

      <DeleteJobDialog job={job} />
    </div>
  )
}

export function ManageJobsTable({ jobs }: { jobs: JobFormData[] }) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [pillFilter, setPillFilter] = useState<"all" | "Active" | "Closed">(
    "all"
  )

  const filtered = jobs.filter((job) => {
    const q = search.trim().toLowerCase()
    const jobStatus = normalizeStatus(job.status)

    if (pillFilter !== "all" && jobStatus !== pillFilter) return false

    if (statusFilter === "active" && jobStatus !== "Active") return false
    if (statusFilter === "closed" && jobStatus !== "Closed") return false

    if (categoryFilter !== "all" && job.category !== categoryFilter)
      return false

    if (q) {
      const haystack = [
        job.jobTitle,
        job.ref,
        job.companyName,
        job.category,
        job.jobType,
      ]
        .join(" ")
        .toLowerCase()

      if (!haystack.includes(q)) return false
    }

    return true
  })

  const activeCount = jobs.filter(
    (job) => normalizeStatus(job.status) === "Active"
  ).length
  const closedCount = jobs.filter(
    (job) => normalizeStatus(job.status) === "Closed"
  ).length

  return (
    <>
      {/* Filters */}
      <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <p className={monoLabelClass}>Status</p>

            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as string)}
            >
              <SelectTrigger className={selectClass}>
                <SelectValue>
                  {statusFilter === "all"
                    ? "All Statuses"
                    : statusFilter === "active"
                      ? "Active"
                      : "Closed"}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <p className={monoLabelClass}>Category</p>

            <Select
              value={categoryFilter}
              onValueChange={(value) => setCategoryFilter(value as string)}
            >
              <SelectTrigger className={selectClass}>
                <SelectValue>
                  {categoryFilter === "all" ? "All Categories" : categoryFilter}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>

                {CATEGORY_LIST.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Filter */}
        <div className="flex flex-col gap-2">
          <p className={monoLabelClass}>Quick filter</p>

          <div className="flex w-fit items-center gap-1 rounded-lg border border-white/10 bg-[#0d0d10] p-1.5">
            {(
              [
                ["all", "All"],
                ["Active", `Active (${activeCount})`],
                ["Closed", `Closed (${closedCount})`],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setPillFilter(value)}
                className={
                  "flex h-8 items-center rounded-md px-4 text-xs font-medium transition-colors " +
                  (pillFilter === value
                    ? "bg-[#5c53fe] text-white"
                    : "text-white/85 hover:text-white")
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mt-6">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-white/65" />

        <Input
          type="search"
          placeholder="Search by job title, ref, or company…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={searchInputClass}
        />
      </div>

      {/* Jobs Table */}
      {/* Jobs Table */}
      <section className={`${darkCardClass} mt-6 overflow-hidden`}>
        {/* Desktop Table */}
        <div className="hidden min-w-0 lg:block">
          <div className="grid grid-cols-[1.6fr_1.3fr_1fr_0.8fr_1fr_1fr_0.9fr_0.9fr] items-center border-b border-white/[0.07] bg-[#1a1a1f] px-5 py-4">
            {[
              "Title",
              "Company",
              "Category",
              "Type",
              "Deadline",
              "Status",
              "Actions",
            ].map((title) => (
              <span
                key={title}
                className="text-xs font-medium tracking-wide text-white uppercase"
              >
                {title}
              </span>
            ))}
          </div>

          {filtered.map((jobItem) => (
            <div
              key={jobItem._id || jobItem.ref}
              className={
                "grid grid-cols-[1.6fr_1.3fr_1fr_0.8fr_1fr_1fr_0.9fr_0.9fr] items-center border-t border-white/[0.07] px-5 py-4 first:border-t-0 " +
                rowHoverClass
              }
            >
              <div className="flex min-w-0 flex-col gap-1">
                <span className="truncate text-sm font-medium text-white">
                  {jobItem.jobTitle}
                </span>
              </div>

              <CompanyAvatar name={jobItem.companyName} />

              <CategoryBadge category={jobItem.category ?? "Uncategorized"} />

              <span className="text-sm text-white">{jobItem.jobType}</span>

              <span className="text-sm text-white">
                {jobItem.applicationDeadline
                  ? formatDate(jobItem.applicationDeadline)
                  : "—"}
              </span>

              <StatusBadge status={normalizeStatus(jobItem.status)} />

              <div className="flex justify-end pr-1">
                <ActionButtons job={jobItem} />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Cards */}
        <div className="flex flex-col divide-y divide-white/[0.07] lg:hidden">
          {filtered.map((jobItem) => (
            <article
              key={jobItem._id || jobItem.ref}
              className={"p-5 sm:p-6 " + rowHoverClass}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 flex-col gap-1">
                  <h3 className="truncate text-sm font-semibold text-white">
                    {jobItem.jobTitle}
                  </h3>
                </div>

                <StatusBadge status={normalizeStatus(jobItem.status)} />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3 text-xs text-white">
                <CompanyAvatar name={jobItem.companyName} />

                <CategoryBadge category={jobItem.category ?? "Uncategorized"} />

                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" />
                  Deadline:{" "}
                  {jobItem.applicationDeadline
                    ? formatDate(jobItem.applicationDeadline)
                    : "—"}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-3">
                <span className="text-xs text-white">
                  {jobItem.jobType} · {jobItem.workplaceType}
                </span>

                <ActionButtons job={jobItem} />
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-white/80">
            {jobs.length === 0
              ? "No job posts found."
              : "No job posts match the current filters."}
          </div>
        )}
      </section>

      {/* Result Count */}
      <p className="mt-4 px-1 text-xs text-white/70">
        Showing {filtered.length} of {jobs.length} job posts
      </p>
    </>
  )
}
