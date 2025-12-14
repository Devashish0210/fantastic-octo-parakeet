import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { setState } from "@/redux-toolkit/features/employer-login-state";
const logout = (dispatch: any) => {
    Cookies.remove("employer-login-state")
    toast.warning("Logging Out.", { autoClose: 1000 });
    dispatch(setState({ email: "", otp: null }))
    window.location.reload();
};
export default logout;
