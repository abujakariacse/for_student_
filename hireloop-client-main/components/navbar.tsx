"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon, LogOut } from "lucide-react"

import logo from "@/app/images/logo.png"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { authClient } from "@/lib/auth-client"

const linkClass =
  "relative text-xs font-semibold text-neutral-300 transition-colors hover:text-white lg:text-sm"

export function Navbar() {
  const [open, setOpen] = React.useState(false)
  const [signingOut, setSigningOut] = React.useState(false)

  const { data: session, isPending } = authClient.useSession()
  const pathname = usePathname()

  // Dashboard has its own sidebar layout
  if (pathname.startsWith("/dashboard")) {
    return null
  }

  const navLinks = [
    { href: "/browse-jobs", label: "Browse Jobs" },
    {
      href: `/dashboard/${session?.user.role || "seeker"}`,
      label: "Dashboard",
    },
  ]
  // Active route checker
  const isActiveLink = (href: string) => {
    return (
      pathname === href || (href !== "/" && pathname.startsWith(href + "/"))
    )
  }

  async function handleSignOut() {
    if (signingOut) return

    setSigningOut(true)

    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            setOpen(false)
          },
        },
      })
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <header className="absolute inset-x-0 top-0 z-50 w-full px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
      <div className="mx-auto flex h-11 max-w-6xl items-center justify-between rounded-xl border border-white/[0.08] bg-[#1a1a1e]/90 py-2.5 pr-2.5 pl-4 shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-md sm:h-12">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src={logo}
            alt="HireLoop"
            width={150}
            height={38}
            priority
            className="h-7 w-auto object-contain sm:h-8"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-4 md:flex lg:gap-6">
          <nav className="flex items-center gap-4 lg:gap-6">
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.href)

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${linkClass} ${
                    isActive
                      ? "text-white after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-[#786fff]"
                      : ""
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <Separator orientation="vertical" className="h-4 bg-white/20" />

          {isPending ? (
            <div className="h-8 w-24 animate-pulse rounded-lg bg-white/10" />
          ) : session ? (
            <>
              <p className="text-xs font-medium text-neutral-300 lg:text-sm">
                Welcome,{" "}
                <span className="font-bold text-white">
                  {session.user?.name}
                </span>
              </p>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-white/15 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-white/10 disabled:opacity-50 lg:text-sm"
              >
                <LogOut className="size-3.5" />
                {signingOut ? "Signing out..." : "Sign Out"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-xs font-semibold text-[#786fff] transition-colors hover:text-[#a39dff] lg:text-sm"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="inline-flex h-8 items-center justify-center rounded-lg bg-[#5c53fe] px-3.5 text-xs font-semibold text-white shadow-[0_0_15px_rgba(92,83,254,0.3)] transition-all hover:bg-[#6c63ff] lg:text-sm"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <button
                type="button"
                aria-label="Open navigation menu"
                className="flex size-9 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 md:hidden"
              />
            }
          >
            <MenuIcon className="size-5" />
          </SheetTrigger>

          <SheetContent
            side="right"
            className="z-[9999] border-white/10 bg-[#111113] text-white"
          >
            <SheetHeader>
              <SheetTitle className="text-left text-white">
                HireLoop Menu
              </SheetTitle>
            </SheetHeader>

            <nav className="mt-6 flex flex-col gap-2 px-2">
              {navLinks.map((link) => {
                const isActive = isActiveLink(link.href)

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-lg px-3 py-3 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-white/10 text-white underline decoration-[#786fff] decoration-2 underline-offset-8"
                        : "text-neutral-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}

              <Separator className="my-2 bg-white/10" />

              {isPending ? (
                <div className="mx-3 h-10 animate-pulse rounded-lg bg-white/10" />
              ) : session ? (
                <>
                  <p className="px-3 py-2 text-sm font-medium text-neutral-300">
                    Welcome,{" "}
                    <span className="font-bold text-white">
                      {session.user?.name}
                    </span>
                  </p>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="mt-2 flex w-full items-center gap-2 rounded-lg border border-white/15 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 disabled:opacity-50"
                  >
                    <LogOut className="size-4" />
                    {signingOut ? "Signing out..." : "Sign Out"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-3 text-sm font-semibold text-[#827aff] transition-colors hover:bg-white/10"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/sign-up"
                    onClick={() => setOpen(false)}
                    className="mt-2 flex items-center justify-center rounded-lg bg-[#5c53fe] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#6c63ff]"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
