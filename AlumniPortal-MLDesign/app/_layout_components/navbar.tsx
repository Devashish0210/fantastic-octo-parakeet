"use client";
import { Navbar } from "@nextui-org/react";
import Link from "next/link";
import { useState } from "react";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="w-full">
        <Navbar
          className="shadow-md"
          classNames={{
            wrapper: "px-0 max-w-full",
          }}
        >
          <div className="flex h-full w-full justify-between items-center px-4 sm:px-8">
            <div className="flex gap-2 sm:gap-4 items-center justify-start">
              <Link href="https://www.microland.com">
                <img
                  src="/microland-logo-main.png"
                  alt="Logo"
                  className="h-6 object-contain flex-shrink-0"
                />
              </Link>
              <p className="text-xl font-thin hidden md:block">|</p>
              <Link href="/actions" className="text-black hidden md:block">
                <p className="font-semibold text-xl">Alumni Services</p>
              </Link>
            </div>
            <div className="flex items-center justify-end gap-4">
              <Link href="/employee-verification" className="hidden md:block">
                <p className="font-bold text-base">
                  Employment Verification Request
                </p>
              </Link>
              <button
                className="md:hidden flex flex-col gap-1 w-6 h-6 justify-center items-center"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <span className={`w-6 h-0.5 bg-black transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-black transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-black transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </button>
            </div>
          </div>
        </Navbar>
        {/* Mobile menu */}
        <div className={`md:hidden bg-white shadow-md transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="flex flex-col p-4 gap-3">
            <Link href="/actions" className="text-black py-2 border-b" onClick={() => setIsMenuOpen(false)}>
              <p className="font-semibold text-base">Alumni Services</p>
            </Link>
            <Link href="/employee-verification" className="py-2" onClick={() => setIsMenuOpen(false)}>
              <p className="font-bold text-base">Employment Verification Request</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}