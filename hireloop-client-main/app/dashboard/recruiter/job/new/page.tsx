"use client"
import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, PlusCircle } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { JobFormFields } from "@/lib/types/job"
import { createJob } from "@/lib/actions/jobs"
import {
  CATEGORY_LIST,
  EXPERIENCE_LEVELS,
  JOB_TYPES,
  SALARY_PERIODS,
  WORKPLACE_TYPES,
} from "@/lib/constants/job-options"
import { darkCardClass, inputClass, textareaClass } from "@/lib/ui-styles"
import { useSession } from "@/lib/auth-client"

export const initialForm: JobFormFields = {
  jobTitle: "",
  location: "",
  recruiterId: "",
  companyName: "",
  category: "",
  jobDescription: "",
  jobType: "full-time",
  workplaceType: "on-site",
  experienceLevel: "mid",
  skills: "",
  openings: "1",
  salaryMin: "",
  salaryMax: "",
  salaryPeriod: "month",
  applicationDeadline: "",
}

export default function CreateJobPage() {
  const { data: session, isPending } = useSession()

  const router = useRouter()
  const [form, setForm] = React.useState<JobFormFields>(initialForm)

  const setField = <K extends keyof JobFormFields>(
    field: K,
    value: JobFormFields[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!session?.user.id) return

    const result = await createJob({
      ...form,
      recruiterId: session.user.id,
    })
    console.log("Created job:", result)

    if (result.success) {
      router.push("/dashboard/recruiter/jobs")
    }

    if (
      !result.success &&
      result.message ===
        "Free plan allows only 2 job postings. Upgrade to Premium."
    ) {
      router.push("/payment")
      return
    }
  }

  if (isPending) return <p>Loading...</p>

  return (
    <div className="min-h-screen bg-[#010109] text-white">
      {/* Top app bar — Figma Header / TopAppBar (border-b white/10) */}
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-white/10 bg-[#010109]/95 px-4 sm:px-6">
        <Link
          href="/dashboard/recruiter"
          className="flex size-8 items-center justify-center rounded-lg text-white/85 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
        </Link>
        <p className="font-manrope text-sm font-semibold">Create Job Post</p>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Welcome header — Figma "Section - Welcome Header → Heading 1" pattern */}
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-[#827aff] uppercase">
          <PlusCircle className="size-3.5" aria-hidden="true" />
          New Job
        </div>
        <h1 className="mt-3 font-manrope text-2xl font-bold tracking-tight sm:text-3xl">
          Post a new job
        </h1>
        <p className="mt-1.5 text-sm text-white">
          Describe the role so the right candidates can find it.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Job details card — Figma dashboard cards: #141418 + white/10 border */}
          <section className={`${darkCardClass} p-5 sm:p-6`}>
            <h2 className="font-manrope text-base font-semibold">
              Job details
            </h2>

            <div className="mt-5 space-y-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="job-title" className="text-xs text-white/70">
                  Job title
                </Label>
                <Input
                  id="job-title"
                  name="jobTitle"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={form.jobTitle}
                  onChange={(e) => setField("jobTitle", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-white/70">Category</Label>
                <Select
                  value={form.category ?? ""}
                  onValueChange={(value) =>
                    setField("category", value as string)
                  }
                >
                  <SelectTrigger className={inputClass}>
                    <SelectValue>
                      {form.category || "Select category"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_LIST.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="company-name" className="text-xs text-white/70">
                  Company name
                </Label>
                <Input
                  id="company-name"
                  name="companyName"
                  placeholder="e.g. Acme Technologies"
                  value={form.companyName}
                  onChange={(e) => setField("companyName", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="job-description"
                  className="text-xs text-white/70"
                >
                  Job description
                </Label>
                <Textarea
                  id="job-description"
                  name="jobDescription"
                  placeholder="What the day-to-day looks like, the team, the impact…"
                  rows={4}
                  value={form.jobDescription}
                  onChange={(e) => setField("jobDescription", e.target.value)}
                  className={textareaClass}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-white/70">Job type</Label>
                  <Select
                    value={form.jobType}
                    onValueChange={(value) =>
                      setField("jobType", value as string)
                    }
                  >
                    <SelectTrigger className={inputClass}>
                      <SelectValue>
                        {JOB_TYPES.find((o) => o.value === form.jobType)
                          ?.label ?? "Select job type"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {JOB_TYPES.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-white/70">
                    Workplace type
                  </Label>
                  <Select
                    value={form.workplaceType}
                    onValueChange={(value) =>
                      setField("workplaceType", value as string)
                    }
                  >
                    <SelectTrigger className={inputClass}>
                      <SelectValue>
                        {WORKPLACE_TYPES.find(
                          (o) => o.value === form.workplaceType
                        )?.label ?? "Select workplace type"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {WORKPLACE_TYPES.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="location" className="text-xs text-white/70">
                    Location{" "}
                    <span className="text-[10px] text-white/75">
                      (hidden for remote)
                    </span>
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g. Dhaka, Bangladesh"
                    value={form.location}
                    onChange={(e) => setField("location", e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-white/70">
                    Experience level
                  </Label>
                  <Select
                    value={form.experienceLevel}
                    onValueChange={(value) =>
                      setField("experienceLevel", value as string)
                    }
                  >
                    <SelectTrigger className={inputClass}>
                      <SelectValue>
                        {EXPERIENCE_LEVELS.find(
                          (o) => o.value === form.experienceLevel
                        )?.label ?? "Select experience level"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {EXPERIENCE_LEVELS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </section>

          {/* Requirements card */}
          <section className={`${darkCardClass} p-5 sm:p-6`}>
            <h2 className="font-manrope text-base font-semibold">
              Requirements
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="skills" className="text-xs text-white/70">
                  Skills{" "}
                  <span className="text-[10px] text-white/75">
                    (comma separated)
                  </span>
                </Label>
                <Input
                  id="skills"
                  name="skills"
                  placeholder="React, TypeScript, Tailwind CSS"
                  value={form.skills}
                  onChange={(e) => setField("skills", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="openings" className="text-xs text-white/70">
                  Openings
                </Label>
                <Input
                  id="openings"
                  name="openings"
                  type="number"
                  min={1}
                  value={form.openings}
                  onChange={(e) => setField("openings", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label
                  htmlFor="application-deadline"
                  className="text-xs text-white/70"
                >
                  Application deadline
                </Label>
                <Input
                  id="application-deadline"
                  name="applicationDeadline"
                  type="date"
                  value={form.applicationDeadline}
                  onChange={(e) =>
                    setField("applicationDeadline", e.target.value)
                  }
                  className={inputClass + " [color-scheme:dark] sm:w-1/2"}
                />
              </div>
            </div>
          </section>

          {/* Compensation card */}
          <section className={`${darkCardClass} p-5 sm:p-6`}>
            <h2 className="font-manrope text-base font-semibold">
              Compensation
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="salary-min" className="text-xs text-white/70">
                  Salary min ($)
                </Label>
                <Input
                  id="salary-min"
                  name="salaryMin"
                  type="number"
                  min={0}
                  placeholder="5000"
                  value={form.salaryMin}
                  onChange={(e) => setField("salaryMin", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="salary-max" className="text-xs text-white/70">
                  Salary max ($)
                </Label>
                <Input
                  id="salary-max"
                  name="salaryMax"
                  type="number"
                  min={0}
                  placeholder="8000"
                  value={form.salaryMax}
                  onChange={(e) => setField("salaryMax", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-white/70">Salary period</Label>
                <Select
                  value={form.salaryPeriod}
                  onValueChange={(value) =>
                    setField("salaryPeriod", value as string)
                  }
                >
                  <SelectTrigger className={inputClass}>
                    <SelectValue>
                      {SALARY_PERIODS.find((o) => o.value === form.salaryPeriod)
                        ?.label ?? "Select period"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {SALARY_PERIODS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              className="h-10 border-white/15 bg-white/[0.04] text-sm text-white/85 hover:bg-white/10"
            >
              Save draft
            </Button>
            <Button
              type="submit"
              className="h-10 rounded-lg bg-[#5c53fe] px-5 text-sm font-medium text-white shadow-[0_0_15px_rgba(92,83,254,0.35)] hover:bg-[#6c63ff]"
            >
              Publish job
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
