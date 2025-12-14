import axios from "axios";
import { InitialState } from "@/redux-toolkit/features/employee-login-state";

const sendEmailToServer = async (employeeLoginState: InitialState) => {
    try {
        const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/alumni/generate-otp", {
            "email": employeeLoginState.email,
            "employee_id": employeeLoginState.empID,
            "bank_acct": employeeLoginState.accountNumber,
            "pan_no": employeeLoginState.panNumber
        });
        if (response.status === 201) {

            return true;
        }
        else {
            return false
        }
    } catch (error) {
        // Handle error communicating with the server for sending the email
        console.log("Error sending email to server:", error);
        return false;
    }
};

export default sendEmailToServer;
