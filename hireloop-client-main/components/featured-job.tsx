import {
  LineChart,
  Building2,
  Bookmark,
  MousePointerClick,
  FileUser,
  Hexagon,
  TrendingUp,
  Search,
} from "lucide-react";

const features = [
  {
    title: "Smart Search",
    description: "Find your ideal job with advanced filters.",
    icon: Search,
  },
  {
    title: "Salary Insights",
    description: "Get real salary data to negotiate confidently.",
    icon: LineChart,
  },
  {
    title: "Top Companies",
    description: "Apply to vetted companies that are hiring.",
    icon: Building2,
  },
  {
    title: "Saved Jobs",
    description: "Manage apps & favorites on your dashboard.",
    icon: Bookmark,
  },
  {
    title: "One-Click Apply",
    description: "Simplify your job applications for an easier process!",
    icon: MousePointerClick,
  },
  {
    title: "Resume Builder",
    description: "Create professional resumes with modern templates.",
    icon: FileUser,
  },
  {
    title: "Skill-Based Matching",
    description: "Discover jobs that match your skills and experience.",
    icon: Hexagon,
  },
  {
    title: "Career Growth Resources",
    description: "Boost your career with quick interview tips.",
    icon: TrendingUp,
  },
];

export default function FeaturedJob() {
  return (
    <section className="bg-[#0a0a0d] py-20 text-white sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        {/* Badge */}
        <div className="flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#827aff] sm:text-xs">
          <span className="size-1.5 rounded-[2px] bg-[#6e5fff]" aria-hidden="true" />
          Features Job
          <span className="size-1.5 rounded-[2px] bg-[#6e5fff]" aria-hidden="true" />
        </div>

        {/* Heading */}
        <h2 className="mt-4 font-manrope text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          Everything you need
          <br className="hidden sm:block" /> to succeed
        </h2>

        {/* Feature grid */}
        <div className="mt-12 grid grid-cols-1 gap-y-9 text-left sm:mt-16 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-gradient-to-b from-[#1b1b1f] to-[#0d0d10] shadow-[0_2px_12px_rgba(0,0,0,0.5)] transition-colors hover:border-[#827aff]/40 sm:size-14 lg:size-16">
                <feature.icon
                  className="size-5 text-[#b3a5ff] sm:size-6"
                  aria-hidden="true"
                />
              </span>

              <div>
                <h3 className="text-sm font-medium text-white sm:text-[15px]">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-white/50 sm:text-[13px]">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
