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



const unitBn: Record<string, string> = {
  kg: "প্রতি কেজি",
  dozen: "প্রতি ডজন",
  pcs: "প্রতি পিস",
  litre: "প্রতি লিটার",
};

const toBn = (n: number | string) =>
  String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);

const ProductCard = ({ product }: { product: Product }) => {
  const { nameBn, image, unit, today, change } = product;
  const pct = Math.abs(Number(change?.pct ?? 0));
  const isUp = change?.dir === "up" && pct !== 0;
  const isDown = change?.dir === "down" && pct !== 0;

  const badgeStyle = isUp
    ? "bg-red-50 text-red-600"
    : isDown
    ? "bg-green-50 text-green-600"
    : "bg-gray-100 text-gray-500";

  const badgeIcon = isUp ? "▲" : isDown ? "▼" : "−";

  return (
    <div className="rounded-xl border border-[#e3e9e5] bg-white/70 px-3.5 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      {/* icon + name + unit */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eef2ef] text-lg">
          {image}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold leading-tight text-[#1f2a24]">
            {nameBn}
          </p>
          <p className="text-[11px] leading-tight text-[#7a867f]">
            {unitBn[unit] ?? unit}
          </p>
        </div>
      </div>

      {/* price + badge */}
      <div className="mt-3">
        <p className="text-[11px] text-[#7a867f]">আজকের দাম</p>
        <div className="mt-0.5 flex items-center justify-between">
          <p className="text-[17px] font-bold text-[#1f2a24]">
            {toBn(today.toLocaleString("en-US"))}{" "}
            <span className="text-[13px] font-medium">টাকা</span>
          </p>

          <span
            className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${badgeStyle}`}
          >
            <span className="text-[8px]">{badgeIcon}</span>
            {toBn(pct.toFixed(1))}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;