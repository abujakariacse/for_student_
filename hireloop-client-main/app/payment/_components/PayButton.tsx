
"use client"

type PayButtonProps = {
  label: boolean
  amount: string
}

const PayButton = ({ label, amount  }: PayButtonProps) => {
  return (
    <button
      type="submit"
      disabled={label}
      className="flex h-11 w-full items-center justify-center rounded-lg bg-[#1476ff] text-sm font-semibold text-white transition-colors hover:bg-[#0d63e0] disabled:pointer-events-none disabled:opacity-60"
    >
      {label ? "Redirecting…" : `Pay ${amount}`}
    </button>
  )
}

export default PayButton
