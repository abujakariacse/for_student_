'use client';

import { useState } from "react";
import { Link, Button, Spinner } from "@heroui/react";
import { authClient, useSession } from "@/lib/auth-client";
import { signOut } from "better-auth/api";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
const handleSignOut = async ()=>{
await authClient.signOut({
  fetchOptions: {
    onSuccess: () => {
      router.push("/sign-in"); // redirect to login page
    },
  },
});
}
  const { data: session, isPending } = useSession();
  console.log('user Session in Navbar',session);

  if(isPending){
    return <div className="flex flex-col items-center gap-2">
        <Spinner size="xl" />
        <span className="text-xs text-muted">Extra Large</span>
      </div>
  }

  const link =<>
      <li>
            <Link href="/services">Services</Link>
          </li>
          <li>
            <Link href="/dashboard">
              Dashboard
            </Link>
          </li>

          {session?.user && <>
          
          
            <li>
              <Link href="/profile">Profile</Link>
            </li>
          
            <li>
              <Link href="/settings">Settings</Link>
            </li>
          
          
          </>}

  </>
        const authLinks =<>
         {
            session?.user ? <>
            <span>Walcome, {session.user?.name}</span>
            <Button onClick={handleSignOut}>Sign Out</Button>
            
            </> :<>
            
                 <Link href="/sign-in">Login</Link>
                 <Link href="/sign-up"><Button>Sign Up</Button></Link>
             </>
         }
        
        </>
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-separator bg-background/70 backdrop-blur-lg">
      <header className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
          <div className="flex items-center gap-3">
            {/* <Logo /> */}
            <Link href="/" className="font-bold">
              ACME
            </Link>
          </div>
        </div>
        <ul className="hidden items-center gap-4 md:flex">
                        {link}
        </ul>
        <div className="hidden items-center gap-4 md:flex">
        


        {authLinks}



        </div>
      </header>
      {isMenuOpen && (
        <div className="border-t border-separator md:hidden">
          <ul className="flex flex-col gap-2 p-4">
            

            {link}


          </ul>
        </div>
      )}
    </nav>
  );
}