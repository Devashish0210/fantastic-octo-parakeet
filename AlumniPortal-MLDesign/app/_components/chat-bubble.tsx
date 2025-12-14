"use client";

import { useTransition } from "react";
import { useAppSelector } from "@/redux-toolkit/hooks";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Spinner } from "@nextui-org/react";

export default function ChatBubble() {
  const pathname = usePathname();
  const router = useRouter();
  const employee = useAppSelector((s) => s.employeeDetails);
  const sessionCookie = Cookies.get("employee_login_state");

  const [isPending, startTransition] = useTransition();

  const HIDE_ROUTES = ["/", "/auth", "/employee/login", "/employer/login", "/mia-chat"];
  const onAuthRoute = HIDE_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/"));

  const isAuthed = Boolean(employee?.empID || employee?.name || sessionCookie);

  if (!isAuthed || onAuthRoute) return null;

  const goToChat = () => {
    startTransition(() => {
      router.push("/mia-chat");
    });
  };

  return (
    <>
      {/* Floating button */}
      <button
        aria-label="Chat"
        onClick={goToChat}
        disabled={isPending}
        className={`
          fixed bottom-[40px] right-[40px] z-[1]
          w-[60px] h-[60px] rounded-[30px]
          bg-[#e30613] shadow-[2px_2px_3px_#999]
          flex items-center justify-center p-2 cursor-pointer
          text-white transition-opacity
          ${isPending ? 'opacity-70 cursor-wait' : 'hover:opacity-90'}
        `}
      >
        {isPending ? (
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent"></div>
        ) : (
          <svg
            viewBox="0 0 24 24"
            width="45"
            height="45"
            fill="currentColor"
            className="w-[75%] h-[75%]"
          >
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            <path d="M7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z"/>
          </svg>
        )}
      </button>

      {/* Loading overlay during navigation - matches your root loading.tsx style */}
      {isPending && (
        <div className="fixed inset-0 z-[999] bg-white flex justify-center items-center w-auto h-screen flex-col gap-2">
          <img
            src="https://www.microland.com/assets/images/logo.svg"
            alt="Logo"
            className="m-w-[200px]"
          />
          <h1 className="text-primary text-2xl">Alumni Services</h1>
          <Spinner />
        </div>
      )}
    </>
  );
}