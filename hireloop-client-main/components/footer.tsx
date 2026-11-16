import Image from "next/image";
import Link from "next/link";

import ctaBg from "@/app/images/cta-bg.png";
import logo from "@/app/images/logo.png";

function FacebookIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.9h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

function InstagramIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.47 2H3.53a1.45 1.45 0 0 0-1.47 1.43v17.14A1.45 1.45 0 0 0 3.53 22h16.94a1.45 1.45 0 0 0 1.47-1.43V3.43A1.45 1.45 0 0 0 20.47 2ZM8.09 18.74h-3v-9h3ZM6.59 8.48a1.56 1.56 0 1 1 0-3.12 1.57 1.57 0 1 1 0 3.12Zm11.32 10.26h-3v-4.72c0-1.21-.43-2-1.52-2A1.65 1.65 0 0 0 11.85 13a2 2 0 0 0-.1.73v4.71h-3v-9h3V11a3 3 0 0 1 2.71-1.5c2 0 3.45 1.29 3.45 4.06Z" />
    </svg>
  );
}

const footerColumns = [
  {
    heading: "Product",
    links: [
      { label: "Job discovery", href: "/jobs" },
      { label: "Waver AI", href: "/company" },
      { label: "Companies", href: "/company" },
      { label: "Salary data", href: "#" },
    ],
  },
  {
    heading: "Navigations",
    links: [
      { label: "Help center", href: "#" },
      { label: "Career library", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Brand Guideline", href: "#" },
      { label: "Newsroom", href: "#" },
    ],
  },
];

const socials = [
  { label: "Facebook", href: "#", icon: FacebookIcon, featured: false },
  { label: "Instagram", href: "#", icon: InstagramIcon, featured: true },
  { label: "LinkedIn", href: "#", icon: LinkedinIcon, featured: false },
];

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-[#010109] text-white">
      {/* Wireframe dome backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 z-0 w-[min(100vw,1440px)] -translate-x-1/2 [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]"
      >
        {/* Purple halo behind the grid */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_50%_95%,rgba(88,78,236,0.55),transparent_75%)]" />

        <Image
          src={ctaBg}
          alt=""
          aria-hidden="true"
          className="h-auto w-full object-contain"
        />
      </div>

      {/* CTA block */}
      <div className="relative z-10 px-4 pt-24 text-center sm:pt-32 md:pt-36">
        <h2 className="mx-auto max-w-[700px] font-manrope text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
          Your next role is
          <br className="hidden sm:block" /> already looking for you
        </h2>

        <p className="mx-auto mt-4 max-w-[520px] text-xs text-white/60 sm:text-sm">
          Build a profile in three minutes. The matches start arriving tomorrow
          morning.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
          <Link
            href="/sign-up"
            className="flex h-10 items-center rounded-lg bg-white px-5 text-xs font-semibold text-[#010109] transition-colors hover:bg-white/85 sm:h-11 sm:text-sm"
          >
            Create a free account
          </Link>

          <Link
            href="/pricing"
            className="flex h-10 items-center rounded-lg border border-white/15 bg-white/[0.04] px-4 text-xs font-medium text-white/85 transition-colors hover:bg-white/10 sm:h-11 sm:text-sm"
          >
            View pricing
          </Link>
        </div>
      </div>

      {/* Link columns */}
      <div className="relative z-10 mx-auto mt-20 max-w-6xl grid grid-cols-2 gap-x-6 gap-y-10 px-4 pb-10 sm:mt-28 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        {/* Brand */}
        <div className="col-span-2 lg:col-span-1">
          <Link href="/" className="inline-flex" aria-label="HireLoop home">
            <Image
              src={logo}
              alt="HireLoop"
              width={150}
              height={38}
              className="h-7 w-auto object-contain sm:h-8"
            />
          </Link>

          <p className="mt-5 max-w-[290px] text-xs leading-relaxed text-white/40">
            The AI-native career platform. Built for people who take their work
            seriously.
          </p>
        </div>

        {footerColumns.map((column) => (
          <nav key={column.heading} aria-label={column.heading}>
            <p className="text-[13px] font-medium text-[#827aff]">
              {column.heading}
            </p>

            <ul className="mt-4 space-y-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-white/50 transition-colors hover:text-white sm:text-[13px]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 pb-8 sm:flex-row sm:pb-10 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              className={
                "flex size-9 items-center justify-center rounded-lg transition-colors " +
                (social.featured
                  ? "bg-[#7c5cff] text-white hover:bg-[#6c63ff]"
                  : "bg-[#1b1b1f] text-white/55 hover:text-white")
              }
            >
              <social.icon className="size-4" aria-hidden="true" />
            </a>
          ))}
        </div>

        <div className="flex flex-col items-center gap-2 text-[11px] text-white/35 sm:flex-row sm:gap-8">
          <span>Copyright 2026 –Programming Hero</span>

          <span className="flex items-center gap-1.5">
            <Link href="#" className="transition-colors hover:text-white/70">
              Terms &amp; Policy
            </Link>
            {"-"}
            <Link href="#" className="transition-colors hover:text-white/70">
              Privacy Guideline
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
