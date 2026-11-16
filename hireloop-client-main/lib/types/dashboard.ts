import type { LucideIcon } from "lucide-react"

// Dashboard types shared between the sidebar and any role-gated page.

export type Role = "seeker" | "recruiter" | "admin"

export interface MenuItem {
  name: string
  url: string
  icon: LucideIcon
}
