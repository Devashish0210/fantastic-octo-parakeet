"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/app/utils/cookieManager";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const email = getCookie('userEmail');
        const otp = getCookie('userOtp');
        const isLoggedIn = getCookie("userEmail") && getCookie("userOtp");

        if (!isLoggedIn) {
            router.replace("/adminui/login");
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) return null; // Or a spinner if you like

    return <>{children}</>;
}
