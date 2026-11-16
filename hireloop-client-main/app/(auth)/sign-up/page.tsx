
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signUp } from "@/lib/auth-client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  BriefcaseBusiness,
  ShieldCheck,
  UserSearch,
} from "lucide-react";

const roles = [
  { value: "seeker", label: "Seeker", icon: UserSearch },
  { value: "recruiter", label: "Recruiter", icon: BriefcaseBusiness },
  { value: "admin", label: "Admin", icon: ShieldCheck },
] as const;

const inputClass =
  "h-10 rounded-lg border-white/15 bg-[#101010] text-xs text-white placeholder:text-white/40 focus-visible:border-[#5c53fe]/70 focus-visible:ring-[#5c53fe]/25 sm:h-11 sm:text-sm";

const submitButtonClass =
  "flex h-10 w-full items-center justify-center rounded-lg bg-[#5c53fe] text-xs font-medium text-white shadow-[0_0_15px_rgba(92,83,254,0.35)] transition-colors hover:bg-[#6c63ff] disabled:pointer-events-none disabled:opacity-60 sm:h-11 sm:text-sm";

function Divider() {
  return (
    <div className="my-5 flex items-center gap-3">
      <span className="h-px flex-1 bg-white/10" />
      <span className="h-px flex-1 bg-white/10" />
    </div>
  );
}

function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="alert"
      className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-300"
    >
      {children}
    </p>
  );
}

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirectTo") || "/";

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState<"seeker" | "recruiter" | "admin">(
    "seeker"
  );

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setError(null);

    if (password.length <= 6) {
      setError("Password must be at least 7 characters.");
      return;
    }

    setLoading(true);

    try {
      const { error: authError } = await signUp.email({
        name,
        email,
        password,
        role,
      });

      if (authError) {
        setError(authError.message ?? "Unable to create your account.");
        return;
      }

      router.replace(redirectTo);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center  px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-b p-6 shadow-[0_15px_50px_rgba(0,0,0,0.55)] backdrop-blur sm:p-8">
        {/* Badge */}
        <div className="flex justify-center">
          <div className="flex h-7 items-center gap-1.5 rounded-full border border-white/20 bg-gradient-to-b from-[#303030] to-[#090909] px-3 shadow-[inset_0_0_6px_rgba(255,255,255,0.1)]">
            <span className="text-[10px]">💼</span>

            <span className="font-mono text-[9px] tracking-wider whitespace-nowrap text-white/50 uppercase">
              <strong className="text-white">100% free</strong> forever plan
            </span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="mt-4 text-center font-manrope text-xl font-bold tracking-tight sm:text-2xl">
          Create your account
        </h1>

        <p className="mt-1.5 text-center text-xs text-white/55 sm:text-sm">
          Join over 2M job seekers already on HireLoop.
        </p>

        {/* Error */}
        {error && (
          <div className="mt-5">
            <ErrorBox>{error}</ErrorBox>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="signup-name" className="text-xs text-white/70">
              Full name
            </Label>

            <Input
              id="signup-name"
              type="text"
              name="name"
              required
              autoComplete="name"
              placeholder="Jane Cooper"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Account Type */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-white/70">Account type</Label>

            <div
              role="radiogroup"
              aria-label="Account type"
              className="grid grid-cols-3 gap-2"
            >
              {roles.map((option) => (
                <label key={option.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value={option.value}
                    checked={role === option.value}
                    onChange={() => setRole(option.value)}
                    className="peer sr-only"
                  />

                  <span
                    className={
                      "flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-center transition-colors " +
                      (role === option.value
                        ? "border-[#5c53fe] bg-[#5c53fe]/10 text-white"
                        : "border-white/15 bg-[#101010] text-white/60 hover:border-white/30")
                    }
                  >
                    <option.icon className="size-4" />

                    <span className="text-[11px] leading-none font-medium">
                      {option.label}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="signup-email" className="text-xs text-white/70">
              Email
            </Label>

            <Input
              id="signup-email"
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

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="signup-password" className="text-xs text-white/70">
              Password
            </Label>

            <Input
              id="signup-password"
              type="password"
              name="password"
              required
              minLength={7}
              autoComplete="new-password"
              placeholder="At least 7 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={submitButtonClass}
          >
            {loading ? "Creating account…" : "Get Started"}
          </button>
        </form>

        <Divider />

        {/* Terms */}
        <p className="mt-5 text-center text-[10px] leading-relaxed text-white/35 sm:text-[11px]">
          By creating an account you agree to HireLoop&apos;s Terms of Service
          and Privacy Policy.
        </p>

        {/* Sign In Link */}
        <p className="mt-4 text-center text-xs text-white/50 sm:text-sm">
          Already have an account?{" "}
          <Link
            href={`/sign-in${searchParams.toString() ? `?${searchParams.toString()}` : ""}`}
            className="font-semibold text-[#827aff] transition-colors hover:text-white"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
