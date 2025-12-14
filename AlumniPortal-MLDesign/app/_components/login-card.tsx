"use client";

import { useState, useRef, use } from "react";
import Recaptcha from "@/app/_components/Recaptcha";
import { useDispatch } from "react-redux";
import { setState } from "@/redux-toolkit/features/employee-login-state";
import { useAppSelector } from "@/redux-toolkit/hooks";
import { Button, Input, Spinner, Switch } from "@nextui-org/react";
import { Card, CardHeader } from "@nextui-org/react";
import OtpAuth from "./otp-auth";

export default function LoginCard() {
  const dispatch = useDispatch(); // Redux dispatch function
  const employeeLoginState = useAppSelector(
    (state) => state.employeeLoginState
  );
  // State variables
  const [bank_id, setbank_id] = useState(""); // Bank account number
  const email_id = useRef<HTMLInputElement>(null); // Email input reference
  const emp_id = useRef<HTMLInputElement>(null); // Employee ID input reference
  const [employeeID, setEmployeeID] = useState(""); // Employee ID input reference
  const [email, setEmail] = useState(""); // Email state
  const [isCaptcha, setIsCaptcha] = useState(false); // Captcha state
  const [otpSent, setOtpSent] = useState(false); // OTP sent state
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [emailError, setEmailError] = useState("");
  const [empIDError, setEmpIDError] = useState("");
  const [formError, setFormError] = useState("");
  const [accNoError, setAccNoError] = useState("");

  const [showPanInput, setShowPanInput] = useState(false); // PAN card input state
  const [panCard, setPanCard] = useState(""); // PAN card number state
  const [panCardError, setPanCardError] = useState("");

  // Function to validate and submit the form
  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
  const validateEmpID = (value: string) => value.match(/^[0-9]+$/i);
  const validateAccNo = (value: string) =>
    value.match(/^[0-9][0-9][0-9][0-9][0-9]$/i);

  const validatePanCard = (value: string) =>
    value.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i);

  const validateForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target;

    //@ts-ignore
    if (form.checkValidity()) {
      setIsCaptcha(true); // Show the captcha
      if (email_id.current !== null) {
        // console.log({
        //   email: email,
        //   empID: employeeID,
        //   accountNumber: bank_id,
        //   panNumber: panCard,
        //   otp: null,
        // });
        dispatch(
          setState({
            email: email,
            empID: employeeID,
            accountNumber: bank_id,
            panNumber: panCard,
            otp: null,
          })
        );
        setFormError("");
      }
    } else {
      setFormError(
        "The data input is not valid, might be caused due to invalid email, Non Numeric invalid employee Id, more or less than 5 last digits of account number."
      );
    }
  };
  return (
    <>
      <div className="flex justify-center items-center flex-col">
        {!otpSent &&
          (loading ? (
            <Card className="w-[23rem] min-h-[25rem] flex justify-center items-center">
              <Spinner color="primary" />
            </Card>
          ) : (
            <Card className="w-[23rem] min-h-[25rem]">
              <form
                className="w-full px-6 sm:px-8 mx-auto flex flex-col gap-6 mt-8 pb-6"
                onSubmit={validateForm}
              >
                <Input
                  ref={email_id}
                  isRequired
                  value={email}
                  variant="underlined"
                  isInvalid={emailError.length !== 0}
                  errorMessage={emailError}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value)
                      ? setEmailError("")
                      : setEmailError("Email entered is invalid");
                    dispatch(
                      setState({
                        email: e.target.value,
                        empID: employeeID,
                        accountNumber: bank_id,
                        panNumber: panCard,
                        otp: null,
                      })
                    );
                  }}
                  required
                  classNames={{
                    input: "ml-2 mb-0",
                    inputWrapper: "h-10",
                  }}
                  type="email"
                  size="sm"
                  // label="Email"
                  placeholder="Enter your personal email address"
                  startContent={
                    <span className="material-symbols-outlined">mail</span>
                  }
                />
                <Input
                  ref={emp_id}
                  variant="underlined"
                  isInvalid={empIDError.length !== 0}
                  errorMessage={empIDError}
                  value={employeeID}
                  isRequired={true}
                  onChange={(e) => {
                    setEmployeeID(e.target.value);
                    validateEmpID(e.target.value)
                      ? setEmpIDError("")
                      : setEmpIDError("Employee ID entered is invalid");
                    dispatch(
                      setState({
                        email: email,
                        empID: e.target.value,
                        accountNumber: bank_id,
                        panNumber: panCard,
                        otp: null,
                      })
                    );
                  }}
                  classNames={{
                    input: "ml-4 mb-0",
                    inputWrapper: "h-10",
                  }}
                  startContent={
                    <span className="material-symbols-outlined">badge</span>
                  }
                  type="text"
                  pattern="[0-9]+"
                  // label="Employee ID"
                  placeholder="Employee ID"
                />
                <Input
                  isInvalid={accNoError.length !== 0}
                  errorMessage={accNoError}
                  value={bank_id}
                  onChange={(e) => {
                    setbank_id(e.target.value);
                    validateAccNo(e.target.value)
                      ? setAccNoError("")
                      : setAccNoError("Account Number entered is invalid");
                    dispatch(
                      setState({
                        email: email,
                        empID: employeeID,
                        accountNumber: e.target.value,
                        panNumber: panCard,
                        otp: null,
                      })
                    );
                  }}
                  isRequired={true}
                  classNames={{
                    input: "ml-4 mb-0",
                    inputWrapper: "h-20 -mt-6",
                  }}
                  startContent={
                    <span className="material-symbols-outlined">lock</span>
                  }
                  type="password"
                  pattern="[0-9][0-9][0-9][0-9][0-9]"
                  variant="underlined"
                  label="Last 5 Digits of Bank Account No."
                  placeholder="Microland Salary Account"
                />

                  <Input
                    isInvalid={panCardError.length !== 0}
                    errorMessage={panCardError}
                    value={panCard}
                    onChange={(e) => {
                    const upperCaseValue = e.target.value.toUpperCase();
                    setPanCard(upperCaseValue);
                    validatePanCard(upperCaseValue)
                        ? setPanCardError("")
                        : setPanCardError("PAN Number is invalid");
                      dispatch(
                        setState({
                          email: email,
                          empID: employeeID,
                          accountNumber: bank_id,
                          //@ts-ignore
                          panCard: e.target.value,
                          otp: null,
                        })
                      );
                    }}
                    isRequired={true}
                    classNames={{
                      input: "ml-4 mb-0",
                      inputWrapper: "h-20 -mt-6",
                    }}
                    startContent={
                      <span className="material-symbols-outlined">info</span>
                    }
                    type="password"
                    pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                    variant="underlined"
                    label="PAN Number"
                    placeholder="Enter your PAN Number"
                  />
                {isCaptcha &&
                (loading ? (
                  <></>
                ) : (
                  <div className="w-full flex justify-center -mx-2">
                    <Recaptcha
                      errorText={errorText}
                      setErrorText={setErrorText}
                      setLoading={setLoading}
                      setOtpSent={setOtpSent}
                      employeeLoginState={employeeLoginState}
                      loading={loading}
                    ></Recaptcha>
                  </div>
                ))}
                <Button type="submit" color="primary" isDisabled={isCaptcha} className="w-full">
                  Login
                </Button>
                <p className="text-danger">{formError}</p>
              </form>
            </Card>
          ))}

        {otpSent && <OtpAuth email={email}></OtpAuth>}
      </div>
    </>
  );
}
