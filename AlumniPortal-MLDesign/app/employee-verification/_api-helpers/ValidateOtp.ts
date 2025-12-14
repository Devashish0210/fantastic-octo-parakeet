// Promise based HTTP client for the browser and node.js Post requests to backend
import axios from "axios";
import { toast } from "react-toastify";

const sendOtpToServer = async (email: string, otp: string) => {
    try {
        // Send user's email and OTP to the server through the API
        const otpResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_VALIDATE_OTP_ENDPOINT}`,
            {
                email: email,
                otp_code: otp,
            }
        );
        // Handle the server's response for OTP validation
        if (otpResponse.status === 200) {
            return true;
        } else {
            toast.error("OTP validation failed.", { autoClose: 2000 }); //---------->Message needed
            return false;
        }
    } catch (error) {
        toast.error("OTP is incorrect. Validate again or Resend OTP", {
            autoClose: 2000,
        });

        return false;
    }
};

export default sendOtpToServer;
