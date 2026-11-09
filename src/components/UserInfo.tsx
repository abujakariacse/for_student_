"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";

const UserInfo = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  console.log(user);
  return (
    <div>
      {user ? (
        <button
          type="button"
          className="flex items-center gap-2.5 rounded-xl px-1.5 py-1 transition hover:bg-black/5"
        >
          <Image
            alt={user?.name ?? "User avatar"}
            src={user?.image as string}
            width={36}
            height={36}
            className="size-9 rounded-xl bg-[#f1f1f1] object-cover"
          />
          <span className="text-[14px] font-medium text-[#2b2b2b]">
            {user?.name}
          </span>
          <svg
            aria-hidden="true"
            width="8"
            height="8"
            viewBox="0 0 10 6"
            fill="#6b6b6b"
          >
            <path d="M0 0h10L5 6z" />
          </svg>
        </button>
      ) : (
        <div className="flex items-center gap-4">
          <Link href={"/sign-in"}>
            <button className="text-sm font-semibold text-gray-800 transition-colors hover:text-[#0f9447]">
              সাইন ইন
            </button>
          </Link>

          <Link href={"/sign-up"}>
            <button className="rounded-xl bg-[#0f9447] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#0c7a3a]">
              সাইন আপ
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
