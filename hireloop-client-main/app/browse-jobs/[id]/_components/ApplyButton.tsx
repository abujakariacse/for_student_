"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowUpRight } from "lucide-react"
import { toast } from "sonner"

import { useSession } from "@/lib/auth-client"
import { applyToJob } from "@/lib/actions/jobs"
import { getApplicationsCount } from "@/lib/actions/applications"
import { getUserPremiumById } from "@/lib/api/users-client"

const ApplyButton = ({
  jobId,
  jobTitle,
}: {
  jobId: string
  jobTitle: string
}) => {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [loading, setLoading] = useState(false)

  const user = session?.user

  const handleApply = async () => {
    if (!user) {
      toast.error("Please sign in to apply")
      router.push(`/sign-in?redirectTo=/browse-jobs/${jobId}`)
      return
    }

    if (user.role !== "seeker") {
      toast.warning("Only job seekers can apply")
      return
    }

    try {
      setLoading(true)

      // is premium user
      const premiumResult = await getUserPremiumById(user.id)
      console.log(premiumResult)

      const countResult = await getApplicationsCount(user.id)

      if (!premiumResult.premium && countResult.count >= 2) {
        toast.warning("You've reached your free application limit")
        router.push("/payment")
        return
      }

      const application = {
        jobId,
        userId: user.id,
        email: user.email,
        jobTitle,
      }

      const res = await applyToJob(application)

      if (res.insertedId) {
        toast.success("Application submitted successfully!")
        router.push("/browse-jobs")
      } else {
        toast.error("Application failed. Please try again.")
      }
    } catch (error) {
      console.error("Application error:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleApply}
      disabled={isPending || loading}
      className="rounded-lg bg-[#5c53fe] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4940e8] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Applying..." : "Apply Now"}
      <ArrowUpRight size={15} className="ml-1 inline" />
    </button>
  )
}

export default ApplyButton
