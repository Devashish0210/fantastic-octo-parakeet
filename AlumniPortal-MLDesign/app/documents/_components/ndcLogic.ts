// App/documents/_components/ndcLogic.ts
export type Ndc = {
  // NDC Owner rows
  rmNdcStatus?: string; rmNdcComment?: string;
  financeNdcStatus?: string; financeNdcComment?: string;
  adminNdcStatus?: string; adminNdcComment?: string;
  cisNdcStatus?: string; cisNdcComment?: string;
  hrssNdcStatus?: string; hrssNdcComment?: string;
  payrollNdcStatus?: string; payrollNdcComment?: string; // Final Settlement (Payroll)

  // Additional fields for document rows
  ffStatus?: string;                  // "Positive" | "Negative" | "Negative but settled"
  ffNegativeButSettled?: boolean;     // if backend provides it
  lwdDate?: string;                   // ISO date or display string
};

/* --------------------- utils --------------------- */
export function trim(s?: string) { return (s ?? "").trim(); }
export function lc(s?: string) { return trim(s).toLowerCase(); }
export function isBlank(s?: string) { return trim(s) === ""; }
export function isCompleted(s?: string) { return lc(s) === "completed"; }
export function isInTransit(s?: string) {
  const v = lc(s);
  return v === "asset in-transit" || v === "asset in transit";
}
export function isUnknown(s?: string) {
  const v = lc(s);
  return v === "unknown" || v === "na" || v === "not available";
}
export function isPendingOrBlank(s?: string) {
  const v = lc(s);
  return v === "pending" || isUnknown(v) || v === "";
}
export function displayStatus(s?: string): string {
  // Normalize empty/unknown to Pending for UI display
  return isPendingOrBlank(s) ? "Pending" : trim(s);
}

/* --------------------- owner defaults --------------------- */
const PENDING_MSG = {
  rm: "Reporting Manager clearance is pending for outstanding client or customer asset submissions",
  finance: "Finance team clearance is in progress",
  admin: "Admin clearance is pending for submission of ML ID, Access Card, Door/Project Keys",
  cis: "CIS clearance is pending due to outstanding submission of Microland assets",
  hrss: "HRSS clearance is in progress",
  payroll: "Final Settlement processing requires a minimum of 15 days from your LWD; please revisit this page after 15 calendar days",
} as const;

const COMPLETED_MSG = {
  rm: "Your Reporting Manager clearance has been successfully completed",
  finance: "Finance clearance has been successfully completed",
  admin: "Admin clearance has been successfully completed",
  cis: "CIS clearance has been successfully completed",
  hrss: "HRSS clearance has been successfully completed",
  payroll: "Your Full and Final settlement is now ready for download",
} as const;

/* Owner comment decision: prefer user comment; otherwise choose a deterministic default */
function ownerComment(owner: keyof typeof PENDING_MSG, status?: string, comment?: string): string {
  const user = trim(comment);
  if (user) return user;

  const st = trim(status);
  if (isCompleted(st) || isInTransit(st)) return COMPLETED_MSG[owner];

  // Any other non-completed state (including unknown/blank/pending/custom) shows the pending default
  return PENDING_MSG[owner];
}

/* --------------------- document helpers --------------------- */

// ordinal date: 1st April 2025
function ordinal(n: number) {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}
export function formatLwd(iso?: string): string | undefined {
  if (!iso) return undefined;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return undefined;
  const d = new Date(t);
  const day = ordinal(d.getDate());
  const month = d.toLocaleString("en-GB", { month: "long" });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

/* Relieving Letter */
export function deriveRelievingLetter(ndc?: Partial<Ndc>) {
  const d = ndc ?? {};
  const financeOk = isCompleted(d.financeNdcStatus);
  const rmOk = isCompleted(d.rmNdcStatus);
  const adminOk = isCompleted(d.adminNdcStatus);
  const cisOk = isCompleted(d.cisNdcStatus) || isInTransit(d.cisNdcStatus);

  const ready = financeOk && rmOk && adminOk && cisOk;

  if (ready) {
    const msg = "Your Relieving letter is now ready for download";
    return { statusText: msg, commentText: msg };
  }

  const pendingMsg =
    "Certain NDC clearances are in-progress. You will receive notification upon completion of all clearances. Please revisit this page for your relieving letter once all clearances are finalized";

  return { statusText: "Pending", commentText: pendingMsg };
}

/* Service Letter */
export function deriveServiceLetter(ndc?: Partial<Ndc>) {
  const d = ndc ?? {};
  const adminDone = isCompleted(d.adminNdcStatus);
  const financeDone = isCompleted(d.financeNdcStatus);
  const cisDone = isCompleted(d.cisNdcStatus);
  const hrssDone = isCompleted(d.hrssNdcStatus);
  const rmDone = isCompleted(d.rmNdcStatus);
  const payrollDone = isCompleted(d.payrollNdcStatus);

  const allCompleted = adminDone && financeDone && cisDone && hrssDone && rmDone && payrollDone;
  const payrollPending = isPendingOrBlank(d.payrollNdcStatus);
  const othersAllCompleted = adminDone && financeDone && cisDone && hrssDone && rmDone;

  const ff = lc(d.ffStatus);
  const negButSettled = d.ffNegativeButSettled === true || ff === "negative but settled";

  // 1) Payroll Pending + others Completed
  if (payrollPending && othersAllCompleted) {
    const msg =
      "Your finance settlement is in progress. Final Settlement processing requires a minimum of 15 days. Please revisit this page after 15 calendar days from your LWD";
    return { statusText: "Pending", commentText: msg };
  }

  // 2) All Completed + F&F Positive or Negative but settled
  if (allCompleted && (ff === "positive" || negButSettled)) {
    const msg =
      "Your Service letter is ready for download. Your settlement amount will be credited to your registered Microland salary account within 5 working days.";
    return { statusText: "Ready", commentText: msg };
  }

  // 3) All Completed + F&F Negative
  if (allCompleted && ff === "negative") {
    const msg =
      "Your Service letter is on-hold due to outstanding negative Final settlement. Please clear all pending dues and revisit this page";
    return { statusText: "On Hold", commentText: msg };
  }

  // Default pending narrative
  return {
    statusText: "Pending",
    commentText:
      "Certain NDC clearances are in-progress. Please revisit this page for your service letter once all clearances are finalized",
  };
}

/* Full & Final settlement (Payroll) – include LWD message for Pending */
export function deriveFullFinalWithLwd(ndc?: Partial<Ndc>) {
  const d = ndc ?? {};
  const payrollCompleted = isCompleted(d.payrollNdcStatus);
  const payrollPending = isPendingOrBlank(d.payrollNdcStatus);

  if (payrollCompleted) {
    return { statusText: COMPLETED_MSG.payroll };
  }

  if (payrollPending) {
    const lwd = formatLwd(d.lwdDate);
    const prefix = lwd ? `Your Last Working Day was ${lwd}. ` : "";
    return {
      statusText:
        prefix +
        "Subject to NDC clearance completion, Final Settlement processing requires a minimum of 15 days. " +
        "Please revisit this page after 15 calendar days from your LWD",
    };
  }

  return { statusText: displayStatus(d.payrollNdcStatus) || "Pending" };
}

/* --------------------- owner row helper --------------------- */
export function buildOwnerRow(
  owner: "rm" | "finance" | "admin" | "cis" | "hrss" | "payroll",
  status?: string,
  comment?: string
) {
  const normalizedStatus = displayStatus(status); // Pending for blank/unknown, or the given status
  const finalComment = ownerComment(owner, status, comment); // always non-empty
  return { status: normalizedStatus, comment: finalComment };
}
