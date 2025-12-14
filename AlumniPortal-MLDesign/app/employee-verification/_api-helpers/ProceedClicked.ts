import { toast } from "react-toastify";
import validateEmail from "./ValidateEmail";
//@ts-ignore
import Cookies from "js-cookie";
import { useAppDispatch } from "@/redux-toolkit/hooks";
import { setState } from "@/redux-toolkit/features/employer-login-state";

//@ts-ignore
const handleProceedClick = async (e: any, email: string, setIscaptcha: React.Dispatch<React.SetStateAction<boolean>>, dispatch) => {
    //TO prevent the default submission behaviour of form tag.
    e.preventDefault();

    if (validateEmail(email)) {
        dispatch(setState({email:email,otp:null}))
        // Continue with Usestates
        setIscaptcha(true);

        // Remove the cookie and Reload the page after 15 minutes
        // setTimeout(() => {
        //     Cookies.remove("otp_verified");
        //     Cookies.remove("otp_value");
        //     window.location.reload();
        // }, 15 * 60 * 1000);
    } else {
        toast.error("Invalid email. Enter a valid email address", {
            autoClose: 1500,
        });
    }
};

export default handleProceedClick;
