import axios from "axios";
import { toast } from "react-toastify";

const sendOtpToServer = async (email: string, otp: string, emp_id: string) => {
  try {
    // Send user's email and OTP to the server through the API
    const otpResponse = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/alumni/validate-otp",
      {
        email: email,
        otp_code: otp,
        employee_id: emp_id,
      }
    );
    // Handle the server's response for OTP validation
    if (otpResponse.status === 200) {
      console.log("Success");
      // navigate("/actions");
      return true;
    } else {
      toast.error("OTP is incorrect. Validate again or Resend OTP", {
        autoClose: 1500,
      });
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default sendOtpToServer;
