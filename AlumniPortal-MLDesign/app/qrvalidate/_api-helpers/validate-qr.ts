import axios from "axios";

const validateQR = async (email: string, uri: string) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/qrverify`, {
            "uri": uri,
            "email": email
        });
        if (response.status === 200) {
            return true
        }
        else {
            return false
        }
    } catch (err) {

        // console.log(err)

        return false;
    }
};
export default validateQR;
