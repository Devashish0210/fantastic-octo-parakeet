"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
import React, { useEffect, useState } from "react";
import sendOtpToServer from "../_api-helpers/validate-otp";
import Cookies from "js-cookie"; // Importing the 'js-cookie' library for managing cookies
import { setState } from "@/redux-toolkit/features/employee-login-state";
import HeaderMain from "./navbar";
import Footer from "./footer";
import LoginHeaderMain from "./navbar-login-main";
import Loading from "@/app/loading";
import { InitialState } from "@/redux-toolkit/features/employee-login-state";

export default function PageAuthenticatorMain({
  children,
  path,
}: Readonly<{
  children: React.ReactNode;
  path: string;
}>): React.ReactNode {
  const employeeLoginState: InitialState = useAppSelector(
    (state) => state.employeeLoginState
  );
  const dispatch = useAppDispatch();
  const compareStringWithRegex = (text: string, patterns: string[]) => {
    const regexes = patterns.map((pattern) => new RegExp(pattern));
    return regexes.some((regex) => regex.test(text));
  };
  const nonAuthenticatedPaths = new Set(["/service-down"]);
  const regexPatternList = [
    "qrvalidate/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}",
  ];
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetchMyAPI() {
      //@ts-ignore
      if (
        !nonAuthenticatedPaths.has(path) &&
        !compareStringWithRegex(path, regexPatternList)
      ) {
        if (employeeLoginState.otp) {
          const response = await sendOtpToServer(
            employeeLoginState.email,
            employeeLoginState.otp,
            employeeLoginState.empID
          );
          if (!response) {
            Cookies.remove("employee_login_state");
            dispatch(
              setState({ email: "", otp: null, accountNumber: "", empID: "", panNumber: "" })
            );
            if (!(path === "/")) {
              router.push("/");
            }
          } else {
            if (path === "/") {
              router.push("/actions");
            }
          }
        } else {
          if (!(path === "/")) {
            router.push("/");
          }
        }
      }
    }

    fetchMyAPI();
    setIsLoading(false);
  }, []);
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : employeeLoginState.otp ? (
        <div className="min-h-screen flex flex-col">
           <LoginHeaderMain />
            <main className="flex-grow flex flex-col w-full">
              {children}
            </main>
            <Footer />
        </div>
      ) : (
        <div className="min-h-screen flex flex-col">
           <HeaderMain />
            <main className="flex-grow flex flex-col w-full">
              {children}
            </main>
            <Footer />
        </div>
      )}
    </>
  );
}
