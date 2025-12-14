"use client";
import { Navbar } from "@nextui-org/react";
import handleLogout from "../_api-helpers/LogOut";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
import { useRouter } from "next/navigation";
import Link from "next/link";
import getEmployeeDetails from "../_api-helpers/emp-details";
import { setState } from "@/redux-toolkit/features/employee-details";
import { useEffect, useState } from "react";

export default function NavBar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const employeeLoginState = useAppSelector(
    (state) => state.employeeLoginState
  );
  const heroState = useAppSelector((state) => state.employeeDetails);
  useEffect(() => {
    async function fetchMyAPI() {
      // console.log(heroState);
      if (!heroState.name) {
        const response = await getEmployeeDetails(
          employeeLoginState,
          dispatch,
          router
        );
        const data = await response;
        // console.log("Fetched Employee Details:", data);
        dispatch(
          setState({
            doj: data["doj"],
            lwd: data["lwd"],
            name: data["name"],
            title: data["title"],
            empID: employeeLoginState.empID,
          })
        );
      }
    }

    fetchMyAPI();
  }, []);
  return (
    <>
      <div className="w-full">
        <Navbar
          className="shadow-md"
          classNames={{ wrapper: "px-0 max-w-full" }}
        >
          <div className="flex h-full w-full justify-between items-center px-4 sm:px-8">
            <div className="flex gap-4 items-center justify-start">
              <Link href="https://www.microland.com">
                <img
                  src="/microland-logo-main.png"
                  alt="Logo"
                  className="h-6 object-contain flex-shrink-0"
                />
              </Link>
              <p className="text-2xl font-thin hidden md:block">|</p>
              <Link href="/actions" className="text-black hidden md:block">
                <p className="font-semibold text-xl">Alumni Services</p>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Link href="https://www.microland.com/careers" target="_blank" className="text-black hidden md:block">
                <span className="cursor-pointer p-4">Careers</span>
              </Link>
              <p
                onClick={() => handleLogout(dispatch, router)}
                className="flex justify-center items-center cursor-pointer hidden md:flex"
              >
                <span className="material-symbols-outlined">logout</span>Logout
              </p>
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
        <div className={`md:hidden bg-white shadow-md transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="flex flex-col p-4 gap-3">
            <Link href="/actions" className="text-black py-2 border-b" onClick={() => setIsMenuOpen(false)}>
              <p className="font-semibold text-base">Alumni Services</p>
            </Link>
            <Link href="https://www.microland.com/careers" target="_blank" className="text-black py-2 border-b" onClick={() => setIsMenuOpen(false)}>
              <span className="font-semibold text-base">Careers</span>
            </Link>
            <p
              onClick={() => {
                setIsMenuOpen(false);
                handleLogout(dispatch, router);
              }}
              className="flex items-center gap-2 cursor-pointer py-2"
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="font-semibold text-base">Logout</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}