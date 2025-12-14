"use client";
import { Navbar } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteCookie } from "@/app/utils/cookieManager";

export default function NavBar() {
  const router = useRouter();

  const handleLogout = () => {
    // Remove cookies
    deleteCookie("userEmail");
    deleteCookie("userOtp");
    deleteCookie("userData");

    // Redirect to login page
    router.push("/adminui/login");
  };

  return (
    <>
      <div className="w-full">
        <Navbar
          className="shadow-md"
          classNames={{ wrapper: "px-0 max-w-full" }}
        >
          <div className="flex h-full w-full justify-between items-center px-8">
            <div className="flex gap-4 items-center justify-start">
              <Link href="https://www.microland.com">
                <img
                  src="/microland-logo-main.png"
                  alt="Logo"
                  className="h-6 object-contain"
                />
              </Link>
              <p className="text-3xl font-thin">|</p>
              <Link href="/" className="text-black">
                <p className="font-semibold text-xl">Alumni Services</p>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Link href="https://www.microland.com/careers" target="_blank" className="text-black">
                <span className="cursor-pointer p-4">Careers</span>
              </Link>
              <p
                onClick={handleLogout}
                className="flex justify-center items-center cursor-pointer"
              >
                <span className="material-symbols-outlined">logout</span>Logout
              </p>
            </div>
          </div>
        </Navbar>
      </div>
    </>
  );
}