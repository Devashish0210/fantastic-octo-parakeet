// App/_components/EmployeeBootstrap.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";

// API helper that (in repo2) expects: (employeeLoginState, dispatch, router)
import getEmpDetails from "@/app/_api-helpers/emp-details";

// Slice: redux-toolkit/features/employee-details.ts
import { setState as setEmployeeDetails, reset as resetEmployeeDetails } from "@/redux-toolkit/features/employee-details";

// Local mirror of the slice fields for better type hints
type EmployeeDetails = {
  doj: string;
  empID: string;
  lwd: string;
  name: string;
  title: string;
};

function hasNonEmptyName(d?: Partial<EmployeeDetails>) {
  return Boolean(d?.name && d.name.trim().length > 0);
}

export default function EmployeeBootstrap() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // repo2 keeps the alumni auth info in employee_login_state (shape not needed here)
  const employeeLoginState = useSelector((s: any) => s.employee_login_state);

  // check whether employee-details are already hydrated
  const details = useAppSelector((s: any) => s.employee_details as EmployeeDetails);
  const hydrated = hasNonEmptyName(details);

  useEffect(() => {
    // Only attempt when alumni session cookie is present
    const loggedIn =
      typeof document !== "undefined" &&
      document.cookie.includes("employee_login_state=true");

    if (!loggedIn || hydrated) return;

    // Fetch and normalize into the slice shape used by repo2
    getEmpDetails(employeeLoginState, dispatch, router)
      .then((d: any) => {
        const payload: EmployeeDetails = {
          doj: String(d?.joiningDate ?? d?.doj ?? ""),
          empID: String(d?.employeeId ?? d?.empID ?? d?.empId ?? ""),
          lwd: String(d?.exitDate ?? d?.lwd ?? ""),
          name: String(d?.empName ?? d?.name ?? ""),
          title: String(d?.designation ?? d?.title ?? ""),
        };
        dispatch(setEmployeeDetails(payload));
      })
      .catch(() => {
        // On failure, clear details to a known empty state
        dispatch(resetEmployeeDetails());
      });
  }, [hydrated, dispatch, router, employeeLoginState]);

  return null;
}
