"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
//@ts-ignore
import Cookies from "js-cookie";
// Import API helper functions
import sendEmailToServer from "@/app/_api-helpers/generate-otp";
import sendOtpToServer from "@/app/_api-helpers/validate-otp";
import cookieSetfunction from "@/app/_api-helpers/CookieSet";
// Import Redux action
import { setState } from "@/redux-toolkit/features/employee-login-state";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
import Link from "next/link";
import { Button, Card, Input } from "@nextui-org/react";
import LoadingButton from "./LoadingButton";

// Define props interface for the OTP component
interface OtpProps {
  email: string;
}

export default function OtpAuth({ email }: OtpProps) {
  // State variables for click count and OTP input
  const [clickCount, setClickCount] = useState(0);
  const [reSendLoading, setReSendLoading] = useState(false);
  const [reSendMessage, setReSendMessage] = useState(2);
  const [OTP, setOTP] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [OTPError, setOTPError] = useState("");
  const [verifyMessage, setVerifyMessage] = useState(2);
  // Function to handle resend OTP button click
  const validateOTP = (value: string) =>
    value.match(/^[0-9][0-9][0-9][0-9][0-9][0-9]$/i);

  const dispatch = useAppDispatch();
  const employeeLoginState = useAppSelector(
    (state) => state.employeeLoginState
  );
  const handleButtonClick = () => {
    setReSendLoading(true);
    const handleResend = async () => {
      if (clickCount < 2) {
        const res = await sendEmailToServer(employeeLoginState);
        if (res) {
          setClickCount((prevCount) => prevCount + 1);
          setReSendMessage(0);
        } else {
          setReSendMessage(1);
        }
        setReSendLoading(false);
      }
    };
    handleResend();
  };

  // Navigation hook for programmatic routing
  const router = useRouter();

  // Function to handle OTP form submission
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setVerifyLoading(true);
    const handleVerifyRequest = async () => {
      const otp_input = document.getElementById("otp_value") as HTMLFormElement;
      if (true) {
        const d = await sendOtpToServer(
          employeeLoginState.email,
          otp_input.value,
          employeeLoginState.empID
        );
        if (d !== undefined && d == true) {
          cookieSetfunction(
            "employee_login_state",
            JSON.stringify({ ...employeeLoginState, otp: otp_input.value })
          );
          dispatch(setState({ ...employeeLoginState, otp: otp_input.value }));
          setTimeout(() => {
            Cookies.remove("employee_login_state");
            dispatch(
              setState({
                email: "",
                empID: "",
                accountNumber: "",
                panNumber: "",
                otp: null,
              })
            );
            window.location.reload();
          }, 45 * 60 * 1000); // Remove cookies and reload page after 45 minutes
          setVerifyMessage(0);
          router.push("/actions");
        } else {
          setVerifyMessage(1);
        }
        setVerifyLoading(false);
      }
    };
    handleVerifyRequest();
  };

  return (
    <Card className="w-[23rem] min-h-[25rem] flex justify-center items-center flex-col">
      <form
        className="w-[80%] mx-auto flex flex-col gap-4"
        onSubmit={handleFormSubmit}
      >
        <div>
          <p className="inline text-[1rem]">
            OTP is sent to your email address :{" "}
          </p>
          <Link
            href={"mailto:" + employeeLoginState?.email}
            className="underline text-tertiary text-[1rem]"
          >
            {employeeLoginState?.email}
          </Link>
        </div>

        <p className="inline text-sm">
          Please check your Inbox and Junk/Spam folder for the OTP mail
        </p>

        <Input
          pattern="[0-9][0-9][0-9][0-9][0-9][0-9]"
          id="otp_value"
          type="text"
          variant="underlined"
          required
          value={OTP}
          isInvalid={OTPError.length !== 0}
          errorMessage={OTPError}
          onChange={(e) => {
            setOTP(e.target.value);
            validateOTP(e.target.value)
              ? setOTPError("")
              : setOTPError("Email entered is invalid");
          }}
          classNames={{
            input: "ml-4 mb-0",
            inputWrapper: "h-10",
          }}
          // label="OTP"
          placeholder="Enter OTP"
          startContent={<span className="material-symbols-outlined">pin</span>}
        />

        <LoadingButton
          type="submit"
          onClick={() => {
            console.log("Verify Form Submitted");
          }}
          isDisabled={false}
          buttonColor="primary"
          spinnerColor="white"
          loading={verifyLoading}
          message={verifyMessage}
          setMessage={setVerifyMessage}
          text="Verify"
        />

        {/* Resend button */}
        <LoadingButton
          type="button"
          onClick={handleButtonClick}
          isDisabled={clickCount >= 2}
          buttonColor="primary"
          spinnerColor="white"
          loading={reSendLoading}
          message={reSendMessage}
          setMessage={setReSendMessage}
          text="Resend"
        />
      </form>
    </Card>
  );
}
