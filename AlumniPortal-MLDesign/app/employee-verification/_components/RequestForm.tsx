"use client";

import { getLocalTimeZone, today, parseDate } from "@internationalized/date";
import { Card, Input, Spinner } from "@nextui-org/react";
//import { DatePicker } from "@nextui-org/date-picker";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-toolkit/store";
import sendVerificationToBackend from "../_api-helpers/SendVerificationBackend";
import logout from "../_api-helpers/Logout";
// import ModalComponent from "../ModalComponent/ModalComponent";
import { Button } from "@nextui-org/react";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
import { setState } from "@/redux-toolkit/features/employer-login-state";
import { SetStateAction, useState } from "react";
import { toast } from "react-toastify";
import ModalComponent from "./ModalComponent";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export default function RequestForm() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modaltext, setmodaltext] = useState("");
  //@ts-ignore
  const [value, setValue] = useState(null);
  const [dob, setDob] = useState(null);
  const [code, setcode] = useState(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [empIDError, setEmpIDError] = useState("");
  const validateEmpID = (value: string) => value.match(/^[0-9]+$/i);
  const [formError, setFormError] = useState("");
  const dispatch = useAppDispatch();
  const [employeeID, setEmployeeID] = useState(""); // Employee ID input reference
  const employerLoginState = useAppSelector(
    (state) => state.employerLoginState
  );

  // console.log("Hey", today(getLocalTimeZone()));
  

  const [isloading, setisLoading] = useState(false);

  const email = useSelector(
    (state: RootState) => state.employerLoginState.email
  );
  const otp: any = useSelector(
    (state: RootState) => state.employerLoginState.otp
  );
  //@ts-ignore
  const handleDateChange = (newValue, setter) => {
    setter(newValue);
  };

  //@ts-ignore
  const formatDateForAPI = (date) => {
    if (date) {
      return dayjs(date).format('YYYY-MM-DD');
    }
    return null;
  };

  const handleValidate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target;

    

    //@ts-ignore
    if (form.checkValidity()) {
      setisLoading(true);
      // Call a function to send parameters to the backend via an API
      sendVerificationToBackend(
        email,
        otp,
        employeeID,
        //@ts-ignore
        formatDateForAPI(value),
        //@ts-ignore
        formatDateForAPI(dob),
        dispatch
      )
        .then((response) => {
          if (response?.status === 200) {
            setmodaltext(
              "Request is processed, details are sent at your email address"
            );
            setIsOpen(true);
          } else if (response?.status === 404) {
            setcode(404);
            setmodaltext("");
            setIsOpen(true);
          } else if (response?.status === 418) {
            setcode(404);
            setmodaltext("");
            setIsOpen(true);
          } else if (response?.status === 403) {
            toast.error("OTP expired", { autoClose: 200 });
            logout(dispatch);
          }

          setisLoading(false);
        })
        .catch(() => {
          setmodaltext("Technical issue, please try after sometime");
          setIsOpen(true);
          setisLoading(false);
          setTimeout(() => {
            dispatch(setState({ email: "", otp: null }));
            Cookies.remove("employer-login-state");
            window.location.reload();
          }, 1000);
        });
      setFormError("");
    } else {
      setFormError(
        "The data input is not valid, might be caused due to invalid email, Non Numeric invalid employee Id, more or less than 5 last digits of account number."
      );
    }
  };
  return (
    <div className="flex flex-wrap h-[80vh] justify-center items-center gap-8">
      <Card className="h-[25rem] w-[25rem] flex gap-2 justify-center items-center p-8 font-medium">
        <p>
        To verify employment information, please provide the following details of the employee:
        </p>
        <div>
        <li>Microland employee ID</li>
        <li>Last working date at Microland</li>
        <li>Date of birth</li>
        </div>
        <p>Upon successful validation, the verified details will be sent to your email address.</p>
      </Card>
      <Card className="h-[25rem] w-[25rem] flex gap-2 justify-center items-center p-8 font-medium">
        <form
          className="w-[80%] mx-auto flex flex-col gap-6 mt-8"
          onSubmit={handleValidate}
        >
          <Input
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

          {/* <DatePicker
            label="Last Working Day"
            variant="underlined"
            value={value}
            onChange={setValue}
            showMonthAndYearPickers
            isRequired
            maxValue={today(getLocalTimeZone())}
            minValue={parseDate("1989-08-01")}
          /> */}
          <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Last Working Date"
          value={value}
          //@ts-ignore
          onChange={(newValue) => handleDateChange(newValue, setValue)}
          format="DD/MM/YYYY"
        />
        <DatePicker
          label="Employee Date of Birth"
          value={dob}
          //@ts-ignore
          onChange={(newValue) => handleDateChange(newValue, setDob)}
          format="DD/MM/YYYY"
        />
         </LocalizationProvider>
        </>
          <Button color="primary" className="mb-4" type="submit">
            Proceed
          </Button>
        </form>
      </Card>
      {isloading && (
        <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-40 bg-white bg-opacity-30 flex-col gap-2">
          <Spinner color="primary" />
          <h1 className="font-bold text-xl">Loading</h1>
        </div>
      )}
      <ModalComponent
        code={code}
        setcode={setcode}
        modaltext={modaltext}
        setIsOpen={setIsOpen}
        modalIsOpen={modalIsOpen}
      ></ModalComponent>
    </div>
  );
}
