import axios from "axios";
import { InitialState } from "@/redux-toolkit/features/employee-login-state";
import handleLogout from '../../_api-helpers/LogOut'
import { AppDispatch } from "@/redux-toolkit/store";

const getSMC = async (employeeLoginState: InitialState, dispatch: AppDispatch, router: any) => {
    try {

        const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/alumni/tickets/get-smc-cat", {
            headers: {
                'X-EMAIL': employeeLoginState.email,
                'X-ALUMNIOTP': employeeLoginState.otp,
                'X-EMPID': employeeLoginState.empID
            }
        });
        if (response.status === 403) {
            handleLogout(dispatch, router)
            return {}
        }
        if (response.status < 200 || response.status >= 300) {
            return {}
        }
        // console.log(response)

        return response.data;
    } catch (err) {
        console.log(err)
        if (axios.isAxiosError(err)) {
            if (err.response && err.response.status === 403) {
                handleLogout(dispatch, router)
            } else {
                console.log(err)
            }
        } else {
            console.log(err)
        }
        // console.log("HI")
        return {};
    }
};

export default getSMC;
