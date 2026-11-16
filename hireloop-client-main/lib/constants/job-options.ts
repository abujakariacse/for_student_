import type { JobOption } from "@/lib/types/job"

// Option lists shared by the "Post a new job" form and the Manage Jobs filters.

export const JOB_TYPES: JobOption[] = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
  { value: "internship", label: "Internship" },
]

export const WORKPLACE_TYPES: JobOption[] = [
  { value: "on-site", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
  { value: "remote", label: "Remote" },
]

export const EXPERIENCE_LEVELS: JobOption[] = [
  { value: "entry", label: "Entry level" },
  { value: "mid", label: "Mid level" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead / Principal" },
]

export const SALARY_PERIODS: JobOption[] = [
  { value: "month", label: "Per month" },
  { value: "year", label: "Per year" },
]

export const CATEGORY_LIST = [
  "Design",
  "Engineering",
  "Marketing",
] as const
