
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  InputGroup,
  Label,
  TextField,
  toast,
} from "@heroui/react";
import { Eye, EyeSlash } from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client";

const SignInPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const email = (data.email as string)?.trim();
    const password = data.password as string;

    // Validation
    if (!email || !password) {
      toast.danger("ইমেইল ও পাসওয়ার্ড দিন");
      return;
    }

    setLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
      rememberMe: true,
    });

    setLoading(false);

    if (error) {
      toast.danger(error.message || "সাইন ইন ব্যর্থ হয়েছে");
      return;
    }

    toast.success("সফলভাবে সাইন ইন হয়েছে!");
    router.push("/");
    router.refresh();
  };

  const handleSocial = async (provider: "google" | "github") => {
    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: "/",
    });

    if (error) {
      toast.danger(error.message || "লগইন ব্যর্থ হয়েছে");
    }
  };

  const handleGoogleSignIn = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
    })
    console.log(data)
  }

  return (
    <div className="bg-[#F4F7F4] px-4 py-12">
      <div className="mx-auto max-w-[420px]">
        <div className="mb-6 text-center">
          <h1 className="text-[26px] font-bold text-[#1f2a24]">সাইন ইন</h1>
          <p className="mt-1 text-[13px] text-[#6b776f]">
            বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
          </p>
        </div>

        <div className="rounded-2xl border border-[#e3e9e5] bg-white/80 p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <TextField className="w-full" name="email" type="email" isRequired>
              <Label>ইমেইল</Label>
              <Input placeholder="you@example.com" />
            </TextField>

            <TextField className="w-full" name="password" isRequired>
              <Label>পাসওয়ার্ড</Label>
              <InputGroup>
                <InputGroup.Input
                  className="w-full"
                  placeholder="কমপক্ষে ৮ অক্ষর"
                  type={showPassword ? "text" : "password"}
                />
                <InputGroup.Suffix className="pe-0">
                  <Button
                    isIconOnly
                    aria-label="Show or hide password"
                    size="sm"
                    variant="ghost"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <Eye className="size-4" />
                    ) : (
                      <EyeSlash className="size-4" />
                    )}
                  </Button>
                </InputGroup.Suffix>
              </InputGroup>
            </TextField>

            <Button
              type="submit"
              isPending={loading}
              className="w-full bg-[#0b8a43] font-semibold text-white"
            >
              সাইন ইন
            </Button>
          </form>

          <div className="my-4 flex items-center gap-3">
            <span className="h-px flex-1 bg-[#e3e9e5]"></span>
            <span className="text-[12px] text-[#8a958f]">অথবা</span>
            <span className="h-px flex-1 bg-[#e3e9e5]"></span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              
              className="flex items-center justify-center gap-2 rounded-lg border border-[#e3e9e5] bg-white py-2.5 text-[13px] font-semibold text-[#1f2a24] hover:bg-gray-50"
            >
              <svg
                aria-label="Google logo"
                width="16"
                height="16"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <g>
                  <path d="m0 0H512V512H0" fill="#fff"></path>
                  <path
                    fill="#34a853"
                    d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                  ></path>
                  <path
                    fill="#4285f4"
                    d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                  ></path>
                  <path
                    fill="#fbbc02"
                    d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                  ></path>
                  <path
                    fill="#ea4335"
                    d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                  ></path>
                </g>
              </svg>
              Google দিয়ে চালিয়ে যান
            </button>

            <button
              type="button"
              onClick={() => handleSocial("github")}
              className="flex items-center justify-center gap-2 rounded-lg border border-[#e3e9e5] bg-white py-2.5 text-[13px] font-semibold text-[#1f2a24] hover:bg-gray-50"
            >
              <svg
                aria-label="GitHub logo"
                width="16"
                height="16"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#1f2a24"
                  d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
                ></path>
              </svg>
              GitHub দিয়ে চালিয়ে যান
            </button>
          </div>

          <p className="mt-5 text-center text-[14px] text-[#1f2a24]">
            অ্যাকাউন্ট নেই?{" "}
            <Link href="/sign-up" className="font-semibold text-[#0b8a43]">
              সাইন আপ করুন
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-[13px] text-[#6b776f]">
          <Link href="/">← হোমে ফিরে যান</Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
