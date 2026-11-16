"use client"
import {
  Bookmark,
  Briefcase,
  Building2,
  FileText,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Settings,
  Users,
  Wallet,
} from "lucide-react"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"
import type { MenuItem, Role } from "@/lib/types/dashboard"
import Image from "next/image"
import logo from "@/app/images/logo.png"

// Based on the `HL 2.0/Sidebar` component in the Figma file (Role variants)
const menuItemsByRole: Record<Role, MenuItem[]> = {
  seeker: [
    { name: "Dashboard", url: "/dashboard/seeker", icon: LayoutDashboard },
    { name: "Jobs", url: "/dashboard/seeker/jobs", icon: Briefcase },
    { name: "Saved Jobs", url: "/dashboard/seeker/saved-jobs", icon: Bookmark },
    {
      name: "Applications",
      url: "/dashboard/seeker/applications",
      icon: FileText,
    },
    { name: "Billing", url: "/dashboard/seeker/billing", icon: Wallet },
    { name: "Settings", url: "/dashboard/seeker/settings", icon: Settings },
  ],
  recruiter: [
    { name: "Dashboard", url: "/dashboard/recruiter", icon: LayoutDashboard },
    {
      name: "My Company",
      url: "/dashboard/recruiter/company",
      icon: Building2,
    },
    { name: "Add Job", url: "/dashboard/recruiter/job/new", icon: PlusCircle },
    { name: "Manage Jobs", url: "/dashboard/recruiter/jobs", icon: Briefcase },
    {
      name: "Applications",
      url: "/dashboard/recruiter/applications",
      icon: FileText,
    },
    { name: "Settings", url: "/dashboard/recruiter/settings", icon: Settings },
  ],
  admin: [
    { name: "Dashboard", url: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Users", url: "/dashboard/admin/users", icon: Users },
    { name: "Companies", url: "/dashboard/admin/companies", icon: Building2 },
    { name: "Jobs", url: "/dashboard/admin/jobs", icon: Briefcase },
    { name: "Payments", url: "/dashboard/admin/payments", icon: Wallet },
    { name: "Settings", url: "/dashboard/admin/settings", icon: Settings },
  ],
}

const logoutItem = {
  name: "Logout",
  url: "/",
  icon: LogOut,
}

// Brand block at the top of the sidebar — logo mark + product name + role chip.
function SidebarBrand({ role }: { role: Role }) {
  return (
    <Link href="/">
      <div className="flex items-center gap-2.5 px-2 py-1">
        <div className="min-w-0 flex-1">
          <Image
            src={logo}
            alt="HireLoop Logo"
            width={96}
            height={96}
            className="object-contain"
          />
          <p className="truncate text-[10px] tracking-[0.18em] text-white/70 uppercase">
            {role} portal
          </p>
        </div>
      </div>
    </Link>
  )
}

// Signed-in user card pinned above the logout action.
function SidebarUserCard({
  user,
}: {
  user: { name?: string | null; email?: string | null; image?: string | null }
}) {
  const name = user.name || user.email || "Account"
  const initials = name.charAt(0).toUpperCase()

  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-white/[0.07] bg-white/[0.03] p-2.5">
      {user.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.image}
          alt=""
          className="size-8 shrink-0 rounded-full border border-white/10 object-cover"
        />
      ) : (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#222228] text-xs font-semibold text-white">
          {initials}
        </span>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-white">{name}</p>

        <p className="truncate text-[11px] text-white/75">{user.email}</p>
      </div>
    </div>
  )
}

export function DashboardSidebar() {
  const { data: session, isPending } = authClient.useSession()
  const pathname = usePathname()

  if (isPending) {
    return <Sidebar />
  }

  const userRole = session?.user?.role

  const role: Role =
    userRole === "recruiter"
      ? "recruiter"
      : userRole === "admin"
        ? "admin"
        : "seeker"

  console.log("role:", role)
  console.log("session:", session)

  // Highlight the menu item for the page the user is on. The role's
  // dashboard link matches exactly; everything else matches by prefix so
  // nested pages (e.g. /dashboard/recruiter/jobs/123/applications) keep
  // their parent item lit.
  const isItemActive = (item: MenuItem) =>
    item.url === `/dashboard/${role}`
      ? pathname === item.url
      : pathname.startsWith(item.url)

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarGroup>
          <SidebarBrand role={role} />
        </SidebarGroup>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-mono text-[10px] tracking-[0.2em] text-white/70 uppercase">
            Menu
          </SidebarGroupLabel>

          <SidebarMenu>
            {menuItemsByRole[role]?.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  render={<Link href={item.url} />}
                  isActive={isItemActive(item)}
                  tooltip={item.name}
                >
                  <item.icon />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarUserCard user={session?.user ?? {}} />

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href={logoutItem.url} />}
                tooltip={logoutItem.name}
                className="text-white/85 hover:text-white data-active:text-white"
              >
                <logoutItem.icon />
                <span>{logoutItem.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}
