import axios, { AxiosError } from "axios";
import handleLogout from "./LogOut";
import { AppDispatch } from "@/redux-toolkit/store";
import Error from "next/error";
const ticketapi = async (dispatch: AppDispatch, router: any) => {
    try {
        // Send user's email and OTP to the server through the API
        const ticketResponse = await axios.post(
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/tickets",
            {}
        );
        if (ticketResponse.status === 403) {
            handleLogout(dispatch, router)
            return
        }
        // console.log(ticketResponse);
        return true;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            if (err.response && err.response.status === 403) {
                handleLogout(dispatch, router)
            } else {
                console.log(err)
            }
        } else {
            console.log(err)
        }
        return false;
    }
};
export default ticketapi;
