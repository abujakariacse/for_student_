"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"
import type { JobFormData } from "@/lib/types/job"

import { useState } from "react"
import { toast } from "@/components/ui/toast"
import { useRouter } from 'next/navigation'
import { deleteJob } from "@/lib/actions/jobs"

export function DeleteJobDialog({ job }: { job: JobFormData }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    const res = await deleteJob(job._id)
    console.log(`Deleting job with ID: ${job._id}`, res)

    if (res.deletedCount > 0) {
      setOpen(false)
      toast.add({
        title: "Job deleted",
      })
        router.refresh()
    }
  }



  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        aria-label="Delete job"
        className="inline-flex size-8 items-center justify-center rounded-md p-2 text-white/85 transition-colors hover:bg-[#ef4444]/10 hover:text-[#f87171]"
      >
        <Trash2 className="size-4" />
      </AlertDialogTrigger>

      <AlertDialogContent className="border-white/10 bg-[#141418] text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold text-white">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-white">
            This action cannot be undone. This will permanently delete this job
            post
            {job._id ? ` (Ref: ${job._id})` : ""} and remove its data from our
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="border-white/10 bg-transparent text-white hover:bg-white/10 hover:text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-[#ef4444] text-white hover:bg-[#dc2626]"
          >
            Yes, delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
