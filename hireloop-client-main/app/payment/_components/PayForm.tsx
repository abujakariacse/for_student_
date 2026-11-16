"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "@/components/ui/toast"
import { useSession } from "@/lib/auth-client"

import { ArrowLeft, CreditCard, Link2, Lock } from "lucide-react"
import PayButton from "./PayButton"

const sectionLabelClass =
  "font-mono text-[10px] tracking-[0.14em] text-white/45 uppercase"
const SEEKER_PRICE = 20
const RECRUITER_PRICE = 79
const BDT_RATE = 127.6666

export default function PayForm() {
  const [currency, setCurrency] = React.useState<"BDT" | "USD">("BDT")
  const [paying, setPaying] = React.useState(false)

  const { data: session } = useSession()

  const role = session?.user?.role

  const isRecruiter = role === "recruiter"

  const planName = isRecruiter ? "Recruiter Pro Plan" : "Seeker Pro Plan"

  const USD_PRICE = isRecruiter ? RECRUITER_PRICE : SEEKER_PRICE

  const amount =
    currency === "BDT"
      ? `BDT ${(USD_PRICE * BDT_RATE).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : `$${USD_PRICE.toFixed(2)}`

  async function handlePay(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (paying) return
    setPaying(true)

    const formData = new FormData(event.currentTarget)

    const response = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
      }),
    })

    const data = await response.json()
    console.log("Checkout API error:", data)

    if (response.ok && data.url) {
      toast.add({
        title: "Success!",
        description: "Redirecting to Stripe Checkout...",
        type: "success",
      })

      window.location.href = data.url
    } else {
      toast.add({
        title: "Payment failed",
        description: data.error || "Something went wrong",
        type: "error",
      })

      setPaying(false)
    }
  }
  return (
    <main className="mt-19 flex min-h-screen flex-col bg-[#0a0a0a] text-white">
      {/* Top bar — back + secure lock left, sandbox badge right */}
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/browse-jobs"
            aria-label="Go back"
            className="flex size-9 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </Link>

          <span
            aria-label="Secure checkout"
            className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-[#141414]"
          >
            <Lock className="size-4 text-white/70" aria-hidden="true" />
          </span>
        </div>

        <span className="rounded-md border border-white/15 bg-[#141414] px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-white/55 uppercase">
          Sandbox
        </span>
      </header>

      <div className="mx-auto grid w-full max-w-5xl flex-1 grid-cols-1 gap-10 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
        {/* Left column — currency picker + order summary */}
        <section aria-label="Order summary">
          <p className={sectionLabelClass}>Choose a currency:</p>

          <div
            role="radiogroup"
            aria-label="Currency"
            className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {(
              [
                {
                  code: "BDT",
                  flag: "bd",
                  label: `BDT ${(USD_PRICE * BDT_RATE).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                },
                { code: "USD", flag: "us", label: `$${USD_PRICE.toFixed(2)}` },
              ] as const
            ).map((option) => (
              <button
                key={option.code}
                type="button"
                role="radio"
                aria-checked={currency === option.code}
                onClick={() => setCurrency(option.code)}
                className={
                  "flex items-center gap-2.5 rounded-lg border px-3.5 py-3 text-sm font-semibold transition-colors " +
                  (currency === option.code
                    ? "border-white/80 bg-[#141414] text-white"
                    : "border-white/10 bg-[#141414] text-white/75 hover:border-white/30")
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://flagcdn.com/w40/${option.flag}.png`}
                  alt=""
                  className="h-3.5 w-5 rounded-[2px] object-cover"
                />
                {option.label}
              </button>
            ))}
          </div>

          <p className="mt-2 text-[11px] text-white/35">
            1 USD = {BDT_RATE} BDT
          </p>

          {/* Order summary */}
          <div className="mt-8 flex items-start justify-between gap-4">
            <div>
              <p className="font-manrope text-base font-bold sm:text-lg">
                {planName}
              </p>

              <p className="mt-0.5 text-xs text-white/45">
                Access to all features
              </p>
            </div>

            <p className="font-manrope text-base font-bold whitespace-nowrap sm:text-lg">
              {amount}
            </p>
          </div>
        </section>

        {/* Right column — express checkout + payment form */}
        <section aria-label="Payment details">
          {/* Link express checkout banner */}
          <button
            type="button"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#22c55e] text-sm font-semibold text-[#04140a] transition hover:bg-[#1eb556]"
          >
            <span className="flex size-5 items-center justify-center rounded-full bg-black/25">
              <Link2 className="size-3" aria-hidden="true" />
            </span>

            <span className="rounded-[3px] bg-[#1434cb] px-1 py-px text-[8px] font-bold tracking-wide text-white italic">
              VISA
            </span>

            <span className="font-mono text-xs tracking-wider">•••• 4242</span>
          </button>

          <div className="my-4 flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />

            <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
              or
            </span>

            <span className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handlePay} className="flex flex-col gap-5">
            {/* Contact information */}
            <div className="flex flex-col gap-2"></div>

            {/* Payment method — card panel */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold">Payment method</p>

              <div className="overflow-hidden rounded-xl border border-white/10 bg-[#141414]">
                {/* Card tab header */}
                <div className="flex items-center gap-2 px-4 py-3 text-sm font-medium">
                  <CreditCard
                    className="size-4 text-white/60"
                    aria-hidden="true"
                  />
                  Card
                </div>

                <div className="flex flex-col gap-4 border-t border-white/10 p-4">
                  {/* Card information */}
                  <div className="flex flex-col gap-2">
                    <div className="relative">
                      <label htmlFor="payment-card" className="sr-only">
                        Card number
                      </label>

                      <div className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1">
                        <CardBrands />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pay */}

            <section>
              <PayButton label={paying} amount={amount} />
            </section>
          </form>
        </section>
      </div>
    </main>
  )
}

/** Mini card-brand chips shown at the right edge of the card number field. */
function CardBrands() {
  return (
    <>
      <span className="rounded-[3px] bg-[#1434cb] px-1 py-px text-[8px] font-bold tracking-wide text-white italic">
        VISA
      </span>

      <span className="flex h-3.5 w-5 items-center justify-center rounded-[3px] bg-[#222]">
        <span className="relative flex items-center">
          <span className="size-2 rounded-full bg-[#eb001b]" />

          <span className="-ml-1 size-2 rounded-full bg-[#f79e1b]/90" />
        </span>
      </span>
    </>
  )
}
