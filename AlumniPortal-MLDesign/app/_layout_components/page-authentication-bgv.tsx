"use client";

import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
import React, { useEffect, useState } from "react";
import sendOtpToServer from "@/app/employee-verification/_api-helpers/ValidateOtp";
import Cookies from "js-cookie"; // Importing the 'js-cookie' library for managing cookies
import { setState } from "@/redux-toolkit/features/employer-login-state";
import HeaderBGV from "./navbar";
import Footer from "./footer";
import LoginHeaderMain from "./navbar-login-bgv";
import Loading from "@/app/loading";

export default function PageAuthenticatorBGV({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactNode {
  const employerLoginState = useAppSelector(
    (state) => state.employerLoginState
  );
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetchMyAPI() {
      if (employerLoginState.otp) {
        const response = await sendOtpToServer(
          employerLoginState.email,
          employerLoginState.otp
        );
        if (!response) {
          Cookies.remove("employer-login-state");
          dispatch(setState({ email: "", otp: null }));
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
      ) : employerLoginState.otp ? (
        <div className="min-h-screen flex flex-col">
           <LoginHeaderMain />
            {children}
            <div className="mt-auto">
            <Footer />
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col">
           <HeaderBGV />
            {children}
            <div className="mt-auto">
              <Footer />
            </div>
       </div>
      )}
    </>
  );
}
