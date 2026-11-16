"use client"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { searchInputClass } from "@/lib/ui-styles"

/** Dark-theme search input with the leading search icon. */
export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-white/30"
        aria-hidden="true"
      />

      <Input
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={searchInputClass}
      />
    </div>
  )
}
