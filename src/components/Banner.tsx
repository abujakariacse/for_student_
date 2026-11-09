import Image from "next/image";
import Link from "next/link";

const Banner = () => {
  const date = new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
  });

  return (
    <section className="w-full bg-[#f4f7f4] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-gray-100/80 p-6 md:p-10 flex flex-col-reverse md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex-1 space-y-4 text-left">
            <div>
              <span className="inline-block bg-[#e8f5e9] text-[#2e7d32] text-xs md:text-sm font-medium px-3 py-1 rounded-full">
                {date}
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-snug">
              আজকের বাজারের দাম এক নজরে
            </h1>

            <p className="text-gray-500 text-xs md:text-sm leading-relaxed max-w-2xl">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-<br></br>সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
            </p>

            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center justify-center bg-[#008744] hover:bg-[#007038] text-white text-sm font-medium px-5 py-2.5 rounded-lg shadow-sm transition-all duration-200 active:scale-95"
              >
                সব পণ্য দেখুন
              </Link>
            </div>
          </div>

          <div className="w-44 md:w-64 lg:w-72 shrink-0 flex justify-center">
            <Image
              src="/bazar-hero.png"
              alt="বাজার ঝুড়ি"
              width={300}
              height={220}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
