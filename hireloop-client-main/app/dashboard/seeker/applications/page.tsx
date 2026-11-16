import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { getApplications } from "@/lib/actions/applications"
import { ApplicationsTable } from "./components/ApplicationsTable"



export default async function MyApplicationsPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect("/sign-in")
  }

  const applications = await getApplications(session.user.id)

  return (
    <ApplicationsTable
      applications={applications}
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image ?? null,
      }}
    />
  )
}
