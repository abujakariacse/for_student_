import { redirect } from "next/navigation"

import { getSession } from "@/lib/core/server"
import { getUsers } from "@/lib/actions/users"
import { PageHeader } from "@/app/componets/PageHeader"
import { pageContainerClass } from "@/lib/ui-styles"
import { UsersTable } from "./components/UsersTable"

// Admin "Users management" screen — /dashboard/admin/users
//
// The page authenticates, gates to admins and hands the user list to the
// client table (search/filter/role toggles live there).

export default async function AdminUsersPage() {
  const session = await getSession()

  if (!session?.user) {
    redirect("/sign-in")
  }

  // Only admins can view the full user list.
  if (session.user.role !== "admin") {
    redirect("/dashboard")
  }

  const users = await getUsers()

  return (
    <div className={pageContainerClass}>
      <PageHeader
        eyebrow="Admin · Users"
        title="Users"
        description="Manage every account on HireLoop — review roles and access levels."
      />

      {/* User list — client component (search, filters, role toggles) */}
      <UsersTable users={users} />
    </div>
  )
}
