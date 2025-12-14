"use client";

import React, { useState } from "react";
import { useAppSelector } from "@/redux-toolkit/hooks";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RequestForm from "./_components/RequestForm";
import handleProceedClick from "./_api-helpers/ProceedClicked";
import MovingMessage from "../_components/MovingMessage";
import EmailComponentMobile from "./_components/LoginCard";
import OtpComponentMobile from "./_components/otp-auth";

export default function VerifyComponent() {
  //Usestate for OtpVerificationStatus.
  const isOtpVerified =
    useAppSelector((state) => state.employerLoginState.otp) != null;

  //Usestates for handling the CAPTCHA Component
  const [isCapctha, setIscaptcha] = useState(false);

  // const [otp, setOtp] = useState(initialotp);
  const [showOtp, setShowOtp] = useState(false);

  //Usestates for handling resend button, table data
  const [updateddisabled, setupdateddisabled] = useState(false);

  //Usestates for handling clickcout for resend button.
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="h-[90vh]">
      <div
        className="absolute h-full w-full -z-30"
        style={{
          backgroundImage: "url('background-employee-verification.jpg')",
          backgroundSize: "100vw 90vh",
        }}
      />
      <div
        className="absolute h-full w-full -z-30"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      ></div>
      <ToastContainer pauseOnHover={false} />

      <section>
        {!isOtpVerified && (
          <section className="h-[90vh] w-full flex flex-wrap items-center justify-evenly">
            <div className="text-[3rem] pr-24 text-white -mt-8 max-md:text-[2rem] max-md:pr-0 max-md:pl-4 max-md:w-full max-md:-mt-16">
              <h1 className="max-md:hidden">Welcome to</h1>
              <h1 className="max-md:hidden">Employment Verification</h1>
              <h1 className="max-md:hidden">Services</h1>

              <div className="hidden max-md:block max-md:leading-tight">
                <h1>Welcome to</h1>
                <h1>Employment</h1>
                <h1>Verification</h1>
                <h1>Services</h1>
              </div>
            </div>
            {!showOtp ? (
              <EmailComponentMobile
                handleProceedClick={handleProceedClick}
                isCapctha={isCapctha}
                setShowOtp={setShowOtp}
                setIscaptcha={setIscaptcha}
              />
            ) : (
              <OtpComponentMobile
                setShowOtp={setShowOtp}
                setClickCount={setClickCount}
                setupdateddisabled={setupdateddisabled}
                updateddisabled={updateddisabled}
                clickCount={clickCount}
              />
            )}
          </section>
        )}

        {isOtpVerified && (
          <>
            <RequestForm></RequestForm>
          </>
        )}
      </section>
    </div>
  );
}