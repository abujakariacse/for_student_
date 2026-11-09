
import Banner from "@/components/Banner";
import Marquee from "@/components/Marquee";
import ProductCard from "@/components/ProductCard";

interface Product  {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryIcon: string;
  categoryNameBn: string;
  image: string;
  unit: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
  markets: unknown[];
};





export default async function Home() {
  const res = await fetch("https://api.abcz.workers.dev/api/bazardor/products");
  const data: Product[] = await res.json();

  return (
    <div className="bg-[#F4F7F4]">
      <Marquee />
      <Banner />
      <div>
        <div className="max-w-7xl mx-auto px-6 py-7">
          <h1>সব পণ্য</h1>

          <p>মোট {data.length} টি পণ্য দেখানো হচ্ছে</p>
        </div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-15">
          {data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}