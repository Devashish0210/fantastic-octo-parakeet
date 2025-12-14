"use client";

import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setState } from "@/redux-toolkit/features/employer-login-state";
import setCookie from "../_api-helpers/SetCookie";
import { RootState } from "@/redux-toolkit/store";
import sendOtpToServer from "../_api-helpers/ValidateOtp";
import handleSecondButtonClick from "../_api-helpers/ResendButton";
import { useState } from "react";
import Link from "next/link";
import LoadingButton from "@/app/_components/LoadingButton";
import { Card, Input } from "@nextui-org/react";

// Define props interface for the OTP component
type OtpProps = {
  setShowOtp: React.Dispatch<React.SetStateAction<boolean>>;
  setClickCount: React.Dispatch<React.SetStateAction<number>>;
  setupdateddisabled: React.Dispatch<React.SetStateAction<boolean>>;
  updateddisabled: boolean;
  clickCount: number;
};
export default function OtpComponentMobile({
  setShowOtp,
  setClickCount,
  setupdateddisabled,
  updateddisabled,
  clickCount,
}: OtpProps) {
  const dispatch = useDispatch();
  const [reSendLoading, setReSendLoading] = useState(false);
  const [reSendMessage, setReSendMessage] = useState(2);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState(2);
  const validateOTP = (value: string) =>
    value.match(/^[0-9][0-9][0-9][0-9][0-9][0-9]$/i);
  const email = useSelector(
    (state: RootState) => state.employerLoginState.email
  );
  const [otp, setOtp] = useState("");
  const [OTPError, setOTPError] = useState("");

  const handleVerifyOtp = async () => {
    setVerifyLoading(true);
    const handleVerifyRequest = async () => {
      const response_otp = await sendOtpToServer(email, otp);

      if (response_otp) {
        dispatch(setState({ email: email, otp: otp }));
        setCookie(
          "employer-login-state",
          JSON.stringify({ email: email, otp: otp })
        );
        setShowOtp(false);
        setVerifyMessage(0);
      } else {
        setVerifyMessage(1);
      }
      setVerifyLoading(false);
    };
    handleVerifyRequest();
  };

  const handleOtpChange = (e: any) => {
    setOtp(e.target.value);
    validateOTP(e.target.value)
      ? setOTPError("")
      : setOTPError("Email entered is invalid");
  };

  return (
    <Card className="min-w-[23rem] min-h-[25rem] flex justify-center items-center flex-col">
      <div className="w-[80%] mx-auto flex flex-col gap-4">
        <div>
          <p className="inline text-[1rem]">
            OTP is sent to your email address :{" "}
          </p>
          <Link
            href={"mailto:" + email}
            className="underline text-tertiary text-[1rem]"
          >
            {email}
          </Link>
        </div>

        <p>Please check your inbox and junk/spam folder for the OTP mail</p>
        <Input
          pattern="[0-9][0-9][0-9][0-9][0-9][0-9]"
          id="otp_value"
          type="text"
          required
          variant="underlined"
          value={otp}
          isInvalid={OTPError.length !== 0}
          errorMessage={OTPError}
          onChange={handleOtpChange}
          classNames={{
            input: "ml-4 mb-0",
            inputWrapper: "h-10",
          }}
          placeholder="Enter OTP"
          startContent={<span className="material-symbols-outlined">pin</span>}
        />

        <LoadingButton
          type="submit"
          onClick={handleVerifyOtp}
          isDisabled={false}
          buttonColor="primary"
          spinnerColor="white"
          loading={verifyLoading}
          message={verifyMessage}
          setMessage={setVerifyMessage}
          text="Verify"
        />

        <LoadingButton
          type="button"
          onClick={() =>
            handleSecondButtonClick({
              setupdateddisabled,
              setClickCount,
              setReSendLoading,
              setReSendMessage,
              email,
            })
          }
          isDisabled={updateddisabled || clickCount >= 2}
          buttonColor="primary"
          spinnerColor="white"
          loading={reSendLoading}
          message={reSendMessage}
          setMessage={setReSendMessage}
          text="Resend"
        />
      </div>
    </Card>
  );
}
