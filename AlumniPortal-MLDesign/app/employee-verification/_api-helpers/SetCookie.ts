// Function to set a cookie with a timeout
import Cookies from "js-cookie";
const setCookie = (key: string, value: string) => {
    Cookies.set(key, value);
};
export default setCookie;