import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { getSession } from "@/lib/core/server"
import { getDetailsPage } from "@/lib/api/jobs"
import { getApplicationsForJob } from "@/lib/actions/applications"
import { PageHeader } from "@/app/componets/PageHeader"
import { pageContainerClass } from "@/lib/ui-styles"
import type { JobFormData } from "@/lib/types/job"
import { ApplicantsTable } from "./components/ApplicantsTable"

// Recruiter "review applicants" screen for one job posting:
// /dashboard/recruiter/jobs/[jobId]/applications
//
// The page authenticates, loads the job (404 if it doesn't exist) and hands
// everything to the client table — mirroring the seeker applications page.

export default async function JobApplicationsPage({
  params,
}: {
  params: Promise<{ jobId: string }>
}) {
  const { jobId } = await params

  const session = await getSession()

  if (!session?.user) {
    redirect("/sign-in")
  }

  const job = (await getDetailsPage(jobId)) as JobFormData | null

  if (!job?._id) notFound()

  const applications = await getApplicationsForJob(jobId)

  return (
    <div className={pageContainerClass}>
      <Link
        href="/dashboard/recruiter/jobs"
        className="inline-flex items-center gap-1.5 text-sm text-white/85 transition-colors hover:text-white"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to jobs
      </Link>

      <div className="mt-4">
        <PageHeader
          eyebrow={`Job ref · ${job.ref || "—"}`}
          title={<span className="text-white">{job.jobTitle}</span>}
          description={`${job.companyName} · ${job.location}`}
        />
      </div>

      {/* Applicant list — client component (search + status dropdowns) */}
      <ApplicantsTable applications={applications} />
    </div>
  )
}
