"use client"

import { useMemo, useState } from "react"
import { Search, ShieldCheck, Users } from "lucide-react"

import { toast } from "@/components/ui/toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RoleBadge } from "@/app/browse-jobs/components/badges"
import { formatDate } from "@/lib/format"
import type { Role } from "@/lib/types/dashboard"
import type { User } from "@/lib/types/user"
import {
  darkCardClass,
  monoLabelClass,
  rowHoverClass,
  searchInputClass,
  selectClass,
} from "@/lib/ui-styles"
import { updateUserRole } from "@/lib/actions/users"

// Admin "Users management" table — modeled on the Figma users-management
// screen. Role changes here are optimistic/local only; persisting them is
// intentionally not wired up yet (see handleRoleChange).

const ROLES: Role[] = ["seeker", "recruiter", "admin"]

type UsersTableProps = {
  users: User[]
}

export function UsersTable({ users }: UsersTableProps) {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all")
  const [pillFilter, setPillFilter] = useState<Role | "all">("all")
  const [rows, setRows] = useState(users)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    const role = pillFilter

    return rows.filter((user) => {
      if (role !== "all" && user.role !== role) return false

      if (query) {
        const haystack = `${user.name ?? ""} ${user.email ?? ""}`.toLowerCase()
        if (!haystack.includes(query)) return false
      }

      return true
    })
  }, [rows, search, pillFilter])

  // Pipeline snapshot — small stat strip above the table.
  const stats = useMemo(() => {
    const byRole = (role: Role) => rows.filter((u) => u.role === role).length

    return {
      total: rows.length,
      seekers: byRole("seeker"),
      recruiters: byRole("recruiter"),
      admins: byRole("admin"),
    }
  }, [rows])

  // Optimistic role change — local rows only; the database write is not
  // wired yet. When the backend lands, call the update API here and
  // reconcile any server errors with the local rows.
  const handleRoleChange = async (id: string, role: Role) => {
    setRows((prev) =>
      prev.map((row) => (row._id === id ? { ...row, role: role } : row))
    )
    const res = await updateUserRole(id, role)

    // TODO(role-update): persist via the API.
    if (res.modifiedCount > 0) {
      toast.add({
        title: `Role set to ${role}`,
        description: "Database persistence coming soon.",
        type: "info",
      })
    }
  }

  return (
    <>
      {/* Stats row */}
      <div className="mt-6 grid grid-cols-1 gap-3 text-white sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Users", value: stats.total },
          { label: "Seekers", value: stats.seekers },
          { label: "Recruiters", value: stats.recruiters },
          { label: "Admins", value: stats.admins },
        ].map((stat) => (
          <div key={stat.label} className={`${darkCardClass} bg-[#0d0d10] p-4`}>
            <p className="text-sm text-[#b2b2bd]">{stat.label}</p>

            <p className="mt-1 font-manrope text-3xl font-bold tracking-tight">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters + search */}
      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-2">
          <p className={monoLabelClass}>Role</p>

          <Select
            value={roleFilter}
            onValueChange={(value) => setRoleFilter(value as Role | "all")}
          >
            <SelectTrigger className={selectClass}>
              <SelectValue>
                {roleFilter === "all"
                  ? "All Roles"
                  : roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1)}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>

              {ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quick filter */}
        <div className="flex flex-col gap-2">
          <p className={monoLabelClass}>Quick filter</p>

          <div className="flex w-fit items-center gap-1 rounded-lg border border-white/10 bg-[#0d0d10] p-1.5">
            {(
              [
                ["all", `All (${stats.total})`],
                ["seeker", `Seekers (${stats.seekers})`],
                ["recruiter", `Recruiters (${stats.recruiters})`],
                ["admin", `Admins (${stats.admins})`],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setPillFilter(value)}
                className={
                  "flex h-8 items-center rounded-md px-4 text-xs font-medium transition-colors " +
                  (pillFilter === value
                    ? "bg-[#5c53fe] text-white"
                    : "text-white/85 hover:text-white")
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mt-6">
        <Search
          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-white/65"
          aria-hidden="true"
        />

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name or email…"
          aria-label="Search users"
          className={`${searchInputClass} bg-[#0d0d10]`}
        />
      </div>

      {/* Users table */}
      <section className={`${darkCardClass} mt-6 overflow-hidden`}>
        {rows.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden min-w-0 lg:block">
              <div className="grid grid-cols-[1.6fr_1.2fr_0.8fr_0.8fr_1fr_1.2fr] items-center border-b border-white/[0.07] bg-[#1a1a1f] px-5 py-4">
                {[
                  "User",
                  "Role",
                  "Verified",
                  "Plan",
                  "Joined",
                  "Change role",
                ].map((title) => (
                  <span
                    key={title}
                    className="text-xs font-medium tracking-wide text-white uppercase"
                  >
                    {title}
                  </span>
                ))}
              </div>

              {filtered.map((user) => (
                <UserRow
                  key={user._id}
                  user={user}
                  onRoleChange={handleRoleChange}
                />
              ))}

              {filtered.length === 0 ? <NoMatches /> : null}
            </div>

            {/* Mobile cards */}
            <div className="flex flex-col divide-y divide-white/[0.07] lg:hidden">
              {filtered.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  onRoleChange={handleRoleChange}
                />
              ))}

              {filtered.length === 0 ? <NoMatches /> : null}
            </div>
          </>
        )}
      </section>

      {rows.length > 0 ? (
        <p className="mt-4 px-1 text-xs text-white/70">
          Showing {filtered.length} of {rows.length} users
        </p>
      ) : null}
    </>
  )
}

/** One table row — the role select toggles seeker / recruiter / admin. */
function UserRow({
  user,
  onRoleChange,
}: {
  user: User
  onRoleChange: (userId: string, next: Role) => void
}) {
  return (
    <div
      className={
        "grid grid-cols-[1.6fr_1.2fr_0.8fr_0.8fr_1fr_1.2fr] items-center border-t border-white/[0.07] px-5 py-4 first:border-t-0 " +
        rowHoverClass
      }
    >
      <UserIdentity user={user} />

      <RoleBadge role={user.role} />

      <VerifiedMark verified={user.emailVerified} />

      <PlanMark premium={user.premium} />

      <span className="text-sm text-white">
        {formatDate(user.createdAt)}
      </span>

      <div className="flex justify-end">
        <RoleControl user={user} onRoleChange={onRoleChange} />
      </div>
    </div>
  )
}

function UserCard({
  user,
  onRoleChange,
}: {
  user: User
  onRoleChange: (userId: string, next: Role) => void
}) {
  return (
    <article className={"p-5 sm:p-6 " + rowHoverClass}>
      <div className="flex items-start justify-between gap-4">
        <UserIdentity user={user} />

        <RoleBadge role={user.role} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white">
        <VerifiedMark verified={user.emailVerified} />

        <PlanMark premium={user.premium} />

        <span>Joined {formatDate(user.createdAt)}</span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-3">
        <span className="text-xs text-white">Change role</span>

        <RoleControl user={user} onRoleChange={onRoleChange} />
      </div>
    </article>
  )
}

function UserIdentity({ user }: { user: User }) {
  const name = user.name || "Unknown"

  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#222228] text-xs font-semibold text-white">
        {name.charAt(0).toUpperCase()}
      </span>

      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white">{name}</p>

        <p className="truncate text-xs text-white/75">{user.email}</p>
      </div>
    </div>
  )
}

function VerifiedMark({ verified }: { verified: boolean }) {
  return (
    <span
      className={
        "flex w-fit items-center gap-1.5 text-xs " +
        (verified ? "text-[#22c55e]" : "text-white/70")
      }
      title={verified ? "Email verified" : "Email not verified"}
    >
      <ShieldCheck className="size-4" aria-hidden="true" />
      {verified ? "Yes" : "No"}
    </span>
  )
}

function PlanMark({ premium }: { premium?: boolean }) {
  return (
    <span
      className={
        "inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium " +
        (premium
          ? "border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e]"
          : "border-white/10 bg-white/[0.04] text-white/80")
      }
    >
      {premium ? "Premium" : "Free"}
    </span>
  )
}

/** The toggleable role button — switches the account between the 3 roles. */
function RoleControl({
  user,
  onRoleChange,
}: {
  user: User
  onRoleChange: (userId: string, next: Role) => void
}) {
  return (
    <Select
      value={user.role}
      onValueChange={(next) => {
        if (!next || next === user.role) return

        onRoleChange(user._id, next)
      }}
    >
      <SelectTrigger
        className="h-8 w-32 rounded-lg border-white/10 bg-[#0d0d10] px-2 text-xs text-white capitalize"
        aria-label={`Change role for ${user.email}`}
      >
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {ROLES.map((role) => (
          <SelectItem key={role} value={role} className="capitalize">
            {role}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function NoMatches() {
  return (
    <p className="px-5 py-10 text-center text-sm text-white/80">
      No users match the current search.
    </p>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center px-5 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-[#222228]">
        <Users className="size-5 text-white/75" aria-hidden="true" />
      </span>

      <h2 className="mt-4 font-manrope text-lg font-semibold">
        No users found
      </h2>

      <p className="mt-1.5 max-w-sm text-sm text-white/85">
        New accounts will show up here as soon as they sign up.
      </p>
    </div>
  )
}
