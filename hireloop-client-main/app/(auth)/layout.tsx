import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import logo from "@/app/images/logo.png";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#010109] text-white">
      {/* Ambient background glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[320px] bg-[radial-gradient(ellipse_at_50%_0%,rgba(92,83,254,0.16),transparent_70%)]" />
        <div className="absolute left-1/2 top-[240px] h-[360px] w-[90vw] max-w-[700px] -translate-x-1/2 rounded-full bg-[#5c53fe]/[0.06] blur-[120px]" />
      </div>

      {/* Logo */}
      <header className="relative flex justify-center z-10 px-4 pt-4 sm:px-6 sm:pt-6">
        <Link href="/" className="inline-flex" aria-label="HireLoop home">
          <Image
            src={logo}
            alt="HireLoop"
            width={150}
            height={38}
            priority
            className="h-7 w-auto object-contain sm:h-8"
          />
        </Link>
      </header>

      {/* Centered card */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-10 sm:py-14">
        <div className="w-full max-w-[420px]">{children}</div>
      </main>

      <footer className="relative z-10 pb-6 text-center text-[10px] text-white/30 sm:text-xs">
        © {new Date().getFullYear()} HireLoop. All rights reserved.
      </footer>
    </div>
  );
}
