//@ts-ignore
import Cookies from "js-cookie"; 

// Define a function to set a cookie
const cookieSetfunction = (name: string, value: string) => {
    const expirationTime = 50 * 60 * 1000; // 50 minutes in milliseconds

    // Using 'js-cookie' library to set a cookie with the provided name, value, and expiration time
    Cookies.set(name, value, {
        expires: new Date(Date.now() + expirationTime), // Set expiration time for the cookie
    });
};

// Export the 'cookieSetfunction' for external usage
export default cookieSetfunction;
