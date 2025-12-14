// app/tickets/_api-helpers/get-ticket.ts

import axios from "axios";

import { InitialState as LoginState } from "@/redux-toolkit/features/employee-login-state";

import { InitialStateData as TicketRows } from "@/redux-toolkit/features/ticket-status";

import handleLogout from "../../_api-helpers/LogOut";

import { AppDispatch, store } from "@/redux-toolkit/store"; // store gives access to employee-details

function parseDate(v: any): number | null {
  if (!v) return null;
  const s = String(v);
  // backend often returns "dd-MMM-yyyy HH:mm" or ISO; Date.parse handles ISO; add fallback if needed
  const t = Date.parse(s);
  return Number.isNaN(t) ? null : t;
}

export default async function getTickets(
  employeeLoginState: LoginState,
  dispatch: AppDispatch,
  router: any
): Promise<TicketRows> {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/alumni/tickets/get-tickets",
      {},
      {
        headers: {
          "X-EMAIL": employeeLoginState.email,
          "X-ALUMNIOTP": employeeLoginState.otp,
          "X-EMPID": employeeLoginState.empID,
        },
      }
    );

    if (response.status === 403) {
      handleLogout(dispatch, router);
      return [];
    }

    if (response.status < 200 || response.status >= 300) {
      return [];
    }

    // Map first
    const mapped: TicketRows = response.data["objTicketList"].map((value: any) => ({
      ticketDisplayNo: value["ticketDisplayNo"],
      createdOn: value["createdOn"],
      statusName: value["statusName"],
      classificationName: value["classificationName"],
      lastUpdatedOn: value["lastUpdatedOn"],
    }));

    // console.log("🎫 All tickets from backend:", mapped.length, mapped);

    // console.log("Mapped tickets:", mapped);

    // Get LWD from employee-details slice
    const lwdStr: string | undefined = (store.getState() as any)?.employee_details?.lwd;
    const lwdTs = parseDate(lwdStr);

    // console.log("Employee LWD:", lwdStr, lwdTs);

    // If no LWD, use October 10, 2025 as cutoff date for POC
    const cutoffDate = lwdTs || new Date("2025-10-10").getTime();
    // console.log("📅 Cutoff date:", new Date(cutoffDate));

    // Keep tickets created on or after the cutoff date
    const filtered = mapped.filter((t: any) => {
      const createdTs = parseDate(t.createdOn);
      return createdTs !== null && createdTs >= cutoffDate;
    });

    // console.log("Filtered tickets:", filtered);

    return filtered;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response && err.response.status === 403) {
        handleLogout(dispatch, router);
      } else {
        console.log(err);
      }
    } else {
      console.log(err);
    }
    return [];
  }
}
