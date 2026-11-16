"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"

import { SearchInput } from "./SearchInput"
import { FilterSelect } from "./FilterSelect"

import { darkCardClass, monoLabelClass } from "@/lib/ui-styles"

import {
  EXPERIENCE_LEVELS,
  JOB_TYPES,
  WORKPLACE_TYPES,
} from "@/lib/constants/job-options"

import { getJobs } from "@/lib/api/jobs"
import type { JobFormData } from "@/lib/types/job"
import { JobCard } from "./JobCard"

const CATEGORY_TABS = [
  { label: "All Jobs", value: "all" },
  { label: "Engineering", value: "Engineering" },
  { label: "Design", value: "Design" },
  { label: "Marketing", value: "Marketing" },
  { label: "Content", value: "Content" },
]

export function BrowseJobs({ jobs }: { jobs: JobFormData[] }) {
  const router = useRouter()

  const [visibleJobs, setVisibleJobs] = useState(jobs)
  const [search, setSearch] = useState("")
  const [submittedSearch, setSubmittedSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [jobType, setJobType] = useState("all")
  const [workplaceType, setWorkplaceType] = useState("all")
  const [experienceLevel, setExperienceLevel] = useState("all")
  const [location, setLocation] = useState("all")

  const locations = Array.from(
    new Set(
      jobs
        .map((job) => job.location)
        .filter((item): item is string => Boolean(item))
    )
  ).sort()

  // Search submit
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmittedSearch(search.trim())
  }

  // Category and job type
  const handleCategoryChange = (value: string) => {
    setCategory(value)

    if (value !== "all") {
      setJobType("all")
    }
  }

  const handleJobTypeChange = (value: string) => {
    setJobType(value)

    if (value !== "all") {
      setCategory("all")
    }
  }

  // Fetch and filter jobs
  useEffect(() => {
    let active = true

    const params = new URLSearchParams()
    if (submittedSearch) params.set("search", submittedSearch)
    if (jobType !== "all") params.set("jobType", jobType)

    if (workplaceType !== "all") {
      params.set("workplaceType", workplaceType)
    }

    if (experienceLevel !== "all") {
      params.set("experienceLevel", experienceLevel)
    }

    if (location !== "all") {
      params.set("location", location)
    }
    const queryString = params.toString()

    router.replace(queryString ? `/browse-jobs?${queryString}` : "/browse-jobs")

    getJobs(queryString)
      .then((data) => {
        if (!active) return

        const filteredJobs = data.filter(
          (job) =>
            (category === "all" || job.category === category) &&
            (experienceLevel === "all" ||
              job.experienceLevel === experienceLevel) &&
            (location === "all" || job.location === location)
        )

        setVisibleJobs(filteredJobs)
      })
      .catch(console.error)

    return () => {
      active = false
    }
  }, [
    submittedSearch,
    category,
    jobType,
    workplaceType,
    experienceLevel,
    location,
    router,
  ])

  return (
    <div className="min-h-screen mt-5  bg-[#010109] text-white">
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mt-8">
          <p className="mb-2 text-xs font-semibold tracking-[0.25em] text-[#8b83ff] uppercase">
            Find your next opportunity
          </p>

          <h1 className="font-manrope text-3xl font-bold tracking-tight sm:text-4xl">
            Browse Jobs
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/50 sm:text-base">
            Discover opportunities that match your skills, experience, and
            career goals.
          </p>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0d0d16] p-3 sm:flex-row sm:items-center"
        >
          <div className="min-w-0 flex-1">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by job title or company..."
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-[#5c53fe] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#4940e8] sm:w-auto"
          >
            Search Jobs
          </button>
        </form>

        {/* Category Tabs */}
        <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => handleCategoryChange(tab.value)}
              className={`shrink-0 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                category === tab.value
                  ? "border-[#5c53fe] bg-[#5c53fe] text-white"
                  : "border-white/10 bg-[#0d0d16] text-white/55 hover:border-white/20 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters and Jobs */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className={`${darkCardClass} h-fit rounded-2xl p-5`}>
            <div className="flex items-center justify-between">
              <p className={monoLabelClass}>FILTERS</p>

              <button
                type="button"
                onClick={() => {
                  setCategory("all")
                  setJobType("all")
                  setWorkplaceType("all")
                  setExperienceLevel("all")
                  setLocation("all")
                  setSearch("")
                  setSubmittedSearch("")
                }}
                className="text-xs font-medium text-[#8b83ff] hover:text-white"
              >
                Reset all
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-5">
              <FilterSelect
                label="Job Type"
                value={jobType}
                onValueChange={handleJobTypeChange}
                options={JOB_TYPES}
                allLabel="All types"
              />

              <FilterSelect
                label="Workplace"
                value={workplaceType}
                onValueChange={setWorkplaceType}
                options={WORKPLACE_TYPES}
                allLabel="All workplaces"
              />

              <FilterSelect
                label="Experience"
                value={experienceLevel}
                onValueChange={setExperienceLevel}
                options={EXPERIENCE_LEVELS}
                allLabel="All levels"
              />

              <FilterSelect
                label="Location"
                value={location}
                onValueChange={setLocation}
                options={locations}
                allLabel="All locations"
              />
            </div>
          </aside>

          {/* Job Results */}
          <section className="min-w-0">
            {/* Results Header */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Available Opportunities
                </h2>

                <p className="mt-1 text-xs text-white/40">
                  Find the right role for your next career move.
                </p>
              </div>

              <span className="rounded-lg border border-white/10 bg-[#0d0d16] px-3 py-2 text-xs font-medium text-white/60">
                {visibleJobs.length} jobs found
              </span>
            </div>

            {/* Cards */}
            {visibleJobs.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {visibleJobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#0d0d16] px-5 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-2xl">
                  <span>⌕</span>
                </div>

                <h3 className="text-lg font-semibold text-white">
                  No jobs found
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-white/40">
                  We couldn't find any jobs matching your filters. Try changing
                  your search or filter options.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
