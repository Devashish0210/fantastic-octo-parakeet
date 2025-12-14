import axios from "axios";

const handleVerifyCaptcha = async (value: string | null) => {
    try {
        // Send reCAPTCHA response to the server for verification
        const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/verify", {
            recaptchaValue: value,
        });
        if (response.status === 201) {
            return true
        }
        else {
            return false
        }
    } catch (error) {
        console.log(error);
        return false
    }
};

export default handleVerifyCaptcha;
