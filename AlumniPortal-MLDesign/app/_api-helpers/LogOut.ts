import { setState } from "@/redux-toolkit/features/employee-login-state";
//@ts-ignore
import Cookies from "js-cookie"; // Importing the 'js-cookie' library for managing cookies

//@ts-ignore
const handleLogout = (dispatch, router) => {
    // Remove specific cookies related to the user session
    Cookies.remove("employee_login_state");
    dispatch(setState({
        email: "",
        empID: "",
        accountNumber: "",
        panNumber: "",
        otp: null
    }))
    router.push("/")
};

// Export the handleLogout function for external usage
export default handleLogout;
