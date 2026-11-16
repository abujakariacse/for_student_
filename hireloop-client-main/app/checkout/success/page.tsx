import { auth } from "@/lib/auth"
import { checkoutVerify } from "@/lib/actions/payments"
import { stripe } from "@/lib/stripe"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { ArrowRight, BadgeCheck, Mail } from "lucide-react"
import Link from "next/link"
import CopyButton from "./copy-button"

// Stripe Checkout return page — verifies the session server-side and shows
// a receipt: amount, status, and copyable identifiers (transaction id comes
// from the expanded payment_intent).

interface SuccessSearchParams {
  session_id?: string
}

interface SuccessProps {
  searchParams: Promise<SuccessSearchParams>
}

export default async function Success({ searchParams }: SuccessProps) {
  const { session_id } = await searchParams

  if (!session_id)
    throw new Error("Please provide a valid session_id (cs_test_...)")

  const {
    status,
    payment_status,
    customer_email,
    amount_total,
    currency,
    payment_intent,
    subscription,
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent", "subscription"],
  })

  if (status === "open") {
    return redirect("/")
  }

  if (!(status === "complete" && payment_status === "paid")) {
    return redirect("/")
  }

  // Expanded objects carry the canonical ids — fall back to raw strings if
  // Stripe ever returns them unexpanded.
  const transactionId =
    typeof payment_intent === "object" && payment_intent !== null
      ? payment_intent.id
      : typeof payment_intent === "string"
        ? payment_intent
        : null

  const subscriptionId =
    typeof subscription === "string" ? subscription : subscription?.id

  // Personalize the return links based on the signed-in user's role.
  const session = await auth.api.getSession({ headers: await headers() })
  const dashboardHref =
    session?.user?.role === "recruiter"
      ? "/dashboard/recruiter"
      : "/dashboard/seeker"

  const result = await checkoutVerify(session_id)
  console.log({ result })

  const paid = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency?.toUpperCase() || "USD",
  }).format((amount_total || 0) / 100)

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 py-12 text-white">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#101014] p-6 shadow-[0_15px_50px_rgba(0,0,0,0.55)] sm:p-8">
        {/* Success icon */}
        <div className="flex justify-center">
          <div className="relative flex size-16 items-center justify-center rounded-full border border-[#22c55e]/40 bg-[#22c55e]/10">
            <span className="absolute inset-0 rounded-full bg-[#22c55e]/10 blur-md" />

            <BadgeCheck className="relative size-8 text-[#22c55e]" aria-hidden="true" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="mt-4 text-center font-manrope text-2xl font-bold tracking-tight sm:text-[28px]">
          Payment successful!
        </h1>

        <p className="mt-1.5 text-center text-sm text-white/55">
          Thanks for upgrading — your Pro plan is now active.
        </p>

        {/* Amount */}
        <div className="mt-6 rounded-xl border border-[#22c55e]/25 bg-[#22c55e]/[0.06] p-4 text-center">
          <p className="text-xs text-white/50">Total paid</p>

          <p className="mt-1 font-manrope text-3xl font-bold tracking-tight text-[#22c55e]">
            {paid}
          </p>
        </div>

        {/* Receipt details */}
        <section
          aria-label="Payment details"
          className="mt-5 rounded-xl border border-white/10 bg-[#141418]"
        >
          <DetailRow label="Payment status" labelClass="text-white/50">
            <span className="rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 px-2.5 py-0.5 text-xs font-medium text-[#22c55e] capitalize">
              {payment_status}
            </span>
          </DetailRow>

          <DetailRow label="Customer email" labelClass="text-white/50">
            <span className="break-all text-sm text-white/85">
              {customer_email || "Not available"}
            </span>
          </DetailRow>

          {/* Transaction ID — from the expanded payment_intent */}
          <DetailRow label="Transaction ID" labelClass="text-white/50" stacked>
            {transactionId ? (
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0d0d10] p-3">
                <p className="flex-1 truncate font-mono text-xs text-[#22c55e]">
                  {transactionId}
                </p>

                <CopyButton text={transactionId} />
              </div>
            ) : (
              <p className="text-sm text-white/40">Not available</p>
            )}
          </DetailRow>

          {subscriptionId ? (
            <DetailRow label="Subscription ID" labelClass="text-white/50" stacked>
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0d0d10] p-3">
                <p className="flex-1 truncate font-mono text-xs text-white/70">
                  {subscriptionId}
                </p>

                <CopyButton text={subscriptionId} />
              </div>
            </DetailRow>
          ) : null}

          <div className="p-4">
            <p className={detailLabelClass}>Checkout session</p>

            <p className="mt-1.5 font-mono text-[11px] break-all text-white/35">
              {session_id}
            </p>
          </div>
        </section>

        {/* Actions */}
        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          <Link
            href={dashboardHref}
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#5c53fe] text-sm font-medium text-white shadow-[0_0_15px_rgba(92,83,254,0.35)] transition hover:bg-[#6c63ff]"
          >
            Go to dashboard
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>

          <Link
            href="/browse-jobs"
            className="flex h-10 flex-1 items-center justify-center rounded-lg border border-white/10 bg-transparent text-sm font-medium text-white/70 transition hover:border-white/30 hover:text-white"
          >
            Browse jobs
          </Link>
        </div>

        {/* Footer note */}
        <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-[11px] text-white/35">
          <Mail className="size-3.5" aria-hidden="true" />
          A confirmation email will be sent to your email address.
        </p>
      </div>
    </main>
  )
}

const detailLabelClass = "text-xs text-white/50"

function DetailRow({
  label,
  labelClass,
  stacked = false,
  children,
}: {
  label: string
  labelClass?: string
  stacked?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={
        stacked
          ? "border-b border-white/[0.06] p-4"
          : "flex items-center justify-between gap-4 border-b border-white/[0.06] p-4"
      }
    >
      <span className={`text-xs ${labelClass ?? ""}`}>{label}</span>

      {children}
    </div>
  )
}
