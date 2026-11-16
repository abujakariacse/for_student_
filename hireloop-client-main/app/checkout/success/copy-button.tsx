"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="shrink-0 text-white/40 transition hover:text-white"
      title="Copy"
      aria-label={`Copy ${text.slice(0, 3)}…`}
    >
      {copied ? <Check size={15} className="text-[#22c55e]" /> : <Copy size={15} />}
    </button>
  )
}
