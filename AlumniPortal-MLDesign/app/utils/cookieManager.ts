// utils/cookieManager.js
"use client";

// Set a cookie with expiration (accepts hours as decimal, e.g., 5/60 for 5 minutes)
//@ts-ignore
export const setCookie = (name, value, expiryHours = 1) => {
    const date = new Date();
    date.setTime(date.getTime() + expiryHours * 60 * 60 * 1000); // Convert hours to milliseconds
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/; Secure; SameSite=Strict`;
};

// Get a cookie by name
//@ts-ignore
export const getCookie = (name) => {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
};

// Delete a cookie
//@ts-ignore
export const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; Secure; SameSite=Strict`;
};

// Check if a cookie exists
//@ts-ignore
export const hasCookie = (name) => {
    return getCookie(name) !== null;
};

// Convenience function for setting cookie with minutes directly
//@ts-ignore
export const setCookieMinutes = (name, value, minutes = 60) => {
    setCookie(name, value, minutes / 60);
};