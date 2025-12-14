// app/_layout_components/page-container.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

// Shells/navbars for the two portals
import PageAuthenticatorBGV from "./page-authentication-bgv";     // EV portal shell
import PageAuthenticatorMain from "./page-authenticator-main";   // Alumni portal shell

// Uptime gate + loading
import Loading from "../loading";
import checkServerStatus from "../_api-helpers/check-server";

// Hydrate employee details so Alumni landing shows personalized greeting
import EmployeeBootstrap from "../_components/EmployeeBootstrap";

// If repo1’s chatbot needs a provider/wrapper, import it here
// import ChatbotProvider from "../_components/chatbot/Provider";

export default function PageContainer({
  children,
}: Readonly<{ children: React.ReactNode }>): React.ReactNode {
  const path = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Routes that should skip portal wrappers and the uptime gate
  const BYPASS = new Set<string>([
    "/adminui/login",
    "/adminui/main",
    "/service-down",
    "/adminui/remove-ndc",
  ]);

  useEffect(() => {
    if (BYPASS.has(path)) {
      setLoading(false);
      return;
    }
    (async () => {
      const ok = await checkServerStatus();
      if (ok) setLoading(false);
      else router.push("/service-down");
    })();
  }, [path, router]);

  if (loading) return <Loading />;

  // Bypass admin + service pages entirely
  if (BYPASS.has(path)) return <>{children}</>;

  // Treat all EV routes as EV (exact or nested)
  const isEV =
    path === "/employee-verification" ||
    path.startsWith("/employee-verification/");

  if (isEV) {
    // If repo1’s chatbot should appear on EV too, wrap children below with ChatbotProvider
    // return (
    //   <ChatbotProvider>
    //     <PageAuthenticatorBGV>{children}</PageAuthenticatorBGV>
    //   </ChatbotProvider>
    // );
    return <PageAuthenticatorBGV>{children}</PageAuthenticatorBGV>;
  }

  // Alumni default branch: hydrate employee details to power the greeting
  // If the chatbot is needed globally on Alumni, mount its provider here as in repo1
  // return (
  //   <ChatbotProvider>
  //     <PageAuthenticatorMain path={path}>
  //       <EmployeeBootstrap />
  //       {children}
  //     </PageAuthenticatorMain>
  //   </ChatbotProvider>
  // );

  return (
    <PageAuthenticatorMain path={path}>
      <EmployeeBootstrap />
      {children}
    </PageAuthenticatorMain>
  );
}
