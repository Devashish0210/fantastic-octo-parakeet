"use client"

import { useState } from "react";
import { Input, Spinner } from "@nextui-org/react";
import LoadingButton from "@/app/_components/LoadingButton";
import validateQR from "../_api-helpers/validate-qr";

export default function Form({ id }: { id: string }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false)
    const [formMessage, setFormMessage] = useState("")
    const [emailError, setEmailError] = useState("")
    // const [idError, setIdError] = useState("")
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [formMessageSentiment, setFormMessageSentiment] = useState(false);
    const [verifyMessage, setVerifyMessage] = useState(2);
    // Function to validate and submit the form
    const validateEmail = (value: string) => value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
    // const validateId = (value: string) => value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    const validateForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const wait = async () => {
            const res = await validateQR(email, id)
            if (res) {
                setVerifyMessage(0);
                setFormMessageSentiment(true)
                setFormMessage("An email has been sent to your mail ID.")
            } else {
                setVerifyMessage(1);
                setFormMessageSentiment(false)
                setFormMessage("The data input is not valid, might be caused due to invalid email, or Invalid Id.")
            }
            setVerifyLoading(false)
        }
        const form = event.target
        //@ts-ignore
        if (form.checkValidity()) {
            setFormMessage("")
            setVerifyLoading(true)
            wait()
        } else {
            setFormMessageSentiment(false)
            setFormMessage("The data input is not valid, might be caused due to invalid email, or Invalid Id.")
        }


    };
    return (
        <>
            <div className="flex justify-center items-center min-h-[71vh] flex-col">
                {loading ? <div className="w-full h-72 flex justify-center items-center">
                    <Spinner color="primary" />
                </div> : (<>
                    <form className="w-[80%]  mx-auto flex flex-col gap-4" onSubmit={validateForm}>
                        <h1 className="font-bold ml-1">Welcome to the Alumni Services Portal</h1>
                        <h3 className="font-semibold ml-1">Thankyou for scanning the QR code for verification. Please enter your email address on Which to send the verified details of the employee.</h3>
                        <Input
                            isRequired
                            value={email}
                            isInvalid={emailError.length !== 0}
                            errorMessage={emailError}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                validateEmail(e.target.value) ? setEmailError("") : setEmailError("Email entered is invalid")
                            }}
                            required classNames={{
                                input: "ml-4 mb-0",
                                inputWrapper: "h-20"

                            }} type="email" label="Email" placeholder=" Enter your Personal Email ID" startContent={<span className="material-symbols-outlined">
                                mail
                            </span>} />
                        {/* <Input
                            isInvalid={idError.length !== 0}
                            errorMessage={idError}
                            value={id}
                            onChange={(e) => {
                                setId(e.target.value)
                                validateId(e.target.value) ? setIdError("") : setIdError("Employee ID entered is invalid")
                            }} classNames={{
                                input: "ml-4 mb-0",
                                inputWrapper: "h-20"
                            }} startContent={<span className="material-symbols-outlined">
                                pin
                            </span>} type="text"
                            pattern="[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}" label="ID" placeholder="Enter ID displayed by QR" /> */}
                        <LoadingButton type="submit" buttonColor="primary" spinnerColor="white" text="Get on Email" isDisabled={false} loading={verifyLoading} message={verifyMessage} setMessage={setVerifyMessage} onClick={() => { console.log("clicked") }} />
                        <p className={formMessageSentiment ? "text-success" : "text-danger"}>{formMessage}</p>
                    </form></>
                )
                }
            </div>
        </>
    )
}
