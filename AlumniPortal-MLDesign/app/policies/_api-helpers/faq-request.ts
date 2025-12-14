import { InitialState } from "@/redux-toolkit/features/employee-login-state";
import axios from "axios"; // Importing the Axios library for making HTTP requests
import handleLogout from "../../_api-helpers/LogOut";
import { AppDispatch } from "@/redux-toolkit/store";

// Define an asynchronous function to make a FAQ request
const faqrequest = async (employeeLoginState: InitialState, dispatch: AppDispatch, router: any) => {
    try {
        // Sending a POST request to the specified URL with the provided data
        const response = await axios.get(
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/alumni/faq-request", {
            headers: {
                'X-EMAIL': employeeLoginState.email,
                'X-ALUMNIOTP': employeeLoginState.otp,
                'X-EMPID': employeeLoginState.empID
            }
        }
        );
        if (response.status === 403) {
            handleLogout(dispatch, router)
        }

        // If the request is successful (status code 200), update the state with the received data
        if (response.status === 200) {
            return response.data; // Update the state using the provided 'setdata' function
        }
        else {
            return []
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 403) {
            handleLogout(dispatch, router)
        }
        // console.log(error); // Log the error to the console for debugging purposes
        return []
        // Handle errors if the request fails
    }
};

// Export the faqrequest function for external usage
export default faqrequest;
