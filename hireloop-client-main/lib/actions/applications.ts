'use server'
import type { Application, ApplicationInput } from "@/lib/types/application"
import { authFetch } from "../core/server"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// Create application
export const createApplication = async (data: ApplicationInput) => {
  const response = await authFetch(`${BASE_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    cache: "no-store",
  })

  return response.json()
}

// Update application status (recruiter)
export const updateApplications = async (
  id: string,
  data: { status: string }
) => {
  const res = await authFetch(`${BASE_URL}/applications/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    cache: "no-store",
  })

  return res.json()
}

// Get all applications
export const getApplications = async (query = "") => {
  const api = `${BASE_URL}/applications?${query}`

  const response = await authFetch(api, { cache: "no-store" })
  return response.json()
}

// Get applications count
export const getApplicationsCount = async (query = "") => {
  const response = await authFetch(`${BASE_URL}/applications/count?${query}`, {
    cache: "no-store",
  })

  return response.json()
}

// Check existing application
export const getApplicationForJob = async (
  jobId: string,
  applicantId: string
): Promise<Application | null> => {
  const response = await authFetch(
    `${BASE_URL}/applications?jobId=${encodeURIComponent(jobId)}&applicantId=${encodeURIComponent(applicantId)}`,
    { cache: "no-store" }
  )

  if (!response.ok) return null

  const list: Application[] = await response.json()

  return list[0] ?? null
}

// Get every application for one job — the recruiter "review applicants"
// screen reads this. The API matches jobId stored as string or ObjectId.
export const getApplicationsForJob = async (
  jobId: string
): Promise<Application[]> => {
  const url = `${BASE_URL}/applications?jobId=${encodeURIComponent(jobId)}`

  console.log("[getApplicationsForJob] called:", url)

  try {
    const response = await authFetch(url, { cache: "no-store" })

    if (!response.ok) {
      console.error(
        "[getApplicationsForJob] failed:",
        response.status,
        await response.text()
      )
      return []
    }

    const data = await response.json()

    console.log(
      "[getApplicationsForJob] received:",
      Array.isArray(data) ? `${data.length} applications` : typeof data
    )

    return Array.isArray(data) ? data : []
  } catch (error) {
    // Let Next.js redirect()/notFound() errors pass through
    const digest = (error as { digest?: string })?.digest
    if (typeof digest === "string" && digest.startsWith("NEXT_")) {
      throw error
    }

    console.error("[getApplicationsForJob] error:", error)
    return []
  }
}