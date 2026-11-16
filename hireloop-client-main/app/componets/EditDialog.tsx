"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import { toast } from "@/components/ui/toast"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { JobFormData } from "@/lib/types/job"
import { updateJob } from "@/lib/actions/jobs"
import { useRouter } from "next/navigation"

export function EditJobDialog({ job }: { job: JobFormData }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<JobFormData>({
    ...job,
  })
  const router = useRouter()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: name === "openings" ? Number(value) : value,
    })
  }

  const handleSubmit = async () => {
    setLoading(true)

    

    try {
      await updateJob(job._id, formData)
      setOpen(false)
    } catch {
      toast.add({ title: "Failed to update job", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger type="button" className="rounded-md p-2 hover:bg-white/10">
        <Pencil className="h-4 w-4" />
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto border-white/10 bg-[#111114] text-white">
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm">Job Reference</label>
            <Input name="ref" value={formData.ref} onChange={handleChange} />
          </div>

          <div>
            <label className="mb-2 block text-sm">Job Title</label>
            <Input
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">Company Name</label>
            <Input
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">Location</label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">Job Description</label>
            <Textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">Job Type</label>
            <Input
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">Workplace Type</label>
            <Input
              name="workplaceType"
              value={formData.workplaceType}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">Experience Level</label>
            <Input
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">Category</label>
            <Input
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">Salary</label>
            <Input
              name="salary"
              value={formData.salary}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">Required Skills</label>
            <Textarea
              name="skills"
              value={formData.skills}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">Number of Openings</label>
            <Input
              type="number"
              name="openings"
              value={formData.openings}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">Job Status</label>
            <Input
              name="status"
              value={formData.status}
              onChange={handleChange}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#5c53fe] hover:bg-[#4b42e8]"
          >
            {loading ? "Updating..." : "Update Job"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
