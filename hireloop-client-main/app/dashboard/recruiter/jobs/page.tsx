import Link from "next/link"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getJobs } from "@/lib/api/jobs"
import type { JobFormData } from "@/lib/types/job"
import { ManageJobsTable } from "@/app/componets/ManageJobsTable"
import { PageHeader } from "@/app/componets/PageHeader"
import { getSession } from "@/lib/core/server"
import { pageContainerClass } from "@/lib/ui-styles"

export default async function ManageJobsPage() {

  const session = await getSession()

  const jobs: JobFormData[] = await getJobs(`recruiterId=${session?.user.id}`)

  return (
    <div className={pageContainerClass}>
      <PageHeader
        eyebrow="Recruiter · Jobs"
        title={<span className="text-white">Manage Jobs</span>}
        description="Oversee all active listings and historical job posts across the platform."
        actions={
          <Button
            render={<Link href="/dashboard/recruiter/job/new" />}
            nativeButton={false}
            className="h-10 shrink-0 rounded-lg bg-[#5c53fe] px-4 text-sm font-medium text-white shadow-[0_0_15px_rgba(92,83,254,0.35)] hover:bg-[#6c63ff]"
          >
            <PlusCircle className="size-4" aria-hidden="true" />
            Create Job
          </Button>
        }
      />

      {/* Filters + search + table — client component (in-memory filtering) */}
      <ManageJobsTable jobs={jobs} />
    </div>
  )
}
