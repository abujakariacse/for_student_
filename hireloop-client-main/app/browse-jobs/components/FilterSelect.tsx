"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { monoLabelClass, selectClass } from "@/lib/ui-styles"
import type { JobOption } from "@/lib/types/job"

/** Mono-labelled dropdown filter ("Job type", "Workplace", …) with an "All …" default. */
export function FilterSelect({
  label,
  value,
  onValueChange,
  options,
  allLabel,
}: {
  label: string
  value: string
  onValueChange: (value: string) => void
  /** Plain strings become { value, label } pairs automatically. */
  options: Array<JobOption | string>
  allLabel: string
}) {
  const normalized: JobOption[] = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option
  )

  return (
    <div className="flex flex-col gap-2">
      <p className={monoLabelClass}>{label}</p>

      <Select
        value={value}
        onValueChange={(next) => onValueChange(next ?? "all")}
      >
        <SelectTrigger className={selectClass}>
          <SelectValue>
            {value === "all" ? allLabel : (normalized.find((o) => o.value === value)?.label ?? value)}
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">{allLabel}</SelectItem>

          {normalized.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
