import type { JobStatus } from "@/lib/types/job"

// Small format/normalize helpers shared across dashboard pages.

export function formatDate(iso: string) {
  if (!iso) return "N/A"

  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

/**
 * The API may return the status in different casings ("Closed", "closed",
 * "CLOSED") or omit it entirely — normalize so filters and badges agree.
 */
export function normalizeStatus(raw: string | undefined): JobStatus {
  return raw?.trim().toLowerCase() === "closed" ? "Closed" : "Active"
}

/** "2 hours ago", "1 day ago", "2 weeks ago" — for the My Applications date column. */
export function formatRelativeDate(iso: string) {
  if (!iso) return "N/A"

  const date = new Date(iso.length === 10 ? iso + "T00:00:00" : iso)
  if (Number.isNaN(date.getTime())) return "N/A"

  // timestamp values (full ISO) get hour/minute granularity first
  if (iso.length > 10) {
    const diffMs = Date.now() - date.getTime()
    if (diffMs >= 0) {
      const minutes = Math.floor(diffMs / 60_000)
      if (minutes < 1) return "Just now"
      if (minutes < 60) return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`

      const hours = Math.floor(diffMs / 3_600_000)
      if (hours < 24) return hours === 1 ? "1 hour ago" : `${hours} hours ago`
    }
  }

  const startOfDay = (value: Date) =>
    new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime()

  const dayDiff = Math.round(
    (startOfDay(new Date()) - startOfDay(date)) / 86_400_000
  )

  if (dayDiff <= 0) return "Today"
  if (dayDiff === 1) return "Yesterday"
  if (dayDiff === 7) return "1 week ago"
  if (dayDiff < 30 && dayDiff % 7 === 0) return `${dayDiff / 7} weeks ago`
  if (dayDiff < 30) return `${dayDiff} days ago`

  const monthDiff = Math.round(dayDiff / 30.44)
  if (monthDiff < 12) return monthDiff === 1 ? "1 month ago" : `${monthDiff} months ago`

  const yearDiff = Math.round(dayDiff / 365.25)
  return yearDiff === 1 ? "1 year ago" : `${yearDiff} years ago`
}
