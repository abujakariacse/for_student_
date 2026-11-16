import Image from "next/image";
import globeImg from "@/app/images/globe.png";
import {
  Search,
  MapPin,
  BriefcaseBusiness,
  BarChart3,
  UserSearch,
  Star,
} from "lucide-react";

const trendingPositions = [
  "Product Designer",
  "AI Engineering",
  "Dev-ops Engineer",
];

const stats = [
  { value: "50K", label: "Active Jobs", icon: BriefcaseBusiness },
  { value: "12K", label: "Companies", icon: BarChart3 },
  { value: "2M", label: "Job Seekers", icon: UserSearch },
  { value: "97%", label: "Satisfaction Rate", icon: Star },
];

function GlobeLineArt({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 460"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g stroke="white" strokeOpacity="0.2" strokeWidth="1">
        <ellipse cx="600" cy="620" rx="580" ry="470" />
        <ellipse cx="600" cy="620" rx="448" ry="363" />
        <ellipse cx="600" cy="620" rx="448" ry="260" />
        <ellipse cx="600" cy="620" rx="290" ry="235" />
        <ellipse cx="600" cy="620" rx="160" ry="130" />
        <ellipse cx="600" cy="620" rx="60" ry="49" />

        <line x1="600" y1="150" x2="600" y2="240" />
        <line x1="426" y1="204" x2="426" y2="285" />
        <line x1="774" y1="204" x2="774" y2="285" />

        <line x1="96" y1="88" x2="220" y2="132" />
        <line x1="1004" y1="82" x2="1128" y2="128" />
        <line x1="86" y1="252" x2="264" y2="266" />
        <line x1="936" y1="246" x2="1114" y2="260" />
      </g>

      <g fill="white" fillOpacity="0.45">
        <circle cx="220" cy="132" r="2" />
        <circle cx="96" cy="88" r="2" />
        <circle cx="1128" cy="128" r="2" />
        <circle cx="1004" cy="82" r="2" />
        <circle cx="264" cy="266" r="2" />
        <circle cx="1114" cy="260" r="2" />
        <circle cx="86" cy="252" r="2" />
        <circle cx="936" cy="246" r="2" />
      </g>

      <g stroke="white" strokeOpacity="0.4" strokeWidth="1">
        <path d="M150 341 h10 M155 336 v10" />
        <path d="M1050 351 h10 M1055 346 v10" />
        <path d="M360 30 h10 M365 25 v10" />
        <path d="M840 44 h10 M845 39 v10" />
        <path d="M620 66 h10 M625 61 v10" />
        <path d="M240 196 h10 M245 191 v10" />
        <path d="M964 190 h10 M969 185 v10" />
      </g>
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#010109] text-white">
      {/* Dynamic Background Glow Effect */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
      >
        {/* Top Radial Glow */}
        <div className="absolute inset-x-0 top-0 h-[240px] opacity-50 sm:h-[380px] sm:opacity-100 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.14),transparent_72%)]" />

        {/* Soft Ambient Glow */}
        <div className="absolute left-1/2 top-[250px] sm:top-[350px] md:top-[390px] h-[300px] sm:h-[450px] w-[90vw] max-w-[850px] -translate-x-1/2 rounded-full bg-white/[0.04] blur-[120px] sm:blur-[150px]" />
      </div>

      {/* Hero Container Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        {/* Job Badge */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 pt-24 sm:pt-28 md:pt-36 lg:pt-40">
          <span className="hidden h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-white/40 sm:block" />

          <div className="flex h-8 sm:h-9 items-center gap-2 rounded-full border border-white/20 bg-gradient-to-b from-[#303030] to-[#090909] px-3 sm:px-3.5 shadow-[inset_0_0_6px_rgba(255,255,255,0.1)]">
            <span className="text-xs sm:text-sm">💼</span>

            <span className="whitespace-nowrap font-mono text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider text-white">
              <strong>50,000+</strong>{" "}
              <span className="text-white/50">New Jobs This Month</span>
            </span>
          </div>

          <span className="hidden h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-white/40 sm:block" />
        </div>

        {/* Main Heading */}
        <div className="mt-5 sm:mt-7 md:mt-8 text-center">
          <h1 className="font-manrope text-2xl sm:text-4xl md:text-5xl lg:text-[52px] leading-tight font-bold tracking-tight px-2">
            Find Your Dream Job Today
          </h1>

          <p className="mx-auto mt-2.5 sm:mt-3 max-w-[650px] font-manrope text-xs sm:text-sm md:text-base leading-relaxed text-white/65 px-4">
            HireLoop connects top talent with world-class companies. Browse
            thousands of curated opportunities and land your next role —
            faster.
          </p>
        </div>

        {/* Responsive Search Form */}
        <form
          action="/jobs"
          method="get"
          className="mx-auto mt-6 sm:mt-8 flex max-w-[550px] flex-col sm:flex-row items-stretch sm:items-center overflow-hidden rounded-xl sm:rounded-2xl border border-white/20 bg-[#101010] p-1.5 sm:p-1 shadow-2xl gap-1 sm:gap-0"
        >
          {/* Job Search Input */}
          <label className="flex min-h-10 sm:min-h-11 flex-1 items-center gap-2.5 px-3">
            <Search className="size-4 shrink-0 text-white/80" />
            <span className="sr-only">Job title, skill or company</span>
            <input
              type="text"
              name="query"
              required
              placeholder="Job title, skill or company"
              className="w-full bg-transparent text-xs sm:text-sm text-white outline-none placeholder:text-white/55"
            />
          </label>

          {/* Vertical Divider for Desktop */}
          <div className="hidden h-6 w-px bg-white/20 sm:block" />

          {/* Location Input */}
          <label className="flex min-h-10 sm:min-h-11 flex-1 items-center gap-2.5 border-t border-white/10 sm:border-t-0 px-3">
            <MapPin className="size-4 shrink-0 text-white/80" />
            <span className="sr-only">Location or Remote</span>
            <input
              type="text"
              name="location"
              placeholder="Location or Remote"
              className="w-full bg-transparent text-xs sm:text-sm text-white outline-none placeholder:text-white/55"
            />
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            aria-label="Search jobs"
            className="flex h-10 sm:h-10 sm:w-10 items-center justify-center gap-2 rounded-lg bg-[#5c53fe] px-4 sm:px-0 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-[#6c63ff] shrink-0"
          >
            <Search className="size-4 text-white" />
            <span className="sm:hidden font-medium">Search Jobs</span>
          </button>
        </form>

        {/* Trending Positions */}
        <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-1.5 px-2">
          <span className="mr-1 text-[10px] sm:text-xs text-white/55">
            Trending Position
          </span>

          {trendingPositions.map((position) => (
            <span
              key={position}
              className="flex h-6 sm:h-7 items-center rounded-full border border-white/15 bg-[#1a1a1b] px-2.5 sm:px-3 text-[9px] sm:text-[10px] text-white/80 transition-colors hover:border-[#5c53fe]/70 cursor-pointer"
            >
              {position}
            </span>
          ))}
        </div>
      </div>

      {/* Globe & Stats Section */}
      <div className="relative mt-8 sm:mt-12 md:mt-16 min-h-[360px] sm:min-h-[420px] md:min-h-[460px] lg:min-h-[500px]">
        {/* Globe Overlay Image */}
        <Image
          src={globeImg}
          alt="Globe illustration"
          priority
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[calc(-10px_-_74.2188vw)] sm:top-[calc(10px_-_min(59.375vw,855px))] lg:top-[calc(30px_-_min(59.375vw,855px))] z-0 h-auto w-[125vw] sm:w-[min(100vw,1440px)] -translate-x-1/2 object-contain [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]"
        />

        {/* Mobile haze dimmer — tames the bright fog on small screens */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[calc(-74.2188vw_-_80px)] z-[5] h-[calc(74.2188vw_+_180px)] bg-gradient-to-b from-[#010109] via-[#010109]/55 via-50% to-transparent sm:hidden"
        />

        {/* Globe Line Art Component */}
        <GlobeLineArt className="pointer-events-none absolute left-1/2 top-0 z-0 hidden sm:block w-[1000px] md:w-[1200px] lg:w-[1400px] -translate-x-1/2 opacity-40" />

        {/* Globe Heading */}
        <h2 className="relative z-10 mx-auto max-w-2xl px-6 pt-24 sm:pt-36 md:pt-44 lg:pt-48 text-center font-instrument text-xl sm:text-3xl md:text-[36px] lg:text-[40px] font-medium leading-snug lg:leading-[1.3] text-white/90">
          Assisting over{" "}
          <span className="text-white font-semibold">15,000 job seekers</span>{" "}
          find their dream positions.
        </h2>

        {/* Responsive Grid Statistics */}
        <dl className="relative z-10 mx-auto mt-6 sm:mt-8 lg:mt-10 grid max-w-[1100px] grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4 px-4 sm:px-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex h-[110px] sm:h-[130px] lg:h-[140px] flex-col justify-between rounded-xl border border-white/10 bg-gradient-to-b from-[#020202] to-[#202020] p-3.5 sm:p-4 lg:p-5 shadow-lg shadow-black/40"
            >
              <stat.icon
                className="size-4 sm:size-5 text-white/90"
                aria-hidden="true"
              />

              <div>
                <dd className="font-jakarta text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white leading-none">
                  {stat.value}
                </dd>

                <dt className="mt-1.5 font-intertight text-[10px] sm:text-xs text-white/75 truncate">
                  {stat.label}
                </dt>
              </div>
            </div>
          ))}
        </dl>
      </div>

      {/* Bottom Padding Spacing */}
      <div className="h-8 sm:h-12 lg:h-16" />
    </section>
  );
}