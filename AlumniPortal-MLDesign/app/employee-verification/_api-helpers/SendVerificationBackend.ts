import { toast } from "react-toastify";
import axios from "axios";
// import "reactjs-popup/dist/index.css";
//@ts-ignore
import Cookies from "js-cookie";
import logout from "./Logout";
("./Logout");
const sendVerificationToBackend = async (
  email: string,
  otp: string,
  employeeNumber: string,
  lastWorkingDay: string,
  dob: string,
  dispatch: any
) => {
  try {
    // const dateList = lastWorkingDay.toLocaleDateString().split("/");
    // dateList[1] = dateList[1].length === 1 ? '0' + dateList[1] : dateList[1];
    // dateList[0] = dateList[0].length === 1 ? '0' + dateList[0] : dateList[0];
    // const formattedDate = dateList[2] + "-" + dateList[0] + "-" + dateList[1];

    // const dobList = dob.toLocaleDateString().split("/");
    // dobList[1] = dobList[1].length === 1 ? '0' + dobList[1] : dobList[1];
    // dobList[0] = dobList[0].length === 1 ? '0' + dobList[0] : dobList[0];
    // const formattedDob = dobList[2] + "-" + dobList[0] + "-" + dobList[1];

    // console.log("dobList[0]", dobList[0]);
    // console.log("dobList[1]", dobList[1]);
    // console.log("dob", dob);

    // console.log("dateList[0]", dateList[0]);
    // console.log("dateList[1]", dateList[1]);
    // console.log("dateList[2]", dateList[2]);
    // console.log("last working dy", lastWorkingDay);
    

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BGV_REQUEST_ENDPOINT}`,
      {
        employee_id: employeeNumber,
        last_working_day: lastWorkingDay,
        dob: dob,
      },

      {
        headers: {
          "content-type": "application/json",
          "X-EMAIL": email,
          "X-OTP": otp,
        },
        validateStatus: function (status) {
          return (
            (status >= 200 && status < 300) ||
            status === 404 ||
            status === 418 ||
            status === 403
          );
        },
      }
    );
    
    // console.log({
    //   employee_id: employeeNumber,
    //   last_working_day: lastWorkingDay,
    //   dob: dob
    // });
    if (response.status === 403) {
      logout(dispatch);
      return response;
    }
    return response;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response && err.response.status === 403) {
        logout(dispatch);
      } else {
        console.log(err);
      }
    } else {
      console.log(err);
    }
    return { status: 500 };
  }
};

export default sendVerificationToBackend;
