import axios from "axios";

const sendEmailToServer = async (email: string) => {
    try {
        // Send user's email to the server through the API
        const response = await axios.post(`${process.env.NEXT_PUBLIC_GENERATE_OTP_ENDPOINT}`, {
            email: email,
        });
        if (response.status === 201) {
            return true
        } else {
            return false
        }
    } catch (error: any) {
        console.error("Error sending email to server:", error.message); //---------->Message needed
        // Handle error communicating with the server for sending the email
        return false
    }
};

export default sendEmailToServer;
