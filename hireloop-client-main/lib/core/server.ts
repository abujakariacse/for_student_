import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export const getSession = async () => {
  "use server"
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return session
}

export const requireRole = async (role: string) => {
  const session = await getSession()

  if (!session || session.user.role !== role) {
    redirect("/unauthorized")
  }

  return session
}

export const getToken = async () => {
  const session = await getSession()

  if (!session || !session.session.token) {
    redirect("/unauthorized")
  }

  return session.session.token
}

// fetch wrapper that adds the Bearer token and keeps any options
// (method, body, cache, extra headers) the caller passes in.
export const authFetch = async (api: string, init: RequestInit = {}) => {
  const token = await getToken()

  const mergedHeaders = new Headers(init.headers)
  mergedHeaders.set("authorization", `Bearer ${token}`)

  return fetch(api, {
    ...init,
    headers: mergedHeaders,
  })
}