import { toast } from "react-toastify";

const sendGetRequestToBackend = async (email: string, otp: string) => {
    const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL+"/get_past_requests";

    // Define headers for the GET request
    const headers = new Headers();
    headers.append("X-EMAIL", email);
    headers.append("X-OTP", otp);

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: headers,
        });

        if (response.ok) {
            // Handle the successful response from the server
            const responseBody = await response.json();
            // console.log(responseBody);
            return responseBody;
            //
        } else {
            // Handle errors
            toast.error("Error in GET request:", { autoClose: 1500 });
        }
    } catch (error) {
        console.error("Error during GET request:", error);
    }
};
export default sendGetRequestToBackend;
