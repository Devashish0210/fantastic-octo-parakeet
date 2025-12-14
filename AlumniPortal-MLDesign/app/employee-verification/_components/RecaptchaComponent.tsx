"use client";

//@ts-ignore
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-toolkit/store";
import sendEmailToServer from "../_api-helpers/SendEmail";
import React, { Dispatch, SetStateAction, useState } from "react";
import { InitialState } from "@/redux-toolkit/features/employer-login-state";

interface RecaptchaComponentProps {
  employerLoginState: InitialState;
  setShowOtp: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setErrorText: Dispatch<SetStateAction<string>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  errorText: string;
  setIsCaptcha: Dispatch<SetStateAction<boolean>>;
}

const RecaptchaComponent = ({
  employerLoginState,
  setShowOtp,
  loading,
  setErrorText,
  setLoading,
  errorText,
  setIsCaptcha,
}: RecaptchaComponentProps) => {
  const email = useSelector(
    (state: RootState) => state.employerLoginState.email
  );
  // const recaptchaRef = React.createRef<ReCAPTCHA>();
  const handleVerifyCaptcha = async (value: any) => {
    setLoading(true);
    const fetch = async () => {
      try {
        // Send reCAPTCHA response to the server for verification
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_VERIFY_CAPTCHA_ENDPOINT}`,
          {
            recaptchaValue: value,
          }
        );

        // Handle the server's response
        if (response.data.success) {
          // Continue with OTP and other steps
          const res = await sendEmailToServer(email);
          if (res) {
            setShowOtp(true);
            setIsCaptcha(false);
          } else {
            // recaptchaRef.current.reset()
            setErrorText("Some error occured please try again... ");
          }
        } else {
          // recaptchaRef.current.reset()
          setErrorText("Some error occured please try again... ");
        }
      } catch (error) {
        // recaptchaRef.current.reset()
        setErrorText("Some error occured please try again... ");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  };

  return (
    <>
      <ReCAPTCHA
        sitekey="6LcbFSkpAAAAADYavf6SoYnz_N4BiJTNs9Ao11NP"
        // sitekey="6Lf6uBMpAAAAAHh9ABj8RTbdauSxBf7yESw6LD_E"
        onChange={handleVerifyCaptcha}
        // ref={recaptchaRef}
      />
      <p className="text-danger">{errorText}</p>
    </>
  );
};

export default RecaptchaComponent;
