import FeaturedJob from "@/components/featured-job";
import Footer from "@/components/footer";
import { Hero } from "@/components/hero";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#010109]">
      <Hero />
      <FeaturedJob />
      <Footer />
    </div>
  )
}
