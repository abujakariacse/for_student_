export type JobOption = {
  value: string
  label: string
}

export type JobStatus = "Active" | "Closed"

export interface JobFormData {
  _id?: string
  ref?: string
  jobTitle: string
  location: string
  recruiterId: string
  companyId?: string
  companyName: string
  jobDescription: string
  jobType: string
  workplaceType: string
  experienceLevel: string
  skills: string
  openings: string
  salaryMin: string
  salaryMax: string
  salaryPeriod: string
  applicationDeadline: string
  salary?: string
  category?: string
  status?: JobStatus
}
export type JobFormFields = JobFormData