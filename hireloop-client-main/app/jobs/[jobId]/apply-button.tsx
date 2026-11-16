"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, SendHorizonal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { useSession } from "@/lib/auth-client"
import {
  createApplication,
  getApplicationForJob,
  getApplicationsCount,
} from "@/lib/actions/applications"
import type { JobFormData } from "@/lib/types/job"
import { normalizeStatus } from "@/lib/format"

/**
 * Apply Now — submits an application document to the database.
 * Requires a signed-in seeker; one application per seeker per job.
 */
/** Free-plan cap — the 11th application requires the Pro upgrade. */
const FREE_APPLICATION_LIMIT = 10

export function ApplyButton({ job }: { job: JobFormData }) {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  const [loading, setLoading] = useState(false)
  const [applied, setApplied] = useState(false)

  const user = session?.user
  const isClosed = normalizeStatus(job.status) === "Closed"

  // Reflect already-submitted applications after a page reload.
  useEffect(() => {
    if (!user?.id) return
    let active = true

    getApplicationForJob(job._id, user.id).then((existing) => {
      if (active && existing) setApplied(true)
    })

    return () => {
      active = false
    }
  }, [job._id, user?.id])

  const handleApply = async () => {
    if (isPending || loading) return

    if (!user) {
      router.push(`/sign-in?redirectTo=/jobs/${job._id}`)
      return
    }

    if (user.role !== "seeker") {
      toast.add({
        title: "Only job seekers can apply",
        type: "warning",
      })
      return
    }

    setLoading(true)

    try {
      // Free plan: once the seeker has hit the cap, send them to payment.
      const { count } = await getApplicationsCount(user.id)

      if (count >= FREE_APPLICATION_LIMIT) {
        setLoading(false)
        toast.add({
          title: "Free application limit reached",
          description: `You've applied to ${FREE_APPLICATION_LIMIT} jobs. Upgrade to HireLoop Pro to keep applying.`,
          type: "warning",
        })
        router.push("/payment")
        return
      }

      const result = await createApplication({
        jobId: job._id,
        jobRef: job.ref || "",
        jobTitle: job.jobTitle,
        companyName: job.companyName,
        location: job.location || "",
        jobType: job.jobType || "",
        workplaceType: job.workplaceType || "",

        applicantId: user.id,
        applicantName: user.name || "",
        applicantEmail: user.email || "",
      })

      if (result?.alreadyApplied) {
        setApplied(true)
        toast.add({
          title: "You already applied to this job",
          type: "info",
        })
        return
      }

      setApplied(true)
      toast.add({
        title: "Application submitted",
        description: "Track it in My Applications.",
        type: "success",
      })
    } catch {
      toast.add({ title: "Failed to submit application", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  if (applied) {
    return (
      <Button
        size="lg"
        disabled
        className="w-full rounded-xl border border-[#22c55e]/40 bg-[#22c55e]/10 text-sm font-semibold text-[#22c55e]"
      >
        <CheckCircle2 className="size-4" aria-hidden="true" />
        Application submitted
      </Button>
    )
  }

  return (
    <Button
      size="lg"
      onClick={handleApply}
      disabled={isPending || loading || isClosed}
      className="w-full rounded-xl bg-[#5c53fe] text-sm font-semibold text-white shadow-[0_0_15px_rgba(92,83,254,0.35)] transition hover:bg-[#4940e8] disabled:opacity-50"
    >
      {isClosed ? (
        "Applications closed"
      ) : loading ? (
        "Submitting…"
      ) : (
        <>
          <SendHorizonal className="size-4" aria-hidden="true" />
          Apply Now
        </>
      )}
    </Button>
  )
}
