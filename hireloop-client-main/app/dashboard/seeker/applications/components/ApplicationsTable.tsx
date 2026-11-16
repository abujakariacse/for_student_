"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  Bell,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  CloudCog,
  Code2,
  Database,
  Download,
  Mail,
  MapPin,
  PenTool,
  Search,
} from "lucide-react"

import type { Application } from "@/lib/types/application"
import { formatRelativeDate } from "@/lib/format"

// Based on the `My Applications` dashboard screen in the Figma file:
// top search bar → title + Active/Archived/Export controls → stats row →
// application table (icon, job title, company, applied, status, details)
// → footer with result count and pagination.

const PAGE_SIZE = 5

type ApplicationsTableProps = {
  applications: Application[]
  user?: { name?: string | null; email?: string | null; image?: string | null }
}

// Status pill colors — Figma: Applied gray, Review amber,
// Shortlisted blue, Rejected red, Offered green.
const statusStyles: Record<string, string> = {
  applied: "border-white/15 bg-white/[0.06] text-white/80",
  "under review": "border-[#f59e0b]/30 bg-[#f59e0b]/10 text-[#f59e0b]",
  shortlisted: "border-[#3b82f6]/40 bg-[#3b82f6]/10 text-[#3b82f6]",
  rejected: "border-[#ef4444]/30 bg-[#ef4444]/10 text-[#ef4444]",
  offered: "border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e]",
}

const statusLabel = (status: string) =>
  status === "Under Review" ? "Review" : status

// Row icons cycle through a small neutral set, like the Figma mock.
const rowIcons = [Code2, PenTool, Database, CloudCog, BriefcaseBusiness]

export function ApplicationsTable({
  applications,
  user,
}: ApplicationsTableProps) {
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState<"active" | "archived">("active")
  const [page, setPage] = useState(1)

  // Stats row — Figma: Total Applied / Shortlisted / Interviews / Success Rate.
  const stats = useMemo(() => {
    const total = applications.length
    const shortlisted = applications.filter(
      (a) => a.status === "Shortlisted"
    ).length
    const interviews = applications.filter(
      (a) => a.status === "Under Review"
    ).length
    const offered = applications.filter((a) => a.status === "Offered").length

    return {
      total,
      shortlisted,
      interviews,
      successRate: total ? Math.round((offered / total) * 100) : 0,
    }
  }, [applications])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return applications

    return applications.filter(
      (application) =>
        application.jobTitle?.toLowerCase().includes(query) ||
        application.companyName?.toLowerCase().includes(query) ||
        application.jobRef?.toLowerCase().includes(query)
    )
  }, [applications, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paged =
    tab === "archived"
      ? [] // archived applications aren't tracked yet
      : filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const rangeStart = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const rangeEnd = Math.min(safePage * PAGE_SIZE, filtered.length)

  const switchTab = (next: "active" | "archived") => {
    setTab(next)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-[#010109] text-white">
      {/* Top bar — Figma: search left, bell / mail / avatar right */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="relative w-full max-w-xs">
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-white/75"
              aria-hidden="true"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              placeholder="Search applications..."
              aria-label="Search applications"
              className="h-9 w-full rounded-lg border border-white/10 bg-transparent pr-4 pl-10 text-sm text-white outline-none placeholder:text-white/70 focus:border-[#5c53fe]/60"
            />
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              aria-label="Notifications"
              className="flex size-8 items-center justify-center rounded-lg text-white/85 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Bell className="size-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              aria-label="Messages"
              className="flex size-8 items-center justify-center rounded-lg text-white/85 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Mail className="size-4" aria-hidden="true" />
            </button>

            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt=""
                className="size-8 rounded-full border border-white/10 object-cover"
              />
            ) : (
              <span className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-[#222228] text-xs font-semibold text-white">
                {(user?.name || user?.email || "?").charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {/* Header — title + subtitle left, Active/Archived + Export right */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-manrope text-2xl font-bold tracking-tight sm:text-[28px]">
              My Applications
            </h1>

            <p className="mt-1 text-sm text-white/85">
              Track your job applications and interview progress in real-time.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {/* Active / Archived segmented control */}
            <div className="flex items-center rounded-lg border border-white/10 bg-[#16161a] p-1">
              {(["active", "archived"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => switchTab(key)}
                  className={
                    "rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors " +
                    (tab === key
                      ? "bg-white/10 text-white"
                      : "text-white/85 hover:text-white")
                  }
                >
                  {key}
                </button>
              ))}
            </div>

            {/* Export PDF — Figma: white button with download icon */}
            <button
              type="button"
              className="flex h-9 items-center gap-2 rounded-lg bg-white px-3.5 text-xs font-semibold text-[#010109] transition-colors hover:bg-white/85"
            >
              <Download className="size-4" aria-hidden="true" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Total Applied",
              value: stats.total,
              className: "text-white",
            },
            {
              label: "Shortlisted",
              value: stats.shortlisted,
              className: "text-white",
            },
            {
              label: "Interviews",
              value: stats.interviews,
              className: "text-[#f59e0b]",
            },
            {
              label: "Success Rate",
              value: `${stats.successRate}%`,
              className: "text-[#22c55e]",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/10 bg-[#0d0d10] p-4"
            >
              <p className="text-sm text-white/85">{stat.label}</p>
              <p
                className={`mt-1 font-manrope text-3xl font-bold tracking-tight ${stat.className}`}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Application list card */}
        {applications.length === 0 ? (
          <EmptyState />
        ) : (
          <section className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-[#0d0d10]">
            {/* Desktop table */}
            <div className="hidden min-w-0 lg:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-xs text-white/75">
                    <th className="px-6 py-3.5 font-medium">Job Title</th>
                    <th className="px-6 py-3.5 font-medium">Company</th>
                    <th className="px-6 py-3.5 font-medium">Applied</th>
                    <th className="px-6 py-3.5 font-medium">Status</th>
                    <th className="px-6 py-3.5 text-right font-medium">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  {paged.map((application, index) => {
                    const Icon = rowIcons[index % rowIcons.length]
                    const subtitle =
                      [application.jobType, application.workplaceType]
                        .filter(Boolean)
                        .join(" • ") || application.location

                    return (
                      <tr
                        key={application._id}
                        className="transition-colors hover:bg-white/[0.02]"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#16161a] text-white/70">
                              <Icon className="size-4" aria-hidden="true" />
                            </span>

                            <div className="min-w-0">
                              <p className="truncate font-medium text-white">
                                {application.jobTitle}
                              </p>
                              {subtitle ? (
                                <p className="mt-0.5 truncate text-xs text-white/75">
                                  {subtitle}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-white">
                          {application.companyName}
                        </td>

                        <td className="px-6 py-4 text-white/85">
                          {formatRelativeDate(application.dateApplied)}
                        </td>

                        <td className="px-6 py-4">
                          <StatusPill status={application.status} />
                        </td>

                        <td className="px-6 py-4 text-right">
                          <ViewDetailsLink jobId={application.jobId} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {paged.length === 0 ? <NoResults /> : null}
            </div>

            {/* Tablet + mobile cards */}
            <div className="flex flex-col divide-y divide-white/5 lg:hidden">
              {paged.map((application, index) => {
                const Icon = rowIcons[index % rowIcons.length]
                const subtitle =
                  [application.jobType, application.workplaceType]
                    .filter(Boolean)
                    .join(" • ") || application.location

                return (
                  <article key={application._id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#16161a] text-white/70">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>

                        <div className="min-w-0">
                          <p className="truncate font-medium text-white">
                            {application.jobTitle}
                          </p>
                          {subtitle ? (
                            <p className="mt-0.5 truncate text-xs text-white/75">
                              {subtitle}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <StatusPill status={application.status} />
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="min-w-0 truncate text-xs text-white/85">
                        <span className="text-white">
                          {application.companyName}
                        </span>
                        {" · Applied "}
                        {formatRelativeDate(application.dateApplied)}
                      </p>

                      <ViewDetailsLink jobId={application.jobId} />
                    </div>
                  </article>
                )
              })}

              {paged.length === 0 ? <NoResults /> : null}
            </div>

            {/* Footer — result count + pagination */}
            <div className="flex flex-col gap-3 border-t border-white/10 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-white/85">
                {tab === "archived" ? (
                  "No archived applications"
                ) : filtered.length === 0 ? (
                  "No matching applications"
                ) : (
                  <>
                    Showing {rangeStart}-{rangeEnd} of {filtered.length}{" "}
                    {filtered.length === 1 ? "application" : "applications"}
                  </>
                )}
              </p>

              {tab === "active" && totalPages > 1 ? (
                <Pagination
                  page={safePage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              ) : null}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={
        "inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-medium " +
        (statusStyles[(status || "").toLowerCase()] ??
          "border-white/10 bg-white/5 text-white/85")
      }
    >
      {statusLabel(status)}
    </span>
  )
}

function ViewDetailsLink({ jobId }: { jobId: string }) {
  return (
    <Link
      href={`/jobs/${jobId}`}
      className="inline-flex shrink-0 items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
    >
      Details
    </Link>
  )
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  const arrowClass =
    "flex size-8 items-center justify-center rounded-lg border border-white/10 text-white/85 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className={arrowClass}
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
      </button>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            aria-current={pageNumber === page ? "page" : undefined}
            className={
              "flex size-8 items-center justify-center rounded-lg border text-sm transition-colors " +
              (pageNumber === page
                ? "border-white/20 bg-white/10 font-semibold text-white"
                : "border-white/10 text-white/85 hover:bg-white/10 hover:text-white")
            }
          >
            {pageNumber}
          </button>
        )
      )}

      <button
        type="button"
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className={arrowClass}
      >
        <ChevronRight className="size-4" aria-hidden="true" />
      </button>
    </div>
  )
}

function NoResults() {
  return (
    <p className="px-6 py-10 text-center text-sm text-white/75">
      No matching applications found.
    </p>
  )
}

function EmptyState() {
  return (
    <div className="mt-5 flex flex-col items-center rounded-xl border border-white/10 bg-[#0d0d10] px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-[#222228]">
        <MapPin className="size-5 text-white/75" aria-hidden="true" />
      </span>

      <h2 className="mt-4 font-manrope text-lg font-semibold">
        No applications yet
      </h2>

      <p className="mt-1.5 max-w-sm text-sm text-white/85">
        When you apply to a job, your submission shows up here with its current
        status.
      </p>

      <Link
        href="/browse-jobs"
        className="mt-5 inline-flex h-10 items-center rounded-lg bg-[#5c53fe] px-5 text-sm font-medium text-white shadow-[0_0_15px_rgba(92,83,254,0.35)] transition hover:bg-[#6c63ff]"
      >
        Browse jobs
      </Link>
    </div>
  )
}
