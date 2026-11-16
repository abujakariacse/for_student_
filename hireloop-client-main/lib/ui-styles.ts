// Shared Tailwind class strings for the dark dashboard UI.
// Keep these in sync with the Figma tokens — editing once updates every page.

/** Text fields in forms (job/new page). */
export const inputClass =
  "h-10 rounded-lg border-white/15 bg-[#0d0d10] text-sm text-white placeholder:text-white/65 focus-visible:border-[#5c53fe]/70 focus-visible:ring-[#5c53fe]/25"

/** Job description textarea (multi-line form field). */
export const textareaClass =
  "min-h-32 rounded-lg border-white/15 bg-[#0d0d10] text-sm text-white placeholder:text-white/65 focus-visible:border-[#5c53fe]/70 focus-visible:ring-[#5c53fe]/25"

/** Filter selects in the Manage Jobs table. */
export const selectClass =
  "h-11 rounded-lg border-white/15 bg-[#0d0d10] px-2 text-sm text-white focus-visible:border-[#5c53fe]/70 focus-visible:ring-[#5c53fe]/25 sm:w-48"

/** Search input with the filter selects' height (icon sits over pl-10). */
export const searchInputClass =
  "h-11 rounded-lg border-white/15 bg-[#0d0d10] pr-4 pl-10 text-sm text-white placeholder:text-white/65 focus-visible:border-[#5c53fe]/70 focus-visible:ring-[#5c53fe]/25"

/** Uppercase monospace mini-label above filters ("STATUS", "QUICK FILTER"). */
export const monoLabelClass =
  "font-mono text-xs tracking-[0.2em] text-white/75 uppercase"

/** Dark card / table shell used across dashboard pages. */
export const darkCardClass =
  "rounded-xl border border-white/10 bg-[#141418]"

/** Ghost-ish icon buttons (view/edit actions). */
export const ghostIconButtonClass =
  "text-white/85 hover:bg-white/10 hover:text-white"

/** Standard dashboard page container — every dashboard page wraps in this. */
export const pageContainerClass =
  "mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10"

/** Dashboard page heading (Manrope, responsive size). */
export const pageTitleClass =
  "font-manrope text-2xl font-bold tracking-tight sm:text-[28px]"

/** Dashboard page subtitle under the title. */
export const pageDescClass = "mt-1.5 max-w-lg text-sm text-white"

/** Small stat card used in the stat strip above tables. */
export const statCardClass = "rounded-xl border border-white/10 bg-[#0d0d10] p-4"

/** Big numeric value inside a stat card. */
export const statValueClass = "mt-1 font-manrope text-3xl font-bold tracking-tight"

/** Primary action button (violet glow) — matches the Figma CTA. */
export const primaryButtonClass =
  "h-10 rounded-lg bg-[#5c53fe] px-5 text-sm font-medium text-white shadow-[0_0_15px_rgba(92,83,254,0.35)] transition-colors hover:bg-[#6c63ff]"

/** Secondary action button (subtle dark fill). */
export const secondaryButtonClass =
  "h-10 rounded-lg border border-white/15 bg-white/[0.04] text-sm text-white/85 transition-colors hover:bg-white/10"

/** Hover highlight for table rows / list items. */
export const rowHoverClass = "transition-colors hover:bg-white/[0.02]"
