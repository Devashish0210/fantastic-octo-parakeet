"use client";

import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
import RecaptchaComponent from "./RecaptchaComponent";
import { useState } from "react";
import { Button, Card, Input, Spinner } from "@nextui-org/react";
import { setState } from "@/redux-toolkit/features/employer-login-state";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';


export default function EmailComponentMobile({
  handleProceedClick,
  isCapctha,
  setShowOtp,
  setIscaptcha,
}: {
  handleProceedClick: any;
  isCapctha: boolean;
  setShowOtp: React.Dispatch<React.SetStateAction<boolean>>;
  setIscaptcha: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
  const dispatch = useAppDispatch();
  const employerLoginState = useAppSelector(
    (state) => state.employerLoginState
  );
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [emailError, setEmailError] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState(null); // Add state for Date of Birth

  const handleEmailChange = (event: any) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    validateEmail(newEmail)
      ? setEmailError("")
      : setEmailError("Email entered is invalid");
    dispatch(setState({ email: newEmail, otp: employerLoginState.otp}));
  };

  const handleDobChange = (date: any) => {
    setDob(date);
    //dispatch(setState({ email, otp: employerLoginState.otp, dob: date }));
  };

  return (
    <div className="flex justify-center items-center flex-col">
      {loading ? (
        <Card className="min-w-[23rem] min-h-[15rem] flex justify-center items-center">
          <Spinner color="primary" />
        </Card>
      ) : (
        <Card className="min-w-[23rem] min-h-[15rem] ">
          <form className="w-[80%] mx-auto flex flex-col gap-4 mt-8">
            <Input
              isRequired
              value={email}
              isInvalid={emailError.length !== 0}
              errorMessage={emailError}
              onChange={handleEmailChange}
              required
              classNames={{
                input: "ml-2 mb-0",
                inputWrapper: "h-10",
              }}
              type="email"
              // label="Email"
              variant="underlined"
              placeholder="Please enter your Email ID"
              startContent={
                <span className="material-symbols-outlined">mail</span>
              }
            />
            <Button
              color="primary"
              className="mb-4"
              onClick={(e) =>
                handleProceedClick(e, email, setIscaptcha, dispatch)
              }
            >
              Proceed
            </Button>
          </form>
          {isCapctha &&
            (loading ? (
              <></>
            ) : (
              <div className="mx-auto">
                <RecaptchaComponent
                  setIsCaptcha={setIscaptcha}
                  errorText={errorText}
                  setErrorText={setErrorText}
                  setLoading={setLoading}
                  setShowOtp={setShowOtp}
                  employerLoginState={employerLoginState}
                  loading={loading}
                ></RecaptchaComponent>
              </div>
            ))}
        </Card>
      )}
    </div>
  );
}
