import Image from "next/image";
import Navlinks from "./Navlinks";
import Link from "next/link";
import UserInfo from "./UserInfo";


const Headers = () => {
  const date = new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
  });

  return (
    <header className="w-full border-b border-gray-100 bg-[#f8faf9]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href={"/"}>
            <div className="flex items-center justify-center rounded-xl bg-[#0f9447] p-2.5 shadow-sm">
              <Image
                className="h-7 w-7 object-contain brightness-0 invert"
                height={50}
                width={50}
                src="/logo-icon.png"
                alt="বাজার দর লোগো"
              />
            </div>
          </Link>

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              বাজার দর
            </h2>
            <p className="text-xs font-medium text-gray-500">
              {date}
            </p>
          </div>
        </div>

        {/* Button */}
        <UserInfo />

      </div>
      <Navlinks />
    </header>
  );
};

export default Headers;
