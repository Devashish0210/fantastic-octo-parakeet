"use client"

import { Button, Spinner } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction } from "react";

export default function LoadingButton({ type, onClick, isDisabled, loading, message, text, setMessage, buttonColor, spinnerColor }: { type: "button" | "submit" | "reset" | undefined, onClick: any, isDisabled: boolean, loading: boolean, message: number, setMessage: Dispatch<SetStateAction<number>>, text: string, buttonColor: "default" | "success" | "danger" | "primary" | "secondary" | "warning" | undefined, spinnerColor: "default" | "success" | "danger" | "primary" | "secondary" | "warning" | "current" | "white" | undefined }) {
    const setMessageToText = () => { setMessage(2) }
    if (message === 1 || message === 0) {
        setTimeout(setMessageToText, 5000)
    }
    return (
        (message === 0 || message === 1) ?
            <Button isDisabled={true} color={message === 0 ? "success" : "danger"}>
                <motion.span initial={{ opacity: 0.5, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1.1 }}
                    transition={{ repeatType: "reverse", repeat: Infinity, duration: 2 }}
                    exit={{ opacity: 0.5, scale: 0.7 }} className="material-symbols-outlined"
                >
                    {message === 0 ? "check_circle" : "dangerous"}
                </motion.span>
            </Button> : <Button type={type} onClick={onClick} isDisabled={loading ? true : isDisabled} color={buttonColor}>{loading ? <Spinner color={spinnerColor} size="sm" /> : text}</Button>
    )
}