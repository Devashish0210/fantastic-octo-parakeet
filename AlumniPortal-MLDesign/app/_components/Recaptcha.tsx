"use client"

//@ts-ignore
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import sendEmailToServer from "@/app/_api-helpers/generate-otp";
import { InitialState } from "@/redux-toolkit/features/employee-login-state";
import { Dispatch, SetStateAction, useState } from "react";
import React from "react";
interface RecaptchaProps {
    employeeLoginState: InitialState;
    setOtpSent: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
    setErrorText: Dispatch<SetStateAction<string>>;
    setLoading: Dispatch<SetStateAction<boolean>>;
    errorText: string;
}

const Recaptcha = ({ employeeLoginState, setOtpSent, loading, setLoading, errorText, setErrorText }: RecaptchaProps) => {
    // const recaptchaRef = React.createRef<ReCAPTCHA>();
    const handleVerifyCaptcha = async (value: string | null) => {
        setLoading(true)
        const fetch = async () => {
            try {
                // Send reCAPTCHA response to the server for verification
                const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/verify", {
                    recaptchaValue: value,
                });
                if (response.data.success) {

                    const d = await sendEmailToServer(employeeLoginState);
                    if (d) {
                        setOtpSent(d);
                    }
                    else {
                        // recaptchaRef.current.reset()
                        setErrorText("Incorrect Details Entered... ")
                    }

                } else {
                    // recaptchaRef.current.reset()
                    setErrorText("Some error occured please try again... ")

                }
            } catch (error) {
                console.log(error);
                // recaptchaRef.current.reset()
                setErrorText("Some error occured please try again... ")

            } finally {
                setLoading(false)
            }
        }
        fetch()
    };

    return (
        <>
            <ReCAPTCHA
                sitekey="6LcbFSkpAAAAADYavf6SoYnz_N4BiJTNs9Ao11NP"
                onChange={handleVerifyCaptcha}
            // ref={recaptchaRef}
            ></ReCAPTCHA>
            <p className="text-danger">{errorText}</p>
        </>
    );
};
export default Recaptcha;
