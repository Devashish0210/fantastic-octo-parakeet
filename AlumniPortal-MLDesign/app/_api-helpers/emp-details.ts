import axios from "axios";
import { InitialState } from "@/redux-toolkit/features/employee-login-state";
import handleLogout from "./LogOut";
import { AppDispatch } from "@/redux-toolkit/store";

const getEmployeeDetails = async (employeeLoginState: InitialState, dispatch: AppDispatch, router: any) => {
    try {
        const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/alumni/emp-details", {}, {
            headers: {
                'X-EMAIL': employeeLoginState.email,
                'X-ALUMNIOTP': employeeLoginState.otp,
                'X-EMPID': employeeLoginState.empID
            }
        });
        // console.log("Employee Details Response:", response);
        if (response.status === 403) {
            handleLogout(dispatch, router)
            // console.log("Employee Details Response: Forbidden");
            return { "doj": "", "lwd": "", "name": "", "title": "", "empID": "" }
        }
        return response.data;
    } catch (err) {
        // console.log("Error fetching employee details:", err);
        if (axios.isAxiosError(err)) {
            if (err.response && err.response.status === 403) {
                handleLogout(dispatch, router)
            } else {
                // console.log(err)
            }
        } else {
            // console.log(err)
        }
        return { "doj": "", "lwd": "", "name": "", "title": "", "empID": "" };
    }
};

export default getEmployeeDetails;
