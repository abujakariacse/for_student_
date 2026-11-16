"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "@/lib/auth-client"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const inputClass =
  "h-10 rounded-lg border-white/15 bg-[#101010] text-xs text-white placeholder:text-white/40 focus-visible:border-[#5c53fe]/70 focus-visible:ring-[#5c53fe]/25 sm:h-11 sm:text-sm"

const submitButtonClass =
  "flex h-10 w-full items-center justify-center rounded-lg bg-[#5c53fe] text-xs font-medium text-white shadow-[0_0_15px_rgba(92,83,254,0.35)] transition-colors hover:bg-[#6c63ff] disabled:pointer-events-none disabled:opacity-60 sm:h-11 sm:text-sm"

function Divider() {
  return (
    <div className="my-5 flex items-center gap-3">
      <span className="h-px flex-1 bg-white/10" />
      <span className="text-xs text-white/30">OR</span>
      <span className="h-px flex-1 bg-white/10" />
    </div>
  )
}

function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="alert"
      className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-300"
    >
      {children}
    </p>
  )
}

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const redirectTo = searchParams.get("redirectTo") || "/browse-jobs"

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [remember, setRemember] = React.useState(true)

  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (loading) return

    setLoading(true)
    setError(null)

    try {
      const { error: authError } = await signIn.email({
        email,
        password,
        rememberMe: remember,
      })

      if (authError) {
        setError(
          authError.message ||
            "Unable to sign in. Check your email and password."
        )
        return
      }

      router.replace(redirectTo)
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-b p-6 shadow-[0_15px_50px_rgba(0,0,0,0.55)] backdrop-blur sm:p-8">
        {/* Badge */}
        <div className="flex justify-center">
          <div className="flex h-7 items-center gap-1.5 rounded-full border border-white/20 bg-gradient-to-b from-[#303030] to-[#090909] px-3 shadow-[inset_0_0_6px_rgba(255,255,255,0.1)]">
            <span className="text-[10px]">💼</span>

            <span className="font-mono text-[9px] tracking-wider whitespace-nowrap text-white/50 uppercase">
              <strong className="text-white">50,000+</strong> jobs waiting
            </span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="mt-4 text-center font-manrope text-xl font-bold tracking-tight sm:text-2xl">
          Sign in to your account
        </h1>

        <p className="mt-1.5 text-center text-xs text-white/55 sm:text-sm">
          Access thousands of curated opportunities.
        </p>

        {/* Error */}
        {error && (
          <div className="mt-5">
            <ErrorBox>{error}</ErrorBox>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignIn} className="mt-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="signin-email" className="text-xs text-white/70">
              Email
            </Label>

            <Input
              id="signin-email"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="signin-password" className="text-xs text-white/70">
              Password
            </Label>

            <Input
              id="signin-password"
              type="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Remember Me */}
          <Label
            htmlFor="signin-remember"
            className="mt-1 w-fit cursor-pointer text-xs font-normal text-white/60"
          >
            <Checkbox
              id="signin-remember"
              checked={remember}
              onCheckedChange={(checked) => setRemember(checked === true)}
              className="size-3.5 data-checked:border-[#5c53fe] data-checked:bg-[#5c53fe]"
            />
            Remember me
          </Label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={submitButtonClass}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <Divider />

        {/* Sign Up Link */}
        <p className="mt-6 text-center text-xs text-white/50 sm:text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href={`/sign-up${
              searchParams.toString() ? `?${searchParams.toString()}` : ""
            }`}
            className="font-semibold text-[#827aff] transition-colors hover:text-white"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  )
}
