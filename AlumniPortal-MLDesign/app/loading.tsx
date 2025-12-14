import { Spinner } from "@nextui-org/react";

export default function Loading() {
    return (<div className="flex justify-center items-center w-auto h-screen flex-col gap-2">
        <img
            src="https://www.microland.com/assets/images/logo.svg"
            alt="Logo"
            className="m-w-[200px]"
        />
        <h1 className="text-primary text-2xl">Alumni Services</h1>
        <Spinner />
    </div>)
}