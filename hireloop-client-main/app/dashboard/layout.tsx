import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "../componets/DashboardSidebar"

// Dashboard shell — dark theme, fixed sidebar, slim top bar with the mobile
// menu trigger. Pages render below and control their own padding.
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="min-h-screen bg-[#010109]">
      <DashboardSidebar />

      <main className="min-w-0 flex-1">
        {/* Top bar — mobile menu trigger + brand hint on small screens */}
        <div className="sticky top-0 z-10 flex h-12 items-center gap-3 border-b border-white/[0.06] bg-[#010109]/90 px-3 backdrop-blur-sm sm:px-4">
          <SidebarTrigger className="text-white/85 hover:bg-white/10 hover:text-white" />

          <span className="font-manrope text-xs font-semibold tracking-wide text-white/80 lg:hidden">
            HireLoop
          </span>
        </div>

        {children}
      </main>
    </SidebarProvider>
  )
}
